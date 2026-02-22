import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import WatchIcon from '@mui/icons-material/Watch';
import moment from 'moment';

const Footer = () => {
	return (
		<Stack sx={{ background: '#1B1B1B', py: 6, px: 3 }}>
			<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }} spacing={4}>
				<Stack alignItems={{ xs: 'center', md: 'flex-start' }}>
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
						<WatchIcon sx={{ color: '#C4C5BA' }} />
						<Typography sx={{ color: '#E4E4DE', fontWeight: 700, letterSpacing: 2 }}>TIMELESS</Typography>
						<Typography sx={{ color: '#777', fontWeight: 400 }}>· Watches</Typography>
					</Stack>
					<Typography sx={{ color: '#666', fontSize: '0.85rem' }}>Premium Luxury Timepieces</Typography>
				</Stack>

				<Stack direction="row" spacing={4}>
					<Box>
						<Typography sx={{ color: '#C4C5BA', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Quick Links</Typography>
						<Typography sx={{ color: '#666', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#C4C5BA' } }}>Home</Typography>
						<Typography sx={{ color: '#666', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#C4C5BA' } }}>Watches</Typography>
						<Typography sx={{ color: '#666', fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: '#C4C5BA' } }}>Contact</Typography>
					</Box>
					<Box>
						<Typography sx={{ color: '#C4C5BA', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>Contact</Typography>
						<Typography sx={{ color: '#666', fontSize: '0.8rem' }}>+82 10 1234 5678</Typography>
						<Typography sx={{ color: '#666', fontSize: '0.8rem' }}>info@watches-store.com</Typography>
					</Box>
				</Stack>

				<Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
					<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
						<IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#C4C5BA' } }}><FacebookIcon fontSize="small" /></IconButton>
						<IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#C4C5BA' } }}><InstagramIcon fontSize="small" /></IconButton>
						<IconButton size="small" sx={{ color: '#777', '&:hover': { color: '#C4C5BA' } }}><PhoneIcon fontSize="small" /></IconButton>
					</Stack>
					<Typography sx={{ color: '#444', fontSize: '0.75rem' }}>
						© {moment().year()} Timeless Watches. All rights reserved.
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;
