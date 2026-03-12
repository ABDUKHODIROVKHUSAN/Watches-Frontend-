import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Grid, Card, Box, TextField, Pagination, IconButton, InputAdornment, Button } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_WATCHES } from '../../apollo/user/query';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import WatchIcon from '@mui/icons-material/Watch';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { REACT_APP_API_URL } from '../../libs/config';
import { LIKE_TARGET_WATCH } from '../../apollo/user/mutation';
import { addToCart } from '../../libs/cart';
import { userVar } from '../../apollo/store';
import { sweetInfoAlert } from '../../libs/sweetAlert';
import { useLanguage } from '../../libs/i18n/LanguageContext';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';

const WatchesPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useLanguage();
	const { isDark } = useThemeMode();
	const textPrimary = isDark ? '#E5E7EB' : '#111111';
	const textMuted = isDark ? '#AEB6C2' : '#666666';
	const [searchInput, setSearchInput] = useState('');
	const [searchText, setSearchText] = useState('');
	const [activeType, setActiveType] = useState('');
	const [page, setPage] = useState(1);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		if (!router.isReady) return;
		const querySearch = router.query.search;
		const incoming = Array.isArray(querySearch) ? querySearch[0] : querySearch;
		if (!incoming) return;
		const nextSearch = String(incoming).trim();
		setSearchInput(nextSearch);
		setSearchText(nextSearch);
		setPage(1);
	}, [router.isReady, router.query.search]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchText(searchInput.trim());
		}, 420);
		return () => clearTimeout(timer);
	}, [searchInput]);

	const queryVariables = {
		input: {
			page: page,
			limit: 12,
			search: {
				...(activeType && { typeList: [activeType] }),
				...(searchText && { text: searchText }),
			},
		},
	};

	const { data, previousData, loading } = useQuery(GET_WATCHES, {
		variables: queryVariables,
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
	});

	const [likeTargetWatch] = useMutation(LIKE_TARGET_WATCH);

	const resolvedData = data ?? previousData;
	const watches = resolvedData?.getWatches?.list || [];
	const total = resolvedData?.getWatches?.metaCounter?.[0]?.total || 0;
	const isInitialLoading = loading && !resolvedData;

	const types = [
		{ label: t('watches.all'), value: '' },
		{ label: t('watches.type.luxury'), value: 'LUXURY' },
		{ label: t('watches.type.dress'), value: 'DRESS' },
		{ label: t('watches.type.sport'), value: 'SPORT' },
		{ label: t('watches.type.classic'), value: 'CLASSIC' },
		{ label: t('watches.type.smart'), value: 'SMART' },
	];

	const resetToAllWatches = () => {
		setSearchInput('');
		setSearchText('');
		setActiveType('');
		setPage(1);
	};

	const handleToggleLike = async (e: React.MouseEvent, watchId: string) => {
		e.preventDefault();
		e.stopPropagation();

		const jwt = getJwtToken();
		if (!jwt) {
			await sweetInfoAlert(t('watches.likeLogin'));
			return;
		}

		try {
			await likeTargetWatch({
				variables: { input: watchId },
				refetchQueries: [{ query: GET_WATCHES, variables: queryVariables }],
				awaitRefetchQueries: true,
			});
		} catch (err) {
			console.log('Like toggle failed:', err);
		}
	};

	const handleAddToCart = (watch: any) => {
		const jwt = getJwtToken();
		if (!jwt) {
			void sweetInfoAlert(t('watches.cartLogin'));
			return;
		}

		addToCart(
			{
				_id: watch._id,
				watchTitle: watch.watchTitle,
				watchBrand: watch.watchBrand,
				watchPrice: Number(watch.watchPrice || 0),
				watchImage: watch.watchImages?.[0] || '',
			},
			user?._id || 'member',
		);
	};

	return (
		<>
			<Head><title>{t('watches.heroTitle')}</title></Head>
			<Stack sx={{ background: isDark ? '#0b0f16' : '#FAFAFA', minHeight: '100vh', display: 'flex' }}>
				<Top />

				<Stack sx={{
					pt: 14,
					pb: 4,
					textAlign: 'center',
					position: 'relative',
					overflow: 'hidden',
					backgroundImage:
						'linear-gradient(rgba(250,250,250,0.84), rgba(250,250,250,0.84)), url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&q=80)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
					<WatchIcon sx={{ fontSize: 40, color: '#111111', mx: 'auto', mb: 1, position: 'relative', zIndex: 1 }} />
					<Typography variant="h3" sx={{ color: textPrimary, fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.5rem' }, position: 'relative', zIndex: 1 }}>
						{t('watches.heroTitle')}
					</Typography>
					<Typography sx={{ color: isDark ? '#C8CDD6' : '#777', mt: 1, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
						{t('watches.heroSubtitle')}
					</Typography>
				</Stack>

				<Container maxWidth="lg" sx={{ pb: 6, pt: 2 }}>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						alignItems="center"
						justifyContent="space-between"
						sx={{ mb: 4, gap: 2 }}
					>
						<TextField
							size="small"
							placeholder={t('watches.searchPlaceholder')}
							value={searchInput}
							onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: '#999' }} />
									</InputAdornment>
								),
							}}
							sx={{
								width: { xs: '100%', md: 300 },
								'& .MuiOutlinedInput-root': {
									borderRadius: '8px',
									background: 'rgba(255,255,255,0.7)',
									'& fieldset': { borderColor: '#D4AF37' },
									'&:hover fieldset': { borderColor: '#111111' },
									'&.Mui-focused fieldset': { borderColor: '#111111' },
									color: textPrimary,
								},
							}}
						/>

						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							{types.map((t) => (
								<Box
									key={t.value + t.label}
									onClick={() => { setActiveType(t.value); setPage(1); }}
									sx={{
										px: 2.5,
										py: 0.8,
										borderRadius: '20px',
										fontSize: '0.85rem',
										fontWeight: 500,
										cursor: 'pointer',
										transition: 'all 0.2s',
										border: '1.5px solid',
										borderColor: activeType === t.value ? '#111111' : '#D4AF37',
										background: activeType === t.value ? '#111111' : 'rgba(255,255,255,0.6)',
										color: activeType === t.value ? '#FAFAFA' : isDark ? '#CBD2DC' : '#555',
										'&:hover': {
											borderColor: activeType === t.value ? '#111111' : '#111111',
											color: activeType === t.value ? '#FAFAFA' : '#111111',
										},
									}}
								>
									{t.label}
								</Box>
							))}
						</Stack>
					</Stack>

					<Box sx={{ minHeight: { xs: 420, md: 560 } }}>
						{isInitialLoading ? (
							<Typography sx={{ color: '#999', textAlign: 'center', py: 10 }}>{t('watches.loading')}</Typography>
						) : watches.length === 0 ? (
							<Box
								sx={{
									border: '1px dashed rgba(212,175,55,0.58)',
									borderRadius: '16px',
									background: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,248,248,0.92) 100%)',
									px: { xs: 2.5, md: 4 },
									py: { xs: 5, md: 6 },
									textAlign: 'center',
								}}
							>
								<WatchIcon sx={{ fontSize: 42, color: '#D4AF37', mb: 1.2 }} />
								<Typography sx={{ color: textPrimary, fontWeight: 600, fontSize: '1.08rem', mb: 0.7 }}>
									{t('watches.noneTitle')}
								</Typography>
								<Typography sx={{ color: textMuted, fontSize: '0.9rem', mb: 2.2 }}>
									{t('watches.noneDesc')}
								</Typography>
								<Stack direction="row" justifyContent="center" spacing={1.2} flexWrap="wrap" useFlexGap>
									<Button
										variant="outlined"
										onClick={resetToAllWatches}
										sx={{
											color: '#111111',
											borderColor: 'rgba(0,0,0,0.24)',
											fontSize: '0.78rem',
											letterSpacing: '1.1px',
											px: 2.6,
											'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
										}}
									>
										{t('watches.clearFilters')}
									</Button>
									<Button
										variant="contained"
										onClick={resetToAllWatches}
										sx={{
											background: '#111111',
											color: '#FAFAFA',
											fontSize: '0.78rem',
											letterSpacing: '1.1px',
											px: 2.6,
											'&:hover': { background: '#2B2B2B' },
										}}
									>
										{t('watches.browseAll')}
									</Button>
								</Stack>
							</Box>
						) : (
							<Grid container spacing={3}>
								{watches.map((watch: any) => (
									<Grid item xs={12} sm={6} md={4} key={watch._id}>
										<Card sx={{
										borderRadius: '16px',
										overflow: 'hidden',
										boxShadow: '0 2px 12px rgba(27,27,27,0.06)',
										border: '1px solid #D4AF37',
										transition: 'all 0.3s',
										background: isDark ? 'rgba(16,23,34,0.92)' : 'rgba(255,255,255,0.8)',
										'&:hover': {
											transform: 'translateY(-4px)',
											boxShadow: '0 8px 30px rgba(17,17,17,0.22)',
											borderColor: '#111111',
										},
									}}>
										<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
											<Box sx={{
												position: 'relative',
												height: 280,
												background: '#f0f0ec',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												overflow: 'hidden',
											}}>
												{watch.watchImages?.[0] ? (
													<img
														src={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
														alt={watch.watchTitle}
														style={{ width: '100%', height: '100%', objectFit: 'cover' }}
													/>
												) : (
													<WatchIcon sx={{ fontSize: 80, color: '#D4AF37' }} />
												)}

												{watch.watchBestSeller && (
													<Box sx={{
														position: 'absolute',
														top: 12,
														left: 12,
														background: 'rgba(212,175,55,0.92)',
														color: '#111111',
														px: 1.1,
														py: 0.35,
														borderRadius: '999px',
														fontSize: '0.66rem',
														fontWeight: 700,
														letterSpacing: '0.8px',
														textTransform: 'uppercase',
														zIndex: 2,
													}}>
														{t('watches.bestSeller')}
													</Box>
												)}

												<IconButton
													sx={{
														position: 'absolute',
														top: 12,
														right: 12,
														background: 'rgba(255,255,255,0.9)',
														backdropFilter: 'blur(4px)',
														width: 36,
														height: 36,
														'&:hover': { background: '#fff', color: '#111111' },
													}}
													onClick={(e) => handleToggleLike(e, watch._id)}
												>
													{watch.meLiked?.[0]?.myFavorite ? (
														<FavoriteIcon sx={{ fontSize: 18, color: '#E53935' }} />
													) : (
														<FavoriteBorderIcon sx={{ fontSize: 18, color: '#888' }} />
													)}
												</IconButton>

												{watch.watchType && (
													<Box sx={{
														position: 'absolute',
														bottom: 12,
														left: 12,
														background: 'rgba(17,17,17,0.78)',
														color: '#FAFAFA',
														px: 1.5,
														py: 0.4,
														borderRadius: '6px',
														fontSize: '0.75rem',
														fontWeight: 500,
													}}>
														{watch.watchType}
													</Box>
												)}
											</Box>
										</Link>

										<Box sx={{ p: 2.5 }}>
											<Typography sx={{
												color: isDark ? '#AEB6C2' : '#555555',
												fontSize: '0.7rem',
												fontWeight: 600,
												letterSpacing: '1.5px',
												textTransform: 'uppercase',
												mb: 0.5,
											}}>
												{watch.watchBrand?.replace('_', ' ')}
											</Typography>

											<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
												<Typography sx={{
													color: textPrimary,
													fontWeight: 600,
													fontSize: '1.05rem',
													mb: 1.5,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													cursor: 'pointer',
													'&:hover': { color: '#111111' },
												}}>
													{watch.watchTitle}
												</Typography>
											</Link>

											<Stack direction="row" alignItems="center" justifyContent="space-between">
												<Typography sx={{ color: textPrimary, fontWeight: 700, fontSize: '1.1rem' }}>
													${watch.watchPrice?.toLocaleString()}
												</Typography>

												<IconButton
													size="small"
													onClick={() => handleAddToCart(watch)}
													sx={{
														background: '#111111',
														color: '#FAFAFA',
														borderRadius: '8px',
														px: 1.5,
														py: 0.5,
														fontSize: '0.8rem',
														'&:hover': { background: '#2B2B2B' },
													}}
												>
													<AddShoppingCartIcon sx={{ fontSize: 16, mr: 0.5 }} />
													<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t('watches.add')}</span>
												</IconButton>
											</Stack>
										</Box>
										</Card>
									</Grid>
								))}
							</Grid>
						)}
					</Box>

					{total > 12 && (
						<Stack alignItems="center" sx={{ mt: 5 }}>
							<Pagination
								count={Math.ceil(total / 12)}
								page={page}
								onChange={(_, v) => setPage(v)}
								sx={{
									'& .MuiPaginationItem-root': { color: '#111111' },
									'& .Mui-selected': { background: '#111111 !important', color: '#FAFAFA' },
								}}
							/>
						</Stack>
					)}
				</Container>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default WatchesPage;
