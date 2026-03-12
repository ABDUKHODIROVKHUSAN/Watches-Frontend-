import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, Container, Grid, IconButton } from '@mui/material';
import Head from 'next/head';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';
import Link from 'next/link';
import { getJwtToken, updateUserInfo } from '../libs/auth';
import { useQuery } from '@apollo/client';
import { GET_BEST_SELLER_WATCHES_ROW, GET_WATCHES } from '../apollo/user/query';
import { REACT_APP_API_URL } from '../libs/config';
import WatchIcon from '@mui/icons-material/Watch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { useLanguage } from '../libs/i18n/LanguageContext';
import { useThemeMode } from '../libs/theme/ThemeModeContext';

const Home = () => {
	const { t, locale } = useLanguage();
	const { isDark } = useThemeMode();
	const [hoveredBestSellerId, setHoveredBestSellerId] = useState<string | null>(null);
	const [celebrityStartIndex, setCelebrityStartIndex] = useState(0);
	const [showLeftCelebrityArrow, setShowLeftCelebrityArrow] = useState(false);
	const [featuredGroupIndex, setFeaturedGroupIndex] = useState(0);
	const [showFeaturedBrands, setShowFeaturedBrands] = useState(true);

	const featuredBrandGroups = [
		['ROLEX', 'OMEGA', 'CARTIER', 'TAG HEUER', 'PATEK PHILIPPE', 'BREITLING', 'HUBLOT', 'IWC', 'AUDEMARS PIGUET'],
		['RICHARD MILLE', 'VACHERON CONSTANTIN', 'TUDOR', 'PANERAI', 'ZENITH', 'LONGINES', 'TISSOT', 'BULGARI', 'CHOPARD'],
		['HERMES', 'CHANEL', 'GUCCI', 'LOUIS VUITTON', 'BAUME & MERCIER', 'JAEGER-LECOULTRE', 'MONTBLANC', 'BREGUET', 'HARRY WINSTON'],
	];

	const celebrityWearers = [
		{
			name: 'Ryan Gosling',
			brand: 'TAG HEUER',
			image: '/img/celebrities/ryan-gosling-tag-heuer.png',
			position: 'center center',
		},
		{
			name: 'Jung Kook',
			brand: 'HUBLOT',
			image: '/img/celebrities/jungkook-rolex.png',
			position: 'center center',
		},
		{
			name: 'Carlos Alcaraz',
			brand: 'ROLEX',
			image: '/img/celebrities/carlos-alcaraz-rolex.png',
			position: 'center center',
		},
		{
			name: 'Erling Haaland',
			brand: 'BREITLING',
			image: '/img/celebrities/erling-haaland-breitling.png',
			position: 'center center',
		},
		{
			name: 'Eileen Gu',
			brand: 'IWC',
			image: '/img/celebrities/eileen-gu-iwc.png',
			position: 'center center',
		},
		{
			name: 'Jacob Elordi',
			brand: 'CARTIER',
			image: '/img/celebrities/jacob-elordi-cartier-v2.png',
			position: 'center center',
		},
	];

	const visibleCelebrityWearers = [
		celebrityWearers[celebrityStartIndex % celebrityWearers.length],
		celebrityWearers[(celebrityStartIndex + 1) % celebrityWearers.length],
	];

	const showNextCelebrity = () => {
		setShowLeftCelebrityArrow(true);
		setCelebrityStartIndex((prev) => (prev + 1) % celebrityWearers.length);
	};

	const showPreviousCelebrity = () => {
		setCelebrityStartIndex((prev) => (prev - 1 + celebrityWearers.length) % celebrityWearers.length);
	};

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setShowFeaturedBrands(false);
			setTimeout(() => {
				setFeaturedGroupIndex((prev) => (prev + 1) % featuredBrandGroups.length);
				setShowFeaturedBrands(true);
			}, 380);
		}, 3000);

		return () => clearInterval(interval);
	}, [featuredBrandGroups.length]);

	const { data } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				search: {},
			},
		},
		fetchPolicy: 'network-only',
	});

	const newArrivals = data?.getWatches?.list || [];

	const { data: bestSellersData } = useQuery(GET_BEST_SELLER_WATCHES_ROW, {
		fetchPolicy: 'network-only',
	});

	const bestSellers = bestSellersData?.getBestSellerWatchesRow?.list || [];
	const pageBackground = isDark ? '#0b0f16' : '#FAFAFA';
	const sectionLight = isDark ? '#101722' : '#FFFFFF';
	const sectionAlt = isDark ? '#0f1724' : '#FAFAFA';
	const textPrimary = isDark ? '#E5E7EB' : '#111111';
	const textSecondary = isDark ? '#9CA3AF' : '#666';
	const heroTitle = 'TIMELESS ELEGANCE';
	const featuredBrandsLabel = locale === 'ko' ? '주요 브랜드' : locale === 'uz' ? 'Mashhur brendlar' : 'Featured Brands';
	const featuredBrandsSubtitle =
		locale === 'ko'
			? '세계적인 워치메이커 공식 판매처'
			: locale === 'uz'
				? 'Dunyo miqyosidagi soat brendlarining rasmiy hamkori'
				: 'Authorized dealer of world-renowned watchmakers';
	const latestCollectionLabel = locale === 'ko' ? '최신 컬렉션' : locale === 'uz' ? 'So‘nggi kolleksiya' : 'Latest Collection';
	const newArrivalsLabel = locale === 'ko' ? '신상품' : locale === 'uz' ? 'YANGI KELGANLAR' : 'NEW ARRIVALS';

	return (
		<>
			<Head>
				<title>{t('home.metaTitle')}</title>
			</Head>
			<Stack sx={{ background: pageBackground }}>
				<Top />
				<Stack sx={{
					minHeight: '100vh',
					backgroundImage: 'url(https://images.unsplash.com/photo-1642515839492-a740aa8f6339?auto=format&fit=crop&w=1920&q=90)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					position: 'relative',
					overflow: 'hidden',
				}}>
					<Box sx={{ position: 'absolute', inset: 0, background: 'rgba(17, 17, 17, 0.5)' }} />
					<Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
						<Box
							component="h1"
							sx={{
								fontSize: { xs: '2.5rem', md: '4.5rem' },
								fontWeight: 700,
								color: 'rgba(250,250,250,0.62)',
								mb: 2,
								letterSpacing: '2px',
								m: 0,
								position: 'relative',
								display: 'inline-flex',
								flexWrap: 'wrap',
								justifyContent: 'center',
								gap: 0,
								'@keyframes heroTitleReveal': {
									'0%': { opacity: 0, transform: 'translateY(16px)' },
									'100%': { opacity: 1, transform: 'translateY(0)' },
								},
								'@keyframes heroLetterShine': {
									'0%, 78%, 100%': {
										color: 'rgba(250,250,250,0.62)',
										textShadow: '0 0 0 rgba(255,255,255,0)',
									},
									'84%': {
										color: 'rgba(255,255,255,0.96)',
										textShadow: '0 0 10px rgba(255,255,255,0.38)',
									},
									'90%': {
										color: 'rgba(250,250,250,0.72)',
										textShadow: '0 0 0 rgba(255,255,255,0)',
									},
								},
							}}
						>
							{Array.from(heroTitle).map((char, idx) => (
								<Box
									key={`${char}-${idx}`}
									component="span"
									sx={{
										display: 'inline-block',
										opacity: 0,
										animation: `heroTitleReveal 650ms ease forwards, heroLetterShine 6.8s ease-in-out infinite`,
										animationDelay: `${idx * 42}ms, ${950 + idx * 95}ms`,
										whiteSpace: char === ' ' ? 'pre' : 'normal',
										minWidth: char === ' ' ? '0.35em' : 'auto',
									}}
								>
									{char}
								</Box>
							))}
						</Box>
						<Typography variant="h5" sx={{
							color: '#D4AF37',
							mb: 4,
							fontWeight: 300,
							letterSpacing: '4px',
							textTransform: 'uppercase',
						}}>
							{t('home.heroSubtitle')}
						</Typography>
						<Typography sx={{ color: 'rgba(248,250,249,0.86)', mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
							{t('home.heroDescription')}
						</Typography>
						<Link href="/watches" passHref>
							<Button variant="outlined" size="large" sx={{
								color: '#D4AF37',
								borderColor: '#D4AF37',
								px: 6,
								py: 1.5,
								fontSize: '1rem',
								letterSpacing: '2px',
								'&:hover': { borderColor: '#FAFAFA', color: '#FAFAFA', background: 'rgba(17,17,17,0.18)' },
							}}>
								{t('home.exploreCollection')}
							</Button>
						</Link>
					</Container>
					<Box
						sx={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 18,
							zIndex: 1,
							px: { xs: 1.2, md: 2.2 },
							pointerEvents: 'none',
						}}
					>
						<Stack
							direction="row"
							justifyContent="center"
							alignItems="center"
							flexWrap="wrap"
							useFlexGap
							gap={{ xs: 1.6, md: 2.8 }}
							sx={{
								opacity: 0.38,
							}}
						>
							{['ROLEX', 'SEIKO', 'OMEGA', 'TISSOT', 'CARTIER', 'IWC', 'HUBLOT', 'BREITLING'].map((brand, idx) => (
								<Box
									key={brand}
									sx={{
										color: 'rgba(250,250,250,0.78)',
										fontSize: { xs: '0.58rem', md: '0.66rem' },
										fontWeight: 600,
										letterSpacing: { xs: '1.6px', md: '2.4px' },
										textTransform: 'uppercase',
										px: 0.2,
										...(idx !== 0 && {
											position: 'relative',
											pl: { xs: 1.1, md: 1.6 },
											'&::before': {
												content: '""',
												position: 'absolute',
												left: 0,
												top: '50%',
												transform: 'translateY(-50%)',
												width: { xs: 3, md: 4 },
												height: 1,
												background: 'rgba(212,175,55,0.6)',
											},
										}),
									}}
								>
									{brand}
								</Box>
							))}
						</Stack>
					</Box>
				</Stack>

					<Stack sx={{ background: sectionAlt, py: { xs: 8, md: 10 } }}>
					<Container maxWidth="lg">
						<Typography variant="h4" sx={{ color: textPrimary, textAlign: 'center', mb: 1, fontWeight: 600 }}>
							{featuredBrandsLabel}
						</Typography>
						<Typography sx={{ color: textSecondary, textAlign: 'center', mb: 5 }}>
							{featuredBrandsSubtitle}
						</Typography>
						<Stack
							direction="row"
							justifyContent="center"
							flexWrap="wrap"
							gap={3}
							sx={{
								opacity: showFeaturedBrands ? 1 : 0,
								transition: 'opacity 0.38s ease',
							}}
						>
							{featuredBrandGroups[featuredGroupIndex].map((brand) => (
								<Box key={brand} sx={{
									px: 4, py: 2,
									border: '1.5px solid #D4AF37',
									borderRadius: '8px',
									color: textPrimary,
									fontWeight: 500,
									letterSpacing: '2px',
									fontSize: '0.85rem',
									background: isDark ? 'rgba(15,23,36,0.55)' : 'rgba(255,255,255,0.5)',
									transition: 'all 0.3s',
									'&:hover': {
										borderColor: '#D4AF37',
										color: textPrimary,
										background: isDark ? 'rgba(16,23,34,0.92)' : 'rgba(255,255,255,0.8)',
									},
								}}>
									{brand}
								</Box>
							))}
						</Stack>
					</Container>
				</Stack>

				{/* NEW ARRIVALS */}
				<Stack id="new-arrivals" sx={{ background: sectionLight, py: { xs: 8, md: 12 } }}>
					<Container maxWidth="lg">
						<Stack alignItems="center" sx={{ mb: { xs: 5, md: 8 } }}>
							<Typography sx={{
								color: isDark ? '#AEB6C2' : '#555555',
								fontSize: '0.8rem',
								fontWeight: 500,
								letterSpacing: '4px',
								textTransform: 'uppercase',
								mb: 1.5,
							}}>
								{latestCollectionLabel}
							</Typography>
							<Typography sx={{
								color: textPrimary,
								fontSize: { xs: '2.4rem', md: '3rem' },
								fontWeight: 500,
								letterSpacing: '0.5px',
							}}>
								{newArrivalsLabel}
							</Typography>
							<Box sx={{ width: 40, height: 1.5, background: '#D4AF37', mt: 2 }} />
						</Stack>

						{newArrivals.length > 0 ? (
							<Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
								{newArrivals.map((watch: any) => (
									<Grid item xs={6} md={3} key={watch._id}>
										<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
											<Stack alignItems="center" sx={{
												cursor: 'pointer',
												transition: 'all 0.4s ease',
												'&:hover': { transform: 'translateY(-6px)' },
												'&:hover .watch-img': { transform: 'scale(1.03)' },
											}}>
												<Box sx={{
													width: '100%',
													height: { xs: 220, md: 300 },
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													overflow: 'hidden',
													mb: 2.5,
												}}>
													{watch.watchImages?.[0] ? (
														<Box
															component="img"
															className="watch-img"
															src={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
															alt={watch.watchTitle}
															sx={{
																maxHeight: '100%',
																maxWidth: '100%',
																objectFit: 'contain',
																transition: 'transform 0.4s ease',
															}}
														/>
													) : (
														<WatchIcon sx={{ fontSize: 80, color: '#D4AF37' }} />
													)}
												</Box>

												<Typography sx={{
													color: isDark ? '#AEB6C2' : '#888',
													fontSize: '0.75rem',
													letterSpacing: '2px',
													textTransform: 'uppercase',
													mb: 0.5,
												}}>
													{watch.watchTitle}
												</Typography>

												<Typography sx={{
													color: textPrimary,
													fontSize: '0.95rem',
													fontWeight: 500,
													letterSpacing: '1.5px',
													textTransform: 'uppercase',
													mb: 0.5,
												}}>
													{watch.watchBrand?.replace('_', ' ')}
												</Typography>

												<Typography sx={{
													color: isDark ? '#BFC6D1' : '#333333',
													fontSize: '0.8rem',
													fontStyle: 'italic',
													fontWeight: 400,
												}}>
													{watch.watchType?.charAt(0) + watch.watchType?.slice(1).toLowerCase()}
												</Typography>
											</Stack>
										</Link>
									</Grid>
								))}
							</Grid>
						) : (
							<Typography sx={{ color: '#999', textAlign: 'center', py: 6 }}>
								{t('home.noWatches')}
							</Typography>
						)}

						<Stack alignItems="center" sx={{ mt: { xs: 5, md: 8 } }}>
							<Link href="/watches" passHref>
								<Button variant="outlined" sx={{
									color: textPrimary,
									borderColor: isDark ? '#AEB6C2' : '#111111',
									px: 5,
									py: 1.3,
									fontSize: '0.8rem',
									letterSpacing: '3px',
									fontWeight: 500,
									borderRadius: '2px',
									'&:hover': {
										borderColor: '#D4AF37',
										color: '#D4AF37',
										background: 'transparent',
									},
								}}>
									{t('watches.viewAll')}
								</Button>
							</Link>
						</Stack>
					</Container>
				</Stack>

				{/* BEST SELLERS */}
				<Stack sx={{ background: '#0A0D12', py: { xs: 8, md: 11 } }}>
					<Container maxWidth="xl">
						<Stack sx={{ mb: { xs: 6, md: 8 }, pl: { md: 2 } }}>
							<Typography sx={{ color: '#FAFAFA', fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
								{t('home.bestSellers')}
							</Typography>
						</Stack>

						{bestSellers.length > 0 ? (
							<Grid container spacing={{ xs: 3, md: 7 }} justifyContent="center" alignItems="end">
								{bestSellers.map((watch: any) => {
									const muted = hoveredBestSellerId && hoveredBestSellerId !== String(watch._id);
									const isHovered = hoveredBestSellerId === String(watch._id);
									return (
										<Grid item xs={12} md={4} key={watch._id}>
											<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
												<Stack
													alignItems="center"
													onMouseEnter={() => setHoveredBestSellerId(String(watch._id))}
													onMouseLeave={() => setHoveredBestSellerId(null)}
													sx={{
														cursor: 'pointer',
														opacity: muted ? 0.25 : 1,
														transition: 'opacity 0.35s ease, transform 0.35s ease',
														transform: isHovered ? 'scale(1.06)' : muted ? 'scale(0.96)' : 'scale(1)',
														zIndex: isHovered ? 2 : 1,
													}}
												>
													<Box sx={{
														width: '100%',
														height: { xs: 320, md: 430 },
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														mb: 2.5,
													}}>
														{watch.watchImages?.[0] ? (
															<Box
																component="img"
																src={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
																alt={watch.watchTitle}
																sx={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain' }}
															/>
														) : (
															<WatchIcon sx={{ fontSize: 140, color: '#D4AF37' }} />
														)}
													</Box>

													<Box sx={{ width: 16, height: 2, background: '#D4AF37', mb: 2 }} />
													<Typography sx={{ color: '#FAFAFA', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '1.8px', textTransform: 'uppercase', textAlign: 'center', mb: 0.5 }}>
														{watch.watchTitle}
													</Typography>
													<Typography sx={{ color: '#9aa7b2', fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', textAlign: 'center' }}>
														{watch.watchBrand?.replace('_', ' ')}
													</Typography>
												</Stack>
											</Link>
										</Grid>
									);
								})}
							</Grid>
						) : (
							<Typography sx={{ color: 'rgba(248,250,249,0.74)', textAlign: 'center', py: 4 }}>
								{t('home.noBestSellers')}
							</Typography>
						)}
					</Container>
				</Stack>

				{/* CELEBRITY WEARERS */}
				<Stack
					id="celebrity-wearers"
					sx={{
						background: '#111111',
						py: 0,
						minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<Stack
						key={celebrityStartIndex}
						direction={{ xs: 'column', md: 'row' }}
						sx={{
							minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
							height: { xs: 'auto', md: 'calc(100vh - 64px)' },
							animation: 'celebritySlide 0.55s ease',
							'@keyframes celebritySlide': {
								'0%': { transform: 'translateX(24px)', opacity: 0.65 },
								'100%': { transform: 'translateX(0)', opacity: 1 },
							},
						}}
					>
						{visibleCelebrityWearers.map((celebrity) => (
							<Box
								key={`${celebrity.name}-${celebrity.brand}`}
								sx={{
									position: 'relative',
									flex: 1,
									minHeight: { xs: 320, md: 'calc(100vh - 64px)' },
									height: { xs: 320, md: 'calc(100vh - 64px)' },
									overflow: 'hidden',
									background: '#7b7d80',
									borderRight: { xs: 'none', md: '2px solid rgba(220,220,220,0.35)' },
								}}
							>
								<Box
									component="img"
									src={celebrity.image}
									alt={`${celebrity.name} wearing ${celebrity.brand}`}
									sx={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										objectPosition: celebrity.position,
										filter: 'grayscale(100%) contrast(1.06) brightness(0.98)',
										transform: 'scale(1)',
										transformOrigin: 'center center',
									}}
								/>
								<Box
									sx={{
										position: 'absolute',
										inset: 0,
										background:
											'linear-gradient(to top, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.1) 38%, rgba(8,8,8,0.2) 100%)',
									}}
								/>

								<Box sx={{ position: 'absolute', left: 22, bottom: 18, zIndex: 2 }}>
									<Typography sx={{ color: '#FAFAFA', fontSize: { xs: '1.1rem', md: '1.5rem' }, fontWeight: 600, letterSpacing: '0.5px' }}>
										{celebrity.name}
									</Typography>
								</Box>

								<Box sx={{ position: 'absolute', right: 22, bottom: 16, zIndex: 2 }}>
									<Typography
										sx={{
											color: '#D4AF37',
											fontSize: { xs: '0.8rem', md: '0.95rem' },
											fontWeight: 700,
											letterSpacing: '2px',
											textTransform: 'uppercase',
										}}
									>
										{celebrity.brand}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>

					{showLeftCelebrityArrow && (
						<IconButton
							disableRipple
							onClick={showPreviousCelebrity}
							sx={{
								position: 'absolute',
								left: { xs: 10, md: 18 },
								top: '50%',
								transform: 'translateY(-50%)',
								color: 'rgba(250,250,250,0.6)',
								background: 'transparent',
								p: 0.25,
								zIndex: 3,
								'&:hover': {
									color: '#FAFAFA',
									background: 'transparent',
								},
							}}
						>
							<ChevronLeftRoundedIcon sx={{ fontSize: { xs: 24, md: 30 } }} />
						</IconButton>
					)}

					<IconButton
						disableRipple
						onClick={showNextCelebrity}
						sx={{
							position: 'absolute',
							right: { xs: 10, md: 18 },
							top: '50%',
							transform: 'translateY(-50%)',
							color: 'rgba(250,250,250,0.6)',
							background: 'transparent',
							p: 0.25,
							zIndex: 3,
							animation: 'arrowPulse 1.9s ease-in-out infinite',
							'@keyframes arrowPulse': {
								'0%': { transform: 'translateY(-50%) scale(1)', opacity: 0.72 },
								'50%': { transform: 'translateY(-50%) scale(1.06)', opacity: 1 },
								'100%': { transform: 'translateY(-50%) scale(1)', opacity: 0.72 },
							},
							'&:hover': {
								color: '#FAFAFA',
								background: 'transparent',
							},
						}}
					>
						<ChevronRightRoundedIcon sx={{ fontSize: { xs: 24, md: 30 } }} />
					</IconButton>
				</Stack>

				<Stack sx={{ background: isDark ? '#0f1724' : 'rgba(17,17,17,0.06)', py: { xs: 8, md: 10 } }}>
					<Container maxWidth="lg">
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
							<Box flex={1}>
								<Typography variant="h4" sx={{ color: textPrimary, mb: 2, fontWeight: 600 }}>
									{t('home.aiInsightsTitle')}
								</Typography>
								<Typography sx={{ color: textSecondary, mb: 3, lineHeight: 1.8 }}>
									{t('home.aiInsightsDesc')}
								</Typography>
								<Link href="/watches" passHref>
									<Button variant="contained" sx={{
										background: '#111111',
										color: '#FAFAFA',
										fontWeight: 600,
										px: 4,
										borderRadius: '8px',
										'&:hover': { background: '#2B2B2B' },
									}}>
										{t('home.browseWatches')}
									</Button>
								</Link>
							</Box>
							<Box flex={1} sx={{
								height: 300,
								borderRadius: '16px',
								background: isDark ? 'rgba(16,23,34,0.8)' : 'rgba(255,255,255,0.5)',
								border: '1px solid #D4AF37',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								<AutoAwesomeIcon sx={{ fontSize: 100, color: 'rgba(17,17,17,0.35)' }} />
							</Box>
						</Stack>
					</Container>
				</Stack>

				<Footer />
			</Stack>
		</>
	);
};

export default Home;
