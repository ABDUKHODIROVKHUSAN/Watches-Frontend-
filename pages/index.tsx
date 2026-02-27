import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, Button, Container, Grid, IconButton } from '@mui/material';
import Head from 'next/head';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';
import Link from 'next/link';
import { getJwtToken, updateUserInfo } from '../libs/auth';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../apollo/user/query';
import { REACT_APP_API_URL } from '../libs/config';
import WatchIcon from '@mui/icons-material/Watch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

const Home = () => {
	const [hoveredBestSellerId, setHoveredBestSellerId] = useState<string | null>(null);
	const [celebrityStartIndex, setCelebrityStartIndex] = useState(0);
	const [showLeftCelebrityArrow, setShowLeftCelebrityArrow] = useState(false);

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

	const { data: bestSellersData } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: 1,
				limit: 3,
				sort: 'updatedAt',
				search: {
					options: ['watchBestSeller'],
				},
			},
		},
		fetchPolicy: 'network-only',
	});

	const bestSellers = bestSellersData?.getWatches?.list || [];

	return (
		<>
			<Head>
				<title>Timeless Watches - Premium Luxury Timepieces</title>
			</Head>
			<Stack>
				<Top />
				<Stack sx={{
					minHeight: '100vh',
					backgroundImage: 'url(https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1920&q=80)',
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
						<WatchIcon sx={{ fontSize: 70, color: '#D4AF37', mb: 3 }} />
						<Typography variant="h1" sx={{
							fontSize: { xs: '2.5rem', md: '4.5rem' },
							fontWeight: 700,
							color: 'rgba(250,250,250,0.62)',
							mb: 2,
							letterSpacing: '2px',
						}}>
							TIMELESS ELEGANCE
						</Typography>
						<Typography variant="h5" sx={{
							color: '#D4AF37',
							mb: 4,
							fontWeight: 300,
							letterSpacing: '4px',
							textTransform: 'uppercase',
						}}>
							Premium Luxury Watches
						</Typography>
						<Typography sx={{ color: 'rgba(248,250,249,0.86)', mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
							Discover our curated collection of the world&apos;s finest timepieces. From Rolex to Patek Philippe, find the perfect watch that speaks to your style.
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
								EXPLORE COLLECTION
							</Button>
						</Link>
					</Container>
				</Stack>

					<Stack sx={{ background: '#FAFAFA', py: { xs: 8, md: 10 } }}>
					<Container maxWidth="lg">
						<Typography variant="h4" sx={{ color: '#111111', textAlign: 'center', mb: 1, fontWeight: 600 }}>
							Featured Brands
						</Typography>
						<Typography sx={{ color: '#777', textAlign: 'center', mb: 5 }}>
							Authorized dealer of world-renowned watchmakers
						</Typography>
						<Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3}>
							{['ROLEX', 'OMEGA', 'CARTIER', 'TAG HEUER', 'PATEK PHILIPPE', 'BREITLING', 'HUBLOT', 'IWC'].map((brand) => (
								<Box key={brand} sx={{
									px: 4, py: 2,
									border: '1.5px solid #D4AF37',
									borderRadius: '8px',
									color: '#111111',
									fontWeight: 500,
									letterSpacing: '2px',
									fontSize: '0.85rem',
									background: 'rgba(255,255,255,0.5)',
									transition: 'all 0.3s',
									'&:hover': { borderColor: '#111111', color: '#111111', background: 'rgba(255,255,255,0.8)' },
								}}>
									{brand}
								</Box>
							))}
						</Stack>
					</Container>
				</Stack>

				{/* NEW ARRIVALS */}
				<Stack sx={{ background: '#FFFFFF', py: { xs: 8, md: 12 } }}>
					<Container maxWidth="lg">
						<Stack alignItems="center" sx={{ mb: { xs: 5, md: 8 } }}>
							<Typography sx={{
								color: '#555555',
								fontSize: '0.8rem',
								fontWeight: 500,
								letterSpacing: '4px',
								textTransform: 'uppercase',
								mb: 1.5,
							}}>
								Latest Collection
							</Typography>
							<Typography sx={{
								color: '#111111',
								fontSize: { xs: '1.8rem', md: '2.8rem' },
								fontWeight: 300,
								letterSpacing: '3px',
								fontFamily: '"Georgia", "Times New Roman", serif',
							}}>
								NEW ARRIVALS
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
													color: '#888',
													fontSize: '0.75rem',
													letterSpacing: '2px',
													textTransform: 'uppercase',
													mb: 0.5,
												}}>
													{watch.watchTitle}
												</Typography>

												<Typography sx={{
													color: '#111111',
													fontSize: '0.95rem',
													fontWeight: 500,
													letterSpacing: '1.5px',
													textTransform: 'uppercase',
													mb: 0.5,
												}}>
													{watch.watchBrand?.replace('_', ' ')}
												</Typography>

												<Typography sx={{
													color: '#333333',
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
								No watches available yet
							</Typography>
						)}

						<Stack alignItems="center" sx={{ mt: { xs: 5, md: 8 } }}>
							<Link href="/watches" passHref>
								<Button variant="outlined" sx={{
									color: '#111111',
									borderColor: '#111111',
									px: 5,
									py: 1.3,
									fontSize: '0.8rem',
									letterSpacing: '3px',
									fontWeight: 500,
									borderRadius: '2px',
									'&:hover': {
										borderColor: '#111111',
										color: '#111111',
										background: 'transparent',
									},
								}}>
									VIEW ALL WATCHES
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
								Best Sellers
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
								No best sellers selected yet
							</Typography>
						)}
					</Container>
				</Stack>

				{/* CELEBRITY WEARERS */}
				<Stack
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

				<Stack sx={{ background: 'rgba(17,17,17,0.06)', py: { xs: 8, md: 10 } }}>
					<Container maxWidth="lg">
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
							<Box flex={1}>
								<Typography variant="h4" sx={{ color: '#111111', mb: 2, fontWeight: 600 }}>
									AI-Powered Insights
								</Typography>
								<Typography sx={{ color: '#666', mb: 3, lineHeight: 1.8 }}>
									Get detailed information about any watch with our AI assistant. Learn about celebrity wearers, fashion tips, market prices, and fascinating history — all at the click of a button.
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
										Browse Watches
									</Button>
								</Link>
							</Box>
							<Box flex={1} sx={{
								height: 300,
								borderRadius: '16px',
								background: 'rgba(255,255,255,0.5)',
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
