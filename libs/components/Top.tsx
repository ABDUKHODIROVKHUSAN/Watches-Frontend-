import React, { useEffect, useState } from 'react';
import { Stack, Box, Button, Menu, MenuItem, IconButton, Badge, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, Divider } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { CartItem, clearCart, getCartCount, getCartItems, removeFromCart } from '../cart';
import { useLanguage } from '../i18n/LanguageContext';
import { AppLocale } from '../i18n/translations';
import { useThemeMode } from '../theme/ThemeModeContext';
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const Anniversary150Mark = ({ color = '#111111' }: { color?: string }) => (
	<Stack sx={{ lineHeight: 1, alignItems: 'center', justifyContent: 'center', minWidth: 42 }}>
		<Box
			component="span"
			sx={{
				color,
				fontWeight: 300,
				fontSize: '2.02rem',
				letterSpacing: '-1.6px',
				fontFamily: '"Times New Roman", serif',
				transform: 'translateY(-1px)',
			}}
		>
			150
		</Box>
		<Box
			component="span"
			sx={{
				color,
				fontWeight: 500,
				fontSize: '0.41rem',
				letterSpacing: '1.6px',
				textTransform: 'uppercase',
				opacity: 0.92,
				mt: '-4px',
			}}
		>
			Years
		</Box>
	</Stack>
);

