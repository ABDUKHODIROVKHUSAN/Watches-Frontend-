import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Link from 'next/link';
import moment from 'moment';
import { getJwtToken, logOut } from '../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';

const Footer = () => {
	return (
		<Stack sx={{ position: 'relative', background: '#111111', py: { xs: 5, md: 6 }, px: 3, overflow: 'hidden' }}>
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&q=80)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					opacity: 0.06,
					pointerEvents: 'none',
				}}
			/>
			<Stack sx={{ maxWidth: 1240, mx: 'auto', width: '100%', position: 'relative', zIndex: 1 }}>
				<GridFooter />
			</Stack>
		</Stack>
	);
};

const GridFooter = () => {
	const user = useReactiveVar(userVar);
	const [hydrated, setHydrated] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	// Avoid SSR/CSR mismatch: read localStorage-based token only after hydration.
	const isLoggedIn = hydrated && Boolean(user?._id || getJwtToken());

	const handleFooterLogout = () => {
		setLogoutDialogOpen(true);
	};

	const handleCancelLogout = () => {
		setLogoutDialogOpen(false);
	};

	const handleConfirmLogout = () => {
		setLogoutDialogOpen(false);
		logOut();
	};

	const sectionTitleSx = {
		color: '#FAFAFA',
		fontSize: '0.79rem',
		fontWeight: 700,
		letterSpacing: '1.2px',
		textTransform: 'uppercase',
		mb: 1.2,
	};

	const itemSx = {
		color: '#c9ced4',
		fontSize: '0.83rem',
		lineHeight: 1.7,
		cursor: 'pointer',
		transition: 'color 0.2s ease',
		'&:hover': { color: '#D4AF37' },
	};

	return (
		<>
			<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={4} sx={{ mb: { xs: 4, md: 5 } }}>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 5, md: 6 }} flexWrap="wrap">
					<Box>
						<Typography sx={sectionTitleSx}>About Us</Typography>
						<Link href="/" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>Our Story</Typography>
						</Link>
						<Link href="/watches" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>Watches</Typography>
						</Link>
						<Link href="/#celebrity-wearers" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>We are chosen</Typography>
						</Link>
						<Typography sx={itemSx}>Privacy Policy</Typography>
						<Typography sx={itemSx}>Terms of Use</Typography>
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>Support</Typography>
						<Link href="/ai-help" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>AI Help</Typography>
						</Link>
						<Typography sx={itemSx}>Do Not Sell or Share My Personal Information</Typography>
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>Get in touch</Typography>
						<Link href="/contact" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>Contact</Typography>
						</Link>
						<Link href="/#new-arrivals" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>New releases</Typography>
						</Link>
						{isLoggedIn ? (
							<Button
								onClick={handleFooterLogout}
								variant="text"
								sx={{
									mt: 0.3,
									px: 0,
									minWidth: 0,
									justifyContent: 'flex-start',
									color: '#c9ced4',
									fontSize: '0.83rem',
									textTransform: 'none',
									'&:hover': { color: '#D4AF37', background: 'transparent' },
								}}
							>
								Logout
							</Button>
						) : (
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Typography sx={itemSx}>Login</Typography>
							</Link>
						)}
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>Follow Us</Typography>
						<Stack direction="row" spacing={0.8}>
							<IconButton size="small" sx={{ color: '#c9ced4', '&:hover': { color: '#D4AF37' } }}>
								<InstagramIcon fontSize="small" />
							</IconButton>
							<IconButton size="small" sx={{ color: '#c9ced4', '&:hover': { color: '#D4AF37' } }}>
								<YouTubeIcon fontSize="small" />
							</IconButton>
							<IconButton size="small" sx={{ color: '#c9ced4', '&:hover': { color: '#D4AF37' } }}>
								<FacebookIcon fontSize="small" />
							</IconButton>
							<IconButton size="small" sx={{ color: '#c9ced4', '&:hover': { color: '#D4AF37' } }}>
								<PhoneIcon fontSize="small" />
							</IconButton>
						</Stack>
					</Box>
				</Stack>

				<Box sx={{ minWidth: { md: 290 } }}>
					<Typography sx={{ color: '#FAFAFA', fontSize: '0.79rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', mb: 1.2 }}>
						Official Dealer Partners
					</Typography>
					<Stack direction="row" spacing={2.8} alignItems="center" flexWrap="wrap" useFlexGap>
						<Box
							component="img"
							src="https://cdn.simpleicons.org/ufc/FAFAFA"
							alt="UFC"
							sx={{ height: 34, objectFit: 'contain', opacity: 1 }}
						/>
						<Box
							component="img"
							src="https://cdn.worldvectorlogo.com/logos/chanel-2.svg"
							alt="Chanel"
							sx={{
								height: 26,
								objectFit: 'contain',
								opacity: 1,
								filter: 'brightness(0) saturate(100%) invert(76%) sepia(34%) saturate(641%) hue-rotate(356deg) brightness(89%) contrast(90%)',
							}}
						/>
						<Box
							component="img"
							src="https://cdn.worldvectorlogo.com/logos/rolex-logo.svg"
							alt="Rolex"
							sx={{
								height: 26,
								objectFit: 'contain',
								opacity: 1,
								// Tint the whole mark to gold so it reads clearly on dark footer.
								filter: 'brightness(0) saturate(100%) invert(76%) sepia(34%) saturate(641%) hue-rotate(356deg) brightness(89%) contrast(90%)',
							}}
						/>
						<Box
							component="img"
							src="https://cdn.simpleicons.org/zara/FAFAFA"
							alt="Zara"
							sx={{ height: 34, objectFit: 'contain', opacity: 1 }}
						/>
					</Stack>
				</Box>
			</Stack>

			<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography sx={{ color: '#FAFAFA', fontWeight: 700, fontSize: { xs: '1.15rem', md: '1.35rem' }, letterSpacing: 2.5 }}>
						TIMELESS
					</Typography>
					<Typography sx={{ color: '#777', fontWeight: 400 }}>· Watches</Typography>
				</Stack>
				<Typography sx={{ color: '#5f6570', fontSize: '0.74rem' }}>
					Copyright © 2009-{moment().year()}, Timeless Watches LLC. All Rights Reserved.
				</Typography>
			</Stack>

			<Dialog
				open={logoutDialogOpen}
				onClose={handleCancelLogout}
				aria-labelledby="footer-logout-dialog-title"
				PaperProps={{
					sx: {
						borderRadius: '14px',
						background: '#FFFFFF',
						border: '1px solid rgba(212,175,55,0.5)',
						boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
						minWidth: { xs: 'auto', sm: 420 },
					},
				}}
			>
				<DialogTitle id="footer-logout-dialog-title" sx={{ color: '#111111', fontWeight: 700, pb: 0.8 }}>
					Logout Confirmation
				</DialogTitle>
				<DialogContent sx={{ pt: '8px !important' }}>
					<Typography sx={{ color: '#555555', fontSize: '0.94rem' }}>
						Do you really want to logout from Timeless Watches?
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2.2, pt: 0.5 }}>
					<Button
						onClick={handleCancelLogout}
						variant="outlined"
						sx={{
							color: '#111111',
							borderColor: 'rgba(0,0,0,0.24)',
							textTransform: 'none',
							'&:hover': { borderColor: '#111111', background: '#F7F7F7' },
						}}
					>
						No
					</Button>
					<Button
						onClick={handleConfirmLogout}
						variant="contained"
						sx={{
							background: '#111111',
							color: '#D4AF37',
							textTransform: 'none',
							fontWeight: 700,
							'&:hover': { background: '#232323' },
						}}
					>
						Yes, Logout
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Footer;
