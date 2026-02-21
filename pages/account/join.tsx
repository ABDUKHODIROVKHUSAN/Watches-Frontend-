import React, { useState, useEffect } from 'react';
import { Stack, Container, Typography, Box, TextField, Button, Tabs, Tab } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { logIn, signUp, getJwtToken } from '../../libs/auth';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';

const JoinPage = () => {
	const router = useRouter();
	const [tab, setTab] = useState(0);
	const [loginNick, setLoginNick] = useState('');
	const [loginPass, setLoginPass] = useState('');
	const [signNick, setSignNick] = useState('');
	const [signPass, setSignPass] = useState('');
	const [signPhone, setSignPhone] = useState('');

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
			await signUp(signNick, signPass, signPhone, 'USER');
			await sweetMixinSuccessAlert('Welcome!');
			router.push('/');
		} catch (err) {
			sweetMixinErrorAlert('Signup failed. Nick or phone may already exist.');
		}
	};

	const inputSx = {
		'& .MuiOutlinedInput-root': {
			color: '#fff',
			'& fieldset': { borderColor: 'rgba(201,169,110,0.3)' },
			'&:hover fieldset': { borderColor: '#c9a96e' },
			'&.Mui-focused fieldset': { borderColor: '#c9a96e' },
		},
		'& .MuiInputLabel-root': { color: '#888' },
		'& .MuiInputLabel-root.Mui-focused': { color: '#c9a96e' },
	};

	return (
		<>
			<Head><title>Join - Watches</title></Head>
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Container maxWidth="sm" sx={{ pt: 18, pb: 6 }}>
					<Box sx={{
						background: '#1a1a2e',
						borderRadius: '16px',
						border: '1px solid rgba(201,169,110,0.2)',
						p: 4,
					}}>
						<Typography variant="h4" sx={{ color: '#fff', textAlign: 'center', mb: 3, fontWeight: 700 }}>
							Welcome
						</Typography>
						<Tabs value={tab} onChange={(_, v) => setTab(v)} centered
							sx={{ mb: 3, '& .MuiTab-root': { color: '#888' }, '& .Mui-selected': { color: '#c9a96e' }, '& .MuiTabs-indicator': { backgroundColor: '#c9a96e' } }}>
							<Tab label="Login" />
							<Tab label="Sign Up" />
						</Tabs>

						{tab === 0 ? (
							<Stack spacing={2}>
								<TextField label="Nickname" value={loginNick} onChange={(e) => setLoginNick(e.target.value)} fullWidth sx={inputSx} />
								<TextField label="Password" type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} fullWidth sx={inputSx} />
								<Button variant="contained" onClick={handleLogin} fullWidth
									sx={{ background: '#c9a96e', color: '#0f0f1a', fontWeight: 700, py: 1.5, '&:hover': { background: '#b8944f' } }}>
									Login
								</Button>
							</Stack>
						) : (
							<Stack spacing={2}>
								<TextField label="Nickname" value={signNick} onChange={(e) => setSignNick(e.target.value)} fullWidth sx={inputSx} />
								<TextField label="Password" type="password" value={signPass} onChange={(e) => setSignPass(e.target.value)} fullWidth sx={inputSx} />
								<TextField label="Phone" value={signPhone} onChange={(e) => setSignPhone(e.target.value)} fullWidth sx={inputSx} />
								<Button variant="contained" onClick={handleSignup} fullWidth
									sx={{ background: '#c9a96e', color: '#0f0f1a', fontWeight: 700, py: 1.5, '&:hover': { background: '#b8944f' } }}>
									Sign Up
								</Button>
							</Stack>
						)}
					</Box>
				</Container>
				<Footer />
			</Stack>
		</>
	);
};

export default JoinPage;
