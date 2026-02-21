import React, { useEffect } from 'react';
import { Stack, Box, Typography, Button, Container } from '@mui/material';
import Head from 'next/head';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';
import Link from 'next/link';
import { getJwtToken, updateUserInfo } from '../libs/auth';
import WatchIcon from '@mui/icons-material/Watch';

const Home = () => {
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	return (
		<>
			<Head>
				<title>Watches - Premium Luxury Timepieces</title>
			</Head>
			<Stack id="pc-wrap">
				<Top />
			<Stack className="hero-section" sx={{
				minHeight: '100vh',
				backgroundImage: 'url(https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1920&q=80)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				position: 'relative',
				overflow: 'hidden',
			}}>
				<Box sx={{
					position: 'absolute',
					inset: 0,
					background: 'rgba(10, 10, 20, 0.75)',
				}} />
					<Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
						<WatchIcon sx={{ fontSize: 80, color: '#c9a96e', mb: 3 }} />
						<Typography variant="h1" sx={{
							fontSize: { xs: '2.5rem', md: '4.5rem' },
							fontWeight: 700,
							color: '#fff',
							mb: 2,
							letterSpacing: '2px',
						}}>
							TIMELESS ELEGANCE
						</Typography>
						<Typography variant="h5" sx={{
							color: '#c9a96e',
							mb: 4,
							fontWeight: 300,
							letterSpacing: '4px',
							textTransform: 'uppercase',
						}}>
							Premium Luxury Watches
						</Typography>
						<Typography sx={{ color: '#b0b0b0', mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
							Discover our curated collection of the world&apos;s finest timepieces. From Rolex to Patek Philippe, find the perfect watch that speaks to your style.
						</Typography>
						<Link href="/watches" passHref>
							<Button variant="outlined" size="large" sx={{
								color: '#c9a96e',
								borderColor: '#c9a96e',
								px: 6,
								py: 1.5,
								fontSize: '1rem',
								letterSpacing: '2px',
								'&:hover': { borderColor: '#fff', color: '#fff', background: 'rgba(201,169,110,0.1)' },
							}}>
								EXPLORE COLLECTION
							</Button>
						</Link>
					</Container>
				</Stack>

				<Stack sx={{ background: '#0f0f1a', py: 10 }}>
					<Container maxWidth="lg">
						<Typography variant="h4" sx={{ color: '#fff', textAlign: 'center', mb: 1, fontWeight: 600 }}>
							Featured Brands
						</Typography>
						<Typography sx={{ color: '#b0b0b0', textAlign: 'center', mb: 6 }}>
							Authorized dealer of world-renowned watchmakers
						</Typography>
						<Stack direction="row" justifyContent="center" flexWrap="wrap" gap={6}>
							{['ROLEX', 'OMEGA', 'CARTIER', 'TAG HEUER', 'PATEK PHILIPPE', 'BREITLING', 'HUBLOT', 'IWC'].map((brand) => (
								<Box key={brand} sx={{
									px: 4, py: 2,
									border: '1px solid rgba(201,169,110,0.2)',
									borderRadius: '8px',
									color: '#c9a96e',
									fontWeight: 500,
									letterSpacing: '2px',
									fontSize: '0.85rem',
									transition: 'all 0.3s',
									'&:hover': { borderColor: '#c9a96e', background: 'rgba(201,169,110,0.05)' },
								}}>
									{brand}
								</Box>
							))}
						</Stack>
					</Container>
				</Stack>

				<Stack sx={{ background: '#1a1a2e', py: 10 }}>
					<Container maxWidth="lg">
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
							<Box flex={1}>
								<Typography variant="h4" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
									AI-Powered Insights
								</Typography>
								<Typography sx={{ color: '#b0b0b0', mb: 3, lineHeight: 1.8 }}>
									Get detailed information about any watch with our AI assistant. Learn about celebrity wearers, fashion tips, market prices, and fascinating history — all at the click of a button.
								</Typography>
								<Link href="/watches" passHref>
									<Button variant="contained" sx={{
										background: '#c9a96e',
										color: '#0f0f1a',
										fontWeight: 600,
										px: 4,
										'&:hover': { background: '#b8944f' },
									}}>
										Browse Watches
									</Button>
								</Link>
							</Box>
							<Box flex={1} sx={{
								height: 300,
								borderRadius: '16px',
								background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(201,169,110,0.05))',
								border: '1px solid rgba(201,169,110,0.2)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								<WatchIcon sx={{ fontSize: 120, color: 'rgba(201,169,110,0.3)' }} />
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
