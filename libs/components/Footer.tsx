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
import { useLanguage } from '../i18n/LanguageContext';

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
	const { t } = useLanguage();
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
						<Typography sx={sectionTitleSx}>{t('footer.aboutUs')}</Typography>
						<Link href="/" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('footer.ourStory')}</Typography>
						</Link>
						<Link href="/watches" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('nav.watches')}</Typography>
						</Link>
						<Link href="/#celebrity-wearers" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('footer.weAreChosen')}</Typography>
						</Link>
						<Typography sx={itemSx}>{t('footer.privacyPolicy')}</Typography>
						<Typography sx={itemSx}>{t('footer.termsOfUse')}</Typography>
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>{t('footer.support')}</Typography>
						<Link href="/ai-help" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('nav.aiHelp')}</Typography>
						</Link>
						<Typography sx={itemSx}>{t('footer.doNotSell')}</Typography>
						<Link href="/faq" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>FAQ</Typography>
						</Link>
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>{t('footer.getInTouch')}</Typography>
						<Link href="/contact" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('nav.contact')}</Typography>
						</Link>
						<Link href="/#new-arrivals" style={{ textDecoration: 'none' }}>
							<Typography sx={itemSx}>{t('footer.newReleases')}</Typography>
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
								{t('auth.logout')}
							</Button>
						) : (
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Typography sx={itemSx}>{t('footer.login')}</Typography>
							</Link>
						)}
					</Box>

					<Box>
						<Typography sx={sectionTitleSx}>{t('footer.followUs')}</Typography>
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
						{t('footer.officialPartners')}
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
					{t('footer.copyright')} © 2009-{moment().year()}, Timeless Watches LLC. {t('footer.allRightsReserved')}
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
					{t('top.logoutTitle')}
				</DialogTitle>
				<DialogContent sx={{ pt: '8px !important' }}>
					<Typography sx={{ color: '#555555', fontSize: '0.94rem' }}>
						{t('footer.logoutMessage')}
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
						{t('common.no')}
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
						{t('footer.yesLogout')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Footer;
