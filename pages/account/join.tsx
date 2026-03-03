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

const JoinPage = () => {
	const router = useRouter();
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
			if (!loginNick || !loginPass) return sweetMixinErrorAlert('Please fill all fields');
			await logIn(loginNick, loginPass);
			await sweetMixinSuccessAlert('Login successful!');
			router.push('/');
		} catch (err) {
			sweetMixinErrorAlert('Login failed. Check your credentials.');
		}
	};

	const handleSignup = async () => {
		try {
			if (!signNick || !signPass || !signPhone) return sweetMixinErrorAlert('Please fill all fields');
			await signUp(signNick, signPass, signPhone, signRole);
			await sweetMixinSuccessAlert('Welcome!');
			router.push('/');
		} catch (err) {
			sweetMixinErrorAlert('Signup failed. Nick or phone may already exist.');
		}
	};

	const inputSx = {
		'& .MuiOutlinedInput-root': {
			background: 'rgba(255,255,255,0.94)',
			borderRadius: '10px',
			'& fieldset': { borderColor: '#D4AF37' },
			'&:hover fieldset': { borderColor: '#111111' },
			'&.Mui-focused fieldset': { borderColor: '#111111' },
		},
		'& .MuiInputLabel-root': { color: '#888' },
		'& .MuiInputLabel-root.Mui-focused': { color: '#111111' },
	};

	return (
		<>
			<Head><title>Join - Watches</title></Head>
			<Stack
				sx={{
					background: '#FAFAFA',
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
							'linear-gradient(rgba(250,250,250,0.93), rgba(250,250,250,0.93)), url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920&q=80)',
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
							background: 'rgba(255,255,255,0.82)',
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
							<Typography sx={{ color: '#111111', textAlign: 'center', mb: 0.5, fontWeight: 700, fontSize: { xs: '2rem', md: '2.2rem' } }}>
								Welcome
							</Typography>
							<Typography sx={{ color: '#666666', textAlign: 'center', mb: 2.6, fontSize: '0.92rem' }}>
								Access your account and continue your watch journey.
							</Typography>
							<Tabs
								value={tab}
								onChange={(_, v) => setTab(v)}
								centered
								sx={{
									mb: 2.5,
									'& .MuiTab-root': {
										color: '#888',
										fontSize: '0.9rem',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '1px',
										minHeight: 48,
										px: 2.8,
									},
									'& .Mui-selected': { color: '#111111' },
									'& .MuiTabs-indicator': { backgroundColor: '#D4AF37', height: 3, borderRadius: '6px' },
								}}
							>
								<Tab label="Login" />
								<Tab label="Sign Up" />
							</Tabs>

							{tab === 0 ? (
								<Stack spacing={2.1}>
									<TextField
										label="Nickname"
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
										label="Password"
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
											background: '#111111',
											color: '#FAFAFA',
											fontWeight: 700,
											py: 1.45,
											borderRadius: '10px',
											letterSpacing: '0.8px',
											'&:hover': { background: '#2B2B2B' },
										}}
									>
										Login
									</Button>
									<Typography sx={{ color: '#666666', fontSize: '0.86rem', textAlign: 'center' }}>
										Don&apos;t have an account?{' '}
										<Box
											component="span"
											onClick={() => setTab(1)}
											sx={{
												color: '#111111',
												fontWeight: 700,
												cursor: 'pointer',
												textDecoration: 'underline',
												textUnderlineOffset: '2px',
												'&:hover': { color: '#D4AF37' },
											}}
										>
											Sign up
										</Box>
									</Typography>
								</Stack>
							) : (
								<Stack spacing={2.1}>
									<TextField
										label="Account Type"
										select
										value={signRole}
										onChange={(e) => setSignRole(e.target.value as 'USER' | 'AGENT')}
										fullWidth
										size="medium"
										sx={inputSx}
									>
										<MenuItem value="USER">User</MenuItem>
										<MenuItem value="AGENT">Seller</MenuItem>
									</TextField>
									<TextField
										label="Nickname"
										value={signNick}
										onChange={(e) => setSignNick(e.target.value)}
										fullWidth
										size="medium"
										sx={inputSx}
									/>
									<TextField
										label="Password"
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
													>
														{showSignupPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<TextField
										label="Phone"
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
											background: '#111111',
											color: '#FAFAFA',
											fontWeight: 700,
											py: 1.45,
											borderRadius: '10px',
											letterSpacing: '0.8px',
											'&:hover': { background: '#2B2B2B' },
										}}
									>
										Sign Up
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
