import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import WatchIcon from '@mui/icons-material/Watch';
import moment from 'moment';

const Footer = () => {
	return (
		<Stack sx={{ background: '#0a0a14', borderTop: '1px solid rgba(201,169,110,0.1)', py: 6, px: 3 }}>
			<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }} spacing={4}>
				<Stack alignItems={{ xs: 'center', md: 'flex-start' }}>
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
						<WatchIcon sx={{ color: '#c9a96e' }} />
						<Typography sx={{ color: '#fff', fontWeight: 700, letterSpacing: 2 }}>WATCHES</Typography>
					</Stack>
					<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Premium Luxury Timepieces</Typography>
				</Stack>

				<Stack direction="row" spacing={4}>
					<Box>
						<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Quick Links</Typography>
						<Typography sx={{ color: '#888', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#c9a96e' } }}>Home</Typography>
						<Typography sx={{ color: '#888', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#c9a96e' } }}>Watches</Typography>
						<Typography sx={{ color: '#888', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#c9a96e' } }}>Contact</Typography>
					</Box>
					<Box>
						<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Contact</Typography>
						<Typography sx={{ color: '#888', fontSize: '0.8rem' }}>+82 10 1234 5678</Typography>
						<Typography sx={{ color: '#888', fontSize: '0.8rem' }}>info@watches-store.com</Typography>
					</Box>
				</Stack>

				<Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
					<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
						<IconButton size="small" sx={{ color: '#c9a96e' }}><FacebookIcon fontSize="small" /></IconButton>
						<IconButton size="small" sx={{ color: '#c9a96e' }}><InstagramIcon fontSize="small" /></IconButton>
						<IconButton size="small" sx={{ color: '#c9a96e' }}><PhoneIcon fontSize="small" /></IconButton>
					</Stack>
					<Typography sx={{ color: '#555', fontSize: '0.75rem' }}>
						© {moment().year()} Watches. All rights reserved.
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;
