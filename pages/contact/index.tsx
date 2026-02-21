import React, { useEffect } from 'react';
import { Stack, Container, Typography, Box, Grid, IconButton } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactPage = () => {
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	return (
		<>
			<Head><title>Contact Us - Watches</title></Head>
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Stack sx={{ pt: 15, pb: 4, background: 'linear-gradient(135deg, #1a1a2e, #16213e)', textAlign: 'center' }}>
					<Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '2px' }}>CONTACT US</Typography>
					<Typography sx={{ color: '#c9a96e', mt: 1, letterSpacing: '3px' }}>Get in Touch</Typography>
				</Stack>

				<Container maxWidth="lg" sx={{ py: 6 }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.2)', p: 4, height: '100%' }}>
								<Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>Reach Out To Us</Typography>

								<Stack spacing={3}>
									<Stack direction="row" alignItems="center" spacing={2}>
										<IconButton sx={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e' }}><PhoneIcon /></IconButton>
										<Box>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Phone</Typography>
											<Typography sx={{ color: '#fff', fontWeight: 500 }}>+82 10 1234 5678</Typography>
										</Box>
									</Stack>

									<Stack direction="row" alignItems="center" spacing={2}>
										<IconButton sx={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e' }}><EmailIcon /></IconButton>
										<Box>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Email</Typography>
											<Typography sx={{ color: '#fff', fontWeight: 500 }}>info@watches-store.com</Typography>
										</Box>
									</Stack>

									<Stack direction="row" alignItems="center" spacing={2}>
										<IconButton sx={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e' }}><LocationOnIcon /></IconButton>
										<Box>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Address</Typography>
											<Typography sx={{ color: '#fff', fontWeight: 500 }}>Gangnam-gu, Seoul, South Korea</Typography>
										</Box>
									</Stack>
								</Stack>

								<Typography sx={{ color: '#c9a96e', fontWeight: 600, mt: 4, mb: 2 }}>Follow Us</Typography>
								<Stack direction="row" spacing={2}>
									<IconButton component="a" href="https://facebook.com" target="_blank"
										sx={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', '&:hover': { background: 'rgba(201,169,110,0.2)' } }}>
										<FacebookIcon />
									</IconButton>
									<IconButton component="a" href="https://instagram.com" target="_blank"
										sx={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', '&:hover': { background: 'rgba(201,169,110,0.2)' } }}>
										<InstagramIcon />
									</IconButton>
								</Stack>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<Box sx={{
								background: '#1a1a2e',
								borderRadius: '16px',
								border: '1px solid rgba(201,169,110,0.2)',
								overflow: 'hidden',
								height: '100%',
								minHeight: 400,
							}}>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.352!2d127.0276!3d37.4979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15aabab42d1%3A0x1e7a5e47d1e4a72c!2sGangnam!5e0!3m2!1sen!2skr!4v1"
									width="100%"
									height="100%"
									style={{ border: 0, minHeight: 400 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</Box>
						</Grid>
					</Grid>
				</Container>
				<Footer />
			</Stack>
		</>
	);
};

export default ContactPage;
