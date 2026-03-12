import React, { useState, useEffect } from 'react';
import { Stack, Container, Typography, Box, TextField, Button, Tabs, Tab, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { logIn, signUp, getJwtToken } from '../../libs/auth';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';
import { useLanguage } from '../../libs/i18n/LanguageContext';

const JoinPage = () => {
	const router = useRouter();
	const { isDark } = useThemeMode();
	const { t } = useLanguage();
	const [tab, setTab] = useState(0);
	const [loginNick, setLoginNick] = useState('');
	const [loginPass, setLoginPass] = useState('');
	const [signNick, setSignNick] = useState('');
	const [signPass, setSignPass] = useState('');
	const [signPhone, setSignPhone] = useState('');
	const [signRole, setSignRole] = useState<'USER' | 'AGENT'>('USER');
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [showSignupPassword, setShowSignupPassword] = useState(false);

	useEffect(() => {
		if (getJwtToken()) router.push('/mypage');
	}, []);

	const handleLogin = async () => {
		try {
			if (!loginNick || !loginPass) return sweetMixinErrorAlert(t('join.fillAll'));
			await logIn(loginNick, loginPass);
			await sweetMixinSuccessAlert(t('join.loginSuccess'));
			router.push('/');
		} catch (err) {
			sweetMixinErrorAlert(t('join.loginFailed'));
		}
	};

	const handleSignup = async () => {
		try {
			if (!signNick || !signPass || !signPhone) return sweetMixinErrorAlert(t('join.fillAll'));
			await signUp(signNick, signPass, signPhone, signRole);
			await sweetMixinSuccessAlert(t('join.signupWelcome'));
			router.push('/');
		} catch (err) {
			sweetMixinErrorAlert(t('join.signupFailed'));
		}
	};

	const inputSx = {
		'& .MuiOutlinedInput-root': {
			background: isDark ? 'rgba(16,23,34,0.92)' : 'rgba(255,255,255,0.94)',
			borderRadius: '10px',
			'& fieldset': { borderColor: '#D4AF37' },
			'&:hover fieldset': { borderColor: '#111111' },
			'&.Mui-focused fieldset': { borderColor: '#111111' },
			color: isDark ? '#E5E7EB' : '#111111',
		},
		'& .MuiInputLabel-root': { color: isDark ? '#AEB6C2' : '#888' },
		'& .MuiInputLabel-root.Mui-focused': { color: isDark ? '#E5E7EB' : '#111111' },
	};

	return (
		<>
			<Head><title>{t('join.metaTitle')}</title></Head>
			<Stack
				sx={{
					background: isDark ? '#0b0f16' : '#FAFAFA',
					minHeight: '100vh',
					display: 'flex',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						backgroundImage:
							isDark
								? 'linear-gradient(rgba(11,15,22,0.9), rgba(11,15,22,0.9)), url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&q=80)'
								: 'linear-gradient(rgba(250,250,250,0.93), rgba(250,250,250,0.93)), url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&q=80)',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						opacity: 0.32,
						pointerEvents: 'none',
					}}
				/>
				<Top />
				<Container
					maxWidth="md"
					sx={{
						pt: { xs: 13, md: 15 },
						pb: 6,
						flex: 1,
						display: 'flex',
						alignItems: 'center',
						position: 'relative',
						zIndex: 1,
					}}
				>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						sx={{
							width: '100%',
							minHeight: { xs: 'auto', md: 560 },
							borderRadius: '20px',
							border: '1px solid rgba(212,175,55,0.72)',
							background: isDark ? 'rgba(16,23,34,0.92)' : 'rgba(255,255,255,0.82)',
							boxShadow: '0 16px 40px rgba(17,17,17,0.18)',
							overflow: 'hidden',
							backdropFilter: 'blur(3px)',
						}}
					>
						<Box
							sx={{
								display: { xs: 'none', md: 'block' },
								width: '42%',
								position: 'relative',
								background:
									'linear-gradient(160deg, rgba(17,17,17,0.96) 0%, rgba(17,17,17,0.84) 100%), url(https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80)',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									inset: 0,
									background:
										'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.3), transparent 45%)',
								}}
							/>
							<Stack sx={{ position: 'relative', zIndex: 1, p: 4, justifyContent: 'space-between', height: '100%' }}>
								<Box>
									<Typography sx={{ color: '#D4AF37', letterSpacing: '2.4px', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700 }}>
										Timeless Watches
									</Typography>
									<Typography sx={{ color: '#FAFAFA', fontWeight: 700, fontSize: '1.8rem', mt: 1.2, lineHeight: 1.2 }}>
										Enter the world of iconic timepieces
									</Typography>
									<Typography sx={{ color: 'rgba(250,250,250,0.78)', mt: 1.5, lineHeight: 1.7 }}>
										Sign in to track your collection, manage listings, and access your personalized watch dashboard.
									</Typography>
								</Box>
								<Typography sx={{ color: '#D4AF37', fontSize: '0.8rem', letterSpacing: '1.2px' }}>
									Luxury. Precision. Legacy.
								</Typography>
							</Stack>
						</Box>

						<Box sx={{ width: { xs: '100%', md: '58%' }, p: { xs: 3, md: 5 } }}>
							<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', textAlign: 'center', mb: 0.5, fontWeight: 700, fontSize: { xs: '2rem', md: '2.2rem' } }}>
								{t('join.title')}
							</Typography>
							<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', textAlign: 'center', mb: 2.6, fontSize: '0.92rem' }}>
								{tab === 0 ? t('join.loginSubtitle') : t('join.signupSubtitle')}
							</Typography>
							<Tabs
								value={tab}
								onChange={(_, v) => setTab(v)}
								centered
								sx={{
									mb: 2.5,
									'& .MuiTab-root': {
										color: isDark ? '#AEB6C2' : '#888',
										fontSize: '0.9rem',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '1px',
										minHeight: 48,
										px: 2.8,
									},
									'& .Mui-selected': { color: isDark ? '#E5E7EB' : '#111111' },
									'& .MuiTabs-indicator': { backgroundColor: '#D4AF37', height: 3, borderRadius: '6px' },
								}}
							>
								<Tab label={t('join.loginTab')} />
								<Tab label={t('join.signUpTab')} />
							</Tabs>

							{tab === 0 ? (
								<Stack spacing={2.1}>
									<TextField
										label={t('join.nickname')}
										value={loginNick}
										onChange={(e) => setLoginNick(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												void handleLogin();
											}
										}}
										fullWidth
										size="medium"
										sx={inputSx}
									/>
									<TextField
										label={t('join.password')}
										type={showLoginPassword ? 'text' : 'password'}
										value={loginPass}
										onChange={(e) => setLoginPass(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												void handleLogin();
											}
										}}
										fullWidth
										size="medium"
										sx={inputSx}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														edge="end"
														onClick={() => setShowLoginPassword((prev) => !prev)}
														aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
														sx={{ color: isDark ? '#AEB6C2' : '#666666' }}
													>
														{showLoginPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<Button
										variant="contained"
										onClick={handleLogin}
										fullWidth
										sx={{
											background: isDark ? '#1f2937' : '#111111',
											color: '#FAFAFA',
											fontWeight: 700,
											py: 1.45,
											borderRadius: '10px',
											letterSpacing: '0.8px',
											'&:hover': { background: '#2B2B2B' },
										}}
									>
										{t('join.loginTab')}
									</Button>
									<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', fontSize: '0.86rem', textAlign: 'center' }}>
										{t('join.noAccount')}{' '}
										<Box
											component="span"
											onClick={() => setTab(1)}
											sx={{
												color: isDark ? '#E5E7EB' : '#111111',
												fontWeight: 700,
												cursor: 'pointer',
												textDecoration: 'underline',
												textUnderlineOffset: '2px',
												'&:hover': { color: '#D4AF37' },
											}}
										>
											{t('join.signUpLink')}
										</Box>
									</Typography>
								</Stack>
							) : (
								<Stack spacing={2.1}>
									<TextField
										label={t('join.accountType')}
										select
										value={signRole}
										onChange={(e) => setSignRole(e.target.value as 'USER' | 'AGENT')}
										fullWidth
										size="medium"
										sx={inputSx}
									>
										<MenuItem value="USER">{t('join.user')}</MenuItem>
										<MenuItem value="AGENT">{t('join.seller')}</MenuItem>
									</TextField>
									<TextField
										label={t('join.nickname')}
										value={signNick}
										onChange={(e) => setSignNick(e.target.value)}
										fullWidth
										size="medium"
										sx={inputSx}
									/>
									<TextField
										label={t('join.password')}
										type={showSignupPassword ? 'text' : 'password'}
										value={signPass}
										onChange={(e) => setSignPass(e.target.value)}
										fullWidth
										size="medium"
										sx={inputSx}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														edge="end"
														onClick={() => setShowSignupPassword((prev) => !prev)}
														aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
														sx={{ color: isDark ? '#AEB6C2' : '#666666' }}
													>
														{showSignupPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<TextField
										label={t('join.phone')}
										value={signPhone}
										onChange={(e) => setSignPhone(e.target.value)}
										fullWidth
										size="medium"
										sx={inputSx}
									/>
									<Button
										variant="contained"
										onClick={handleSignup}
										fullWidth
										sx={{
											background: isDark ? '#1f2937' : '#111111',
											color: '#FAFAFA',
											fontWeight: 700,
											py: 1.45,
											borderRadius: '10px',
											letterSpacing: '0.8px',
											'&:hover': { background: '#2B2B2B' },
										}}
									>
										{t('join.signUpTab')}
									</Button>
								</Stack>
							)}
						</Box>
					</Stack>
				</Container>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default JoinPage;
