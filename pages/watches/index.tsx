import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Grid, Card, Box, TextField, Pagination, IconButton, InputAdornment } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../apollo/user/query';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import WatchIcon from '@mui/icons-material/Watch';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { REACT_APP_API_URL } from '../../libs/config';

const WatchesPage = () => {
	const [searchText, setSearchText] = useState('');
	const [activeType, setActiveType] = useState('');
	const [page, setPage] = useState(1);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	const { data, loading } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: page,
				limit: 12,
				search: {
					...(activeType && { typeList: [activeType] }),
					...(searchText && { text: searchText }),
				},
			},
		},
		fetchPolicy: 'network-only',
	});

	const watches = data?.getWatches?.list || [];
	const total = data?.getWatches?.metaCounter?.[0]?.total || 0;

	const types = [
		{ label: 'All Watches', value: '' },
		{ label: 'Luxury', value: 'LUXURY' },
		{ label: 'Dress', value: 'DRESS' },
		{ label: 'Sport', value: 'SPORT' },
		{ label: 'Classic', value: 'CLASSIC' },
		{ label: 'Smart', value: 'SMART' },
	];

	return (
		<>
			<Head><title>Timepiece Collection</title></Head>
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh' }}>
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
					<Typography variant="h3" sx={{ color: '#111111', fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.5rem' }, position: 'relative', zIndex: 1 }}>
						Timepiece Collection
					</Typography>
					<Typography sx={{ color: '#777', mt: 1, fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
						Discover exquisite timepieces crafted with precision and elegance
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
							placeholder="Search watches..."
							value={searchText}
							onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
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
										color: activeType === t.value ? '#FAFAFA' : '#555',
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

					{loading ? (
						<Typography sx={{ color: '#999', textAlign: 'center', py: 10 }}>Loading watches...</Typography>
					) : watches.length === 0 ? (
						<Typography sx={{ color: '#999', textAlign: 'center', py: 10 }}>No watches found</Typography>
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
										background: 'rgba(255,255,255,0.8)',
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
														Best Seller
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
													onClick={(e) => e.preventDefault()}
												>
													{watch.meLiked?.[0]?.myFavorite ? (
														<FavoriteIcon sx={{ fontSize: 18, color: '#111111' }} />
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
												color: '#555555',
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
													color: '#111111',
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
												<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '1.1rem' }}>
													${watch.watchPrice?.toLocaleString()}
												</Typography>

												<IconButton
													size="small"
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
													<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Add</span>
												</IconButton>
											</Stack>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					)}

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
				<Footer />
			</Stack>
		</>
	);
};

export default WatchesPage;
