import React from 'react';
import { Stack, Container, Typography, Box } from '@mui/material';
import Head from 'next/head';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';

const AiHelpPage = () => {
	return (
		<>
			<Head>
				<title>AI Help - Timeless Watches</title>
			</Head>
			<Stack sx={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex' }}>
				<Top />
				<Container maxWidth="md" sx={{ pt: 16, pb: 10 }}>
					<Box
						sx={{
							background: '#FFFFFF',
							border: '1px solid rgba(17,17,17,0.12)',
							borderRadius: '14px',
							p: { xs: 3, md: 4 },
							textAlign: 'center',
						}}
					>
						<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1.5 }}>
							AI Help
						</Typography>
						<Typography sx={{ color: '#666666', fontSize: '0.95rem' }}>
							This page is ready. You can now ask me anytime to build the full AI Help experience and connect it to your watch details workflow.
						</Typography>
					</Box>
				</Container>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default AiHelpPage;
