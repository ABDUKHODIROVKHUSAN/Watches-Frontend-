import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Box, Grid, IconButton, TextField, InputAdornment } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';

const ContactPage = () => {
	const [watchSearch, setWatchSearch] = useState('');

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	return (
		<>
			<Head><title>Contact - Timeless Watches</title></Head>
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex' }}>
				<Top />

				{/* HERO */}
				<Stack
					sx={{
						minHeight: { xs: 340, md: 430 },
						background: '#050505',
						position: 'relative',
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						pt: 8,
						px: 2,
						textAlign: 'center',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							backgroundImage: 'url(https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'left center',
							opacity: 0.32,
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							background:
								'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.78) 35%, rgba(0,0,0,0.86) 100%)',
						}}
					/>
					<Box sx={{ position: 'relative', zIndex: 1 }}>
						<Typography
							sx={{
								color: 'rgba(212,175,55,0.9)',
								fontSize: '0.72rem',
								fontWeight: 700,
								letterSpacing: '2.8px',
								textTransform: 'uppercase',
								mb: 1.2,
							}}
						>
							Timeless Watches
						</Typography>
						<Typography
							sx={{
								color: '#FAFAFA',
								fontSize: { xs: '2.4rem', md: '3.3rem' },
								fontWeight: 700,
								letterSpacing: '2px',
								lineHeight: 1.05,
								mb: 1.3,
							}}
						>
							CONTACT
						</Typography>
						<Typography sx={{ color: 'rgba(250,250,250,0.78)', fontSize: '0.9rem', maxWidth: 520, mx: 'auto', mb: 2.4 }}>
							Do you have a question about Timeless Watches products or services?
							We are here for you.
						</Typography>
						<Stack direction="row" justifyContent="center" spacing={3}>
							<Link href="/faq" style={{ textDecoration: 'none' }}>
								<Typography
									sx={{
										color: '#FAFAFA',
										fontSize: '0.72rem',
										fontWeight: 600,
										letterSpacing: '1.5px',
										cursor: 'pointer',
										transition: 'all 0.2s ease',
										'&:hover': { color: '#D4AF37' },
									}}
								>
									› READ OUR FAQ
								</Typography>
							</Link>
							<Typography sx={{ color: '#FAFAFA', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '1.5px' }}>
								› SERVICE REQUEST
							</Typography>
						</Stack>
					</Box>
				</Stack>

				{/* CONTACT METHODS + INFO */}
				<Stack sx={{ background: '#F4F4F4', py: { xs: 6, md: 8 } }}>
					<Container maxWidth="lg">
						<Typography
							sx={{
								color: '#111111',
								textAlign: 'center',
								fontSize: { xs: '1.05rem', md: '1.45rem' },
								fontWeight: 700,
								letterSpacing: '1.2px',
								textTransform: 'uppercase',
								mb: 4.2,
							}}
						>
							How would you prefer to contact us?
						</Typography>

						<Grid container spacing={2.2} sx={{ mb: 4.5 }}>
							{[
								{
									title: 'By Phone',
									subtitle: 'Talk to our advisors',
									detail: '+82 10 1234 5678',
									icon: <PhoneIcon sx={{ color: '#111111' }} />,
								},
								{
									title: 'By Email',
									subtitle: 'Send us your inquiry',
									detail: 'info@watches-store.com',
									icon: <EmailIcon sx={{ color: '#111111' }} />,
								},
								{
									title: 'In Store',
									subtitle: 'Visit our flagship',
									detail: 'Gangnam-gu, Seoul',
									icon: <LocationOnIcon sx={{ color: '#111111' }} />,
								},
							].map((item) => (
								<Grid item xs={12} md={4} key={item.title}>
									<Box
										sx={{
											background: '#EFEFEF',
											border: '1px solid rgba(17,17,17,0.08)',
											borderRadius: '6px',
											py: 3.2,
											px: 2.2,
											textAlign: 'center',
											height: '100%',
											transition: 'all 0.25s ease',
											'&:hover': {
												borderColor: '#D4AF37',
												background: '#F8F8F8',
											},
										}}
									>
										<Stack alignItems="center" spacing={1}>
											<IconButton disableRipple sx={{ color: '#111111' }}>
												{item.icon}
											</IconButton>
											<Typography sx={{ color: '#111111', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
												{item.title}
											</Typography>
											<Typography sx={{ color: '#666666', fontSize: '0.84rem' }}>{item.subtitle}</Typography>
											<Typography sx={{ color: '#111111', fontWeight: 500, fontSize: '0.88rem' }}>{item.detail}</Typography>
										</Stack>
									</Box>
								</Grid>
							))}
						</Grid>

						<Grid container spacing={3}>
							<Grid item xs={12} md={5}>
								<Box
									sx={{
										background: '#FFFFFF',
										border: '1px solid rgba(17,17,17,0.12)',
										borderRadius: '14px',
										p: 3,
										height: '100%',
									}}
								>
									<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '1.05rem', mb: 1.8 }}>
										Need help with a specific watch?
									</Typography>
									<Typography sx={{ color: '#666666', fontSize: '0.88rem', mb: 2 }}>
										Search by watch name and our team will prioritize your inquiry.
									</Typography>
									<TextField
										fullWidth
										size="small"
										placeholder="Search watch name (e.g. Rolex Submariner)"
										value={watchSearch}
										onChange={(e) => setWatchSearch(e.target.value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<SearchIcon sx={{ color: '#888888', fontSize: 18 }} />
												</InputAdornment>
											),
										}}
										sx={{
											mb: 2.2,
											'& .MuiOutlinedInput-root': {
												borderRadius: '8px',
												background: '#FBFBFB',
												'& fieldset': { borderColor: 'rgba(17,17,17,0.2)' },
												'&:hover fieldset': { borderColor: '#D4AF37' },
												'&.Mui-focused fieldset': { borderColor: '#111111' },
											},
										}}
									/>
									<Typography sx={{ color: '#777777', fontSize: '0.78rem', mb: 2 }}>
										Current query: {watchSearch || '—'}
									</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1.2 }}>Follow Us</Typography>
									<Stack direction="row" spacing={1.2}>
										<IconButton
											component="a"
											href="https://facebook.com"
											target="_blank"
											sx={{ background: 'rgba(17,17,17,0.07)', color: '#111111', '&:hover': { background: '#111111', color: '#FAFAFA' } }}
										>
											<FacebookIcon />
										</IconButton>
										<IconButton
											component="a"
											href="https://instagram.com"
											target="_blank"
											sx={{ background: 'rgba(17,17,17,0.07)', color: '#111111', '&:hover': { background: '#111111', color: '#FAFAFA' } }}
										>
											<InstagramIcon />
										</IconButton>
									</Stack>
								</Box>
							</Grid>

							<Grid item xs={12} md={7}>
								<Box
									sx={{
										background: '#FFFFFF',
										borderRadius: '14px',
										border: '1px solid rgba(17,17,17,0.12)',
										overflow: 'hidden',
										minHeight: 370,
									}}
								>
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.352!2d127.0276!3d37.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15aabab42d1%3A0x1e7a5e47d1e4a72c!2sGangnam!5e0!3m2!1sen!2skr!4v1"
										width="100%"
										height="100%"
										style={{ border: 0, minHeight: 370 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
									/>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Stack>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default ContactPage;