const Top = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { locale, setLocale, t } = useLanguage();
	const { isDark, toggleMode } = useThemeMode();
	const [scrolled, setScrolled] = useState(false);
	const [headerVisible, setHeaderVisible] = useState(true);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const [cartAnchor, setCartAnchor] = useState<null | HTMLElement>(null);
	const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		let lastScrollY = 0;
		const handleScroll = () => {
			const currentY = window.scrollY;
			setScrolled(currentY > 50);

			// Always show header near top.
			if (currentY < 12) {
				setHeaderVisible(true);
				lastScrollY = currentY;
				return;
			}

			// Hide on scroll down, show on scroll up.
			if (currentY > lastScrollY && currentY > 80) setHeaderVisible(false);
			else if (currentY < lastScrollY) setHeaderVisible(true);

			lastScrollY = currentY;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const refreshCart = () => setCartItems(getCartItems(user?._id));
		refreshCart();
		window.addEventListener('cart-updated', refreshCart);
		window.addEventListener('storage', refreshCart);
		return () => {
			window.removeEventListener('cart-updated', refreshCart);
			window.removeEventListener('storage', refreshCart);
		};
	}, [user?._id]);

	const navLinks = [
		{ label: t('nav.home'), href: '/' },
		{ label: t('nav.watches'), href: '/watches' },
		{ label: t('nav.aiHelp'), href: '/ai-help' },
		...(user?._id ? [{ label: t('nav.myPage'), href: '/mypage' }] : []),
		{ label: t('nav.contact'), href: '/contact' },
	];

	const localeMenu: { locale: AppLocale; label: string; flag: string }[] = [
		{ locale: 'en', label: t('locale.english'), flag: '🇬🇧' },
		{ locale: 'ko', label: t('locale.korean'), flag: '🇰🇷' },
		{ locale: 'uz', label: t('locale.uzbek'), flag: '🇺🇿' },
	];
	const activeLocale = localeMenu.find((item) => item.locale === locale) ?? localeMenu[0];

	const isHome = router.pathname === '/';
	const isHomeOverlay = isHome && !scrolled;
	const primaryTextColor = isHomeOverlay ? 'rgba(250,250,250,0.95)' : isDark ? '#E5E7EB' : '#111111';
	const secondaryTextColor = isHomeOverlay ? 'rgba(250,250,250,0.72)' : isDark ? '#AEB6C2' : '#777';

	return (
		<Stack sx={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 1000,
			background: isHomeOverlay ? 'transparent' : isDark ? 'rgba(10, 14, 22, 0.94)' : 'rgba(255, 255, 255, 0.97)',
			backdropFilter: isHomeOverlay ? 'none' : 'blur(10px)',
			borderBottom: isHomeOverlay ? 'none' : '1px solid #D4AF37',
			transform: headerVisible ? 'translateY(0)' : 'translateY(-115%)',
			opacity: headerVisible ? 1 : 0,
			pointerEvents: headerVisible ? 'auto' : 'none',
			transition: 'transform 0.28s ease, opacity 0.2s ease, background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
		}}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ maxWidth: 1300, mx: 'auto', width: '100%', px: { xs: 1.4, md: 2.8 }, py: { xs: 1.05, md: 1.3 }, position: 'relative' }}>
				<Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1.2 }} sx={{ minWidth: 0 }}>
					<Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
						<Anniversary150Mark color={primaryTextColor} />
					</Link>
					<Box sx={{ width: '1px', height: 20, background: isHomeOverlay ? 'rgba(250,250,250,0.35)' : 'rgba(17,17,17,0.2)', mx: { xs: 0.3, md: 0.8 }, display: { xs: 'none', sm: 'block' } }} />
					<Box component="span" sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: primaryTextColor, fontWeight: 700, fontSize: '0.9rem', letterSpacing: 1 }}>
						TIMELESS
					</Box>
					<Stack direction="row" alignItems="center" spacing={{ xs: 0, md: 0.2 }} sx={{ display: { xs: 'none', sm: 'flex' } }}>
						{navLinks.map((link) => (
							<Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
								<Button sx={{
									color: router.pathname === link.href ? primaryTextColor : secondaryTextColor,
									fontWeight: router.pathname === link.href ? 700 : 500,
									fontSize: '0.78rem',
									letterSpacing: '0.4px',
									whiteSpace: 'nowrap',
									minWidth: 0,
									px: { xs: 0.9, md: 1.3 },
									'&:hover': { color: primaryTextColor, background: isHomeOverlay ? 'rgba(250,250,250,0.08)' : 'rgba(17,17,17,0.08)' },
								}}>
									{link.label}
								</Button>
							</Link>
						))}
					</Stack>
				</Stack>

				<Link href="/" style={{ textDecoration: 'none' }}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={0.5}
						sx={{
							display: { xs: 'none', sm: 'flex' },
							position: { sm: 'static', md: 'absolute' },
							left: { md: '50%' },
							transform: { md: 'translateX(-50%)' },
							opacity: isHomeOverlay ? 0.98 : 1,
						}}
					>
						<Box component="span" sx={{ color: primaryTextColor, fontWeight: 700, fontSize: { xs: '0.95rem', md: '1.02rem' }, letterSpacing: { xs: 1.4, md: 2.3 } }}>
							TIMELESS
						</Box>
						<Box component="span" sx={{ color: isHomeOverlay ? 'rgba(250,250,250,0.68)' : '#999', fontWeight: 300, fontSize: '0.86rem', letterSpacing: 1 }}>
							· Watches
						</Box>
					</Stack>
				</Link>

				<Stack direction="row" alignItems="center" spacing={0.8} sx={{ display: { xs: 'none', sm: 'flex' } }}>
					<Button
						onClick={toggleMode}
						sx={{
							color: primaryTextColor,
							minWidth: 0,
							border: isHomeOverlay ? '1px solid rgba(250,250,250,0.35)' : isDark ? '1px solid rgba(229,231,235,0.24)' : '1px solid rgba(17,17,17,0.2)',
							borderRadius: '10px',
							p: 0.75,
							'&:hover': { color: primaryTextColor },
						}}
					>
						{isDark ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <BedtimeRoundedIcon sx={{ fontSize: 18 }} />}
					</Button>
					<Button
						onClick={(e: any) => setLanguageAnchor(e.currentTarget)}
						sx={{
							color: primaryTextColor,
							fontWeight: 600,
							fontSize: '0.74rem',
							minWidth: 0,
							border: isHomeOverlay ? '1px solid rgba(250,250,250,0.35)' : isDark ? '1px solid rgba(229,231,235,0.24)' : '1px solid rgba(17,17,17,0.2)',
							borderRadius: '8px',
							px: 1.1,
							'&:hover': { color: primaryTextColor },
						}}
					>
						<span style={{ marginRight: 6 }}>{activeLocale.flag}</span> {activeLocale.locale.toUpperCase()}
					</Button>
					<Menu anchorEl={languageAnchor} open={Boolean(languageAnchor)} onClose={() => setLanguageAnchor(null)} sx={{ mt: 1 }}>
						{localeMenu.map((item) => (
							<MenuItem
								key={item.locale}
								onClick={() => {
									setLocale(item.locale);
									setLanguageAnchor(null);
								}}
								selected={item.locale === locale}
							>
								<span style={{ marginRight: 8 }}>{item.flag}</span> {item.label}
							</MenuItem>
						))}
					</Menu>
					{user?._id ? (
						<>
							<IconButton
								onClick={(e: any) => setCartAnchor(e.currentTarget)}
								sx={{
									color: primaryTextColor,
									'&:hover': { background: isHomeOverlay ? 'rgba(250,250,250,0.08)' : 'rgba(17,17,17,0.08)' },
								}}
							>
								<Badge
									badgeContent={getCartCount(user?._id)}
									color="secondary"
									sx={{
										'& .MuiBadge-badge': {
											background: '#D4AF37',
											color: '#111111',
											fontWeight: 700,
											fontSize: '0.65rem',
										},
									}}
								>
									<ShoppingCartOutlinedIcon sx={{ fontSize: 19 }} />
								</Badge>
							</IconButton>
							<Box onClick={(e: any) => setLogoutAnchor(e.currentTarget)} sx={{
								width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
								border: isHomeOverlay ? '1.6px solid rgba(250,250,250,0.8)' : '2px solid #111111', cursor: 'pointer',
							}}>
								<img
									src={user.memberImage?.startsWith('/') ? user.memberImage : `${REACT_APP_API_URL}/${user.memberImage}`}
									alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							</Box>
							<Menu anchorEl={logoutAnchor} open={Boolean(logoutAnchor)} onClose={() => setLogoutAnchor(null)} sx={{ mt: 1 }}>
								<MenuItem
									onClick={() => {
										setLogoutAnchor(null);
										router.push('/mypage');
									}}
									sx={{ fontSize: '1rem', fontWeight: 500, textTransform: 'none' }}
								>
									<PersonOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} /> {t('nav.myPage')}
								</MenuItem>
								<MenuItem
									onClick={() => {
										setLogoutAnchor(null);
										setLogoutDialogOpen(true);
									}}
									sx={{ fontSize: '1rem', fontWeight: 500, textTransform: 'none' }}
								>
									<LogoutIcon fontSize="small" sx={{ mr: 1 }} /> {t('auth.logout')}
								</MenuItem>
							</Menu>
							<Menu
								anchorEl={cartAnchor}
								open={Boolean(cartAnchor)}
								onClose={() => setCartAnchor(null)}
								sx={{ mt: 1 }}
								PaperProps={{
									sx: {
										width: 320,
										p: 1,
										border: '1px solid rgba(212,175,55,0.35)',
									},
								}}
							>
								<Stack sx={{ px: 1, pb: 0.8, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
									<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '0.88rem' }}>
										{t('cart.title')} ({getCartCount(user?._id)})
									</Typography>
								</Stack>
								{cartItems.length === 0 ? (
									<Box sx={{ py: 2.2, textAlign: 'center' }}>
										<Typography sx={{ color: '#666', fontSize: '0.85rem' }}>{t('cart.empty')}</Typography>
									</Box>
								) : (
									<>
										<Stack spacing={0.7} sx={{ py: 0.8 }}>
											{cartItems.map((item) => (
												<Stack key={item._id} direction="row" alignItems="center" spacing={1} sx={{ px: 0.6 }}>
													<Box sx={{ width: 42, height: 42, borderRadius: '8px', overflow: 'hidden', background: '#f2f2f2', flexShrink: 0 }}>
														{item.watchImage ? (
															<img
																src={`${REACT_APP_API_URL}/${item.watchImage}`}
																alt={item.watchTitle}
																style={{ width: '100%', height: '100%', objectFit: 'cover' }}
															/>
														) : null}
													</Box>
													<Box sx={{ minWidth: 0, flex: 1 }}>
														<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
															{item.watchTitle}
														</Typography>
														<Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
															${item.watchPrice?.toLocaleString()} x {item.qty}
														</Typography>
													</Box>
													<IconButton
														size="small"
														onClick={() => removeFromCart(item._id, user?._id)}
														sx={{ color: '#777', '&:hover': { color: '#111111' } }}
													>
														<DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
													</IconButton>
												</Stack>
											))}
										</Stack>
										<Stack direction="row" spacing={1} sx={{ pt: 0.6, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
											<Button
												size="small"
												variant="outlined"
												onClick={() => clearCart(user?._id)}
												sx={{ color: '#111111', borderColor: 'rgba(0,0,0,0.22)', fontSize: '0.72rem', flex: 1 }}
											>
												{t('cart.clear')}
											</Button>
											<Link href="/watches" style={{ textDecoration: 'none', flex: 1 }}>
												<Button
													size="small"
													variant="contained"
													onClick={() => setCartAnchor(null)}
													sx={{ width: '100%', background: '#111111', color: '#FAFAFA', fontSize: '0.72rem', '&:hover': { background: '#2B2B2B' } }}
												>
													{t('cart.viewWatches')}
												</Button>
											</Link>
										</Stack>
									</>
								)}
							</Menu>
						</>
					) : (
						<Stack direction="row" spacing={0.8}>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button sx={{ color: primaryTextColor, fontWeight: 600, fontSize: '0.78rem', minWidth: 0, '&:hover': { color: primaryTextColor } }}>
									{t('auth.login')}
								</Button>
							</Link>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button sx={{
									background: isHomeOverlay ? 'rgba(250,250,250,0.12)' : '#111111',
									color: isHomeOverlay ? '#FAFAFA' : '#FAFAFA',
									border: isHomeOverlay ? '1px solid rgba(250,250,250,0.38)' : 'none',
									fontWeight: 600,
									fontSize: '0.76rem',
									borderRadius: '6px',
									px: 1.7,
									'&:hover': { background: isHomeOverlay ? 'rgba(250,250,250,0.2)' : '#2B2B2B' },
								}}>
									{t('auth.signUp')}
								</Button>
							</Link>
						</Stack>
					)}
				</Stack>
				<IconButton
					onClick={() => setMobileMenuOpen(true)}
					sx={{
						display: { xs: 'inline-flex', sm: 'none' },
						color: primaryTextColor,
						border: isHomeOverlay ? '1px solid rgba(250,250,250,0.35)' : isDark ? '1px solid rgba(229,231,235,0.24)' : '1px solid rgba(17,17,17,0.2)',
						borderRadius: '10px',
						p: 0.75,
					}}
				>
					<MenuRoundedIcon sx={{ fontSize: 20 }} />
				</IconButton>
			</Stack>
			<Drawer
				anchor="right"
				open={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				PaperProps={{
					sx: {
						width: 288,
						background: isDark ? '#101722' : '#FFFFFF',
						borderLeft: '1px solid rgba(212,175,55,0.5)',
					},
				}}
			>
				<Stack sx={{ p: 2 }}>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.6 }}>
						<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, letterSpacing: '1.2px' }}>
							TIMELESS
						</Typography>
						<Button
							onClick={toggleMode}
							sx={{
								color: isDark ? '#E5E7EB' : '#111111',
								minWidth: 0,
								border: isDark ? '1px solid rgba(229,231,235,0.24)' : '1px solid rgba(17,17,17,0.2)',
								borderRadius: '10px',
								p: 0.75,
							}}
						>
							{isDark ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <BedtimeRoundedIcon sx={{ fontSize: 18 }} />}
						</Button>
					</Stack>
					<Stack spacing={0.8} sx={{ mb: 1.6 }}>
						{navLinks.map((link) => (
							<Link key={`mobile-${link.href}`} href={link.href} style={{ textDecoration: 'none' }}>
								<Button
									fullWidth
									onClick={() => setMobileMenuOpen(false)}
									sx={{
										justifyContent: 'flex-start',
										color: router.pathname === link.href ? (isDark ? '#E5E7EB' : '#111111') : (isDark ? '#AEB6C2' : '#666'),
										fontWeight: router.pathname === link.href ? 700 : 500,
										borderRadius: '10px',
										textTransform: 'none',
										px: 1.2,
										py: 0.9,
									}}
								>
									{link.label}
								</Button>
							</Link>
						))}
					</Stack>
					<Divider sx={{ borderColor: 'rgba(212,175,55,0.32)', mb: 1.5 }} />
					<Stack direction="row" spacing={0.8} sx={{ mb: 1.6 }}>
						{localeMenu.map((item) => (
							<Button
								key={`mobile-locale-${item.locale}`}
								variant={item.locale === locale ? 'contained' : 'outlined'}
								onClick={() => setLocale(item.locale)}
								sx={{
									flex: 1,
									fontSize: '0.72rem',
									color: item.locale === locale ? '#111111' : isDark ? '#E5E7EB' : '#111111',
									background: item.locale === locale ? '#D4AF37' : 'transparent',
									borderColor: 'rgba(212,175,55,0.45)',
									minWidth: 0,
									px: 0.8,
								}}
							>
								{item.flag}
							</Button>
						))}
					</Stack>
					{user?._id ? (
						<Stack spacing={0.9}>
							<Button
								fullWidth
								variant="outlined"
								onClick={() => {
									setMobileMenuOpen(false);
									void router.push('/mypage');
								}}
								sx={{ color: isDark ? '#E5E7EB' : '#111111', borderColor: 'rgba(212,175,55,0.42)', textTransform: 'none' }}
							>
								{t('nav.myPage')}
							</Button>
							<Button
								fullWidth
								variant="outlined"
								onClick={() => {
									setMobileMenuOpen(false);
									void router.push('/watches');
								}}
								sx={{ color: isDark ? '#E5E7EB' : '#111111', borderColor: 'rgba(212,175,55,0.42)', textTransform: 'none' }}
							>
								{t('cart.title')} ({getCartCount(user?._id)})
							</Button>
							<Button
								fullWidth
								variant="contained"
								onClick={() => {
									setMobileMenuOpen(false);
									setLogoutDialogOpen(true);
								}}
								sx={{ background: '#111111', color: '#D4AF37', textTransform: 'none', '&:hover': { background: '#232323' } }}
							>
								{t('auth.logout')}
							</Button>
						</Stack>
					) : (
						<Stack spacing={0.9}>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button fullWidth onClick={() => setMobileMenuOpen(false)} sx={{ color: isDark ? '#E5E7EB' : '#111111', borderColor: 'rgba(212,175,55,0.42)', border: '1px solid', textTransform: 'none' }}>
									{t('auth.login')}
								</Button>
							</Link>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button fullWidth onClick={() => setMobileMenuOpen(false)} variant="contained" sx={{ background: '#111111', color: '#FAFAFA', textTransform: 'none', '&:hover': { background: '#2B2B2B' } }}>
									{t('auth.signUp')}
								</Button>
							</Link>
						</Stack>
					)}
				</Stack>
			</Drawer>
			<Dialog
				open={logoutDialogOpen}
				onClose={() => setLogoutDialogOpen(false)}
				PaperProps={{
					sx: {
						borderRadius: '14px',
						background: isDark ? '#101722' : '#FFFFFF',
						border: '1px solid rgba(212,175,55,0.5)',
						boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
						minWidth: { xs: 'auto', sm: 400 },
					},
				}}
			>
				<DialogTitle sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, pb: 0.8 }}>
					{t('top.logoutTitle')}
				</DialogTitle>
				<DialogContent sx={{ pt: '8px !important' }}>
					<Typography sx={{ color: isDark ? '#AEB6C2' : '#555555', fontSize: '0.94rem' }}>
						{t('top.logoutMessage')}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2.2, pt: 0.5 }}>
					<Button
						onClick={() => setLogoutDialogOpen(false)}
						variant="outlined"
						sx={{
							color: isDark ? '#E5E7EB' : '#111111',
							borderColor: 'rgba(0,0,0,0.24)',
							textTransform: 'none',
						}}
					>
						{t('common.no')}
					</Button>
					<Button
						onClick={() => {
							setLogoutDialogOpen(false);
							logOut();
						}}
						variant="contained"
						sx={{
							background: '#111111',
							color: '#D4AF37',
							textTransform: 'none',
							fontWeight: 700,
							'&:hover': { background: '#232323' },
						}}
					>
						{t('common.yes')}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

export default Top;
