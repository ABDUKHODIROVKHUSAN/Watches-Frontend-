import React, { useEffect, useState } from 'react';
import { Stack, Box, Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import WatchIcon from '@mui/icons-material/Watch';

const Top = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Watches', href: '/watches' },
		...(user?._id ? [{ label: 'My Page', href: '/mypage' }] : []),
		{ label: 'Contact', href: '/contact' },
	];

	return (
		<Stack sx={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 1000,
			background: scrolled ? 'rgba(15, 15, 26, 0.95)' : 'transparent',
			backdropFilter: scrolled ? 'blur(10px)' : 'none',
			borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
			transition: 'all 0.3s',
		}}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: 3, py: 2 }}>
				<Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
					<WatchIcon sx={{ color: '#c9a96e', fontSize: 28 }} />
					<Box component="span" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', letterSpacing: 2 }}>WATCHES</Box>
				</Link>

				<Stack direction="row" alignItems="center" spacing={1}>
					{navLinks.map((link) => (
						<Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
							<Button sx={{
								color: router.pathname === link.href ? '#c9a96e' : '#b0b0b0',
								fontWeight: router.pathname === link.href ? 600 : 400,
								'&:hover': { color: '#c9a96e' },
							}}>
								{link.label}
							</Button>
						</Link>
					))}

					{user?._id ? (
						<>
							<Box onClick={(e: any) => setLogoutAnchor(e.currentTarget)} sx={{
								width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
								border: '2px solid #c9a96e', cursor: 'pointer',
							}}>
								<img
									src={user.memberImage?.startsWith('/') ? user.memberImage : `${REACT_APP_API_URL}/${user.memberImage}`}
									alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							</Box>
							<Menu anchorEl={logoutAnchor} open={Boolean(logoutAnchor)} onClose={() => setLogoutAnchor(null)} sx={{ mt: 1 }}>
								<MenuItem onClick={() => logOut()}>
									<LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
								</MenuItem>
							</Menu>
						</>
					) : (
						<Link href="/account/join" style={{ textDecoration: 'none' }}>
							<Button startIcon={<AccountCircleOutlinedIcon />}
								sx={{ color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)', '&:hover': { borderColor: '#c9a96e' } }}>
								Login
							</Button>
						</Link>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Top;
