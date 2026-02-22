import React, { useEffect, useState } from 'react';
import { Stack, Box, Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';
import LogoutIcon from '@mui/icons-material/Logout';

const LuxuryWatchIcon = ({ size = 24, color = '#595f39' }: { size?: number; color?: string }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect x="9" y="1" width="6" height="3" rx="0.8" fill={color} opacity="0.5" />
		<rect x="9" y="20" width="6" height="3" rx="0.8" fill={color} opacity="0.5" />
		<circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
		<circle cx="12" cy="12" r="7.2" stroke={color} strokeWidth="0.6" fill="none" opacity="0.4" />
		<line x1="12" y1="12" x2="12" y2="6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
		<line x1="12" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
		<circle cx="12" cy="12" r="1" fill={color} />
		{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
			<line
				key={deg}
				x1="12"
				y1={deg % 90 === 0 ? "3.8" : "4.3"}
				x2="12"
				y2={deg % 90 === 0 ? "5.2" : "5"}
				stroke={color}
				strokeWidth={deg % 90 === 0 ? "0.8" : "0.4"}
				strokeLinecap="round"
				transform={`rotate(${deg} 12 12)`}
			/>
		))}
	</svg>
);

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
		{ label: 'HOME', href: '/' },
		{ label: 'WATCHES', href: '/watches' },
		...(user?._id ? [{ label: 'MY PAGE', href: '/mypage' }] : []),
		{ label: 'CONTACT', href: '/contact' },
	];

	return (
		<Stack sx={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			zIndex: 1000,
			background: scrolled ? 'rgba(228, 228, 222, 0.97)' : '#E4E4DE',
			backdropFilter: scrolled ? 'blur(10px)' : 'none',
			borderBottom: '1px solid #C4C5BA',
			transition: 'all 0.3s',
		}}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: 3, py: 1.5 }}>
				<Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
					<LuxuryWatchIcon size={26} color="#595f39" />
					<Box component="span" sx={{ color: '#1B1B1B', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 3 }}>
						TIMELESS
					</Box>
					<Box component="span" sx={{ color: '#999', fontWeight: 300, fontSize: '0.95rem', ml: -0.5, letterSpacing: 1 }}>
						· Watches
					</Box>
				</Link>

				<Stack direction="row" alignItems="center" spacing={0.5}>
					{navLinks.map((link) => (
						<Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
							<Button sx={{
								color: router.pathname === link.href ? '#595f39' : '#777',
								fontWeight: router.pathname === link.href ? 600 : 400,
								fontSize: '0.8rem',
								letterSpacing: '0.5px',
								'&:hover': { color: '#595f39', background: 'rgba(89,95,57,0.06)' },
							}}>
								{link.label}
							</Button>
						</Link>
					))}

					{user?._id ? (
						<>
							<Box onClick={(e: any) => setLogoutAnchor(e.currentTarget)} sx={{
								width: 34, height: 34, borderRadius: '50%', overflow: 'hidden',
								border: '2px solid #595f39', cursor: 'pointer', ml: 1,
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
						<Stack direction="row" spacing={1} sx={{ ml: 1 }}>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button sx={{ color: '#1B1B1B', fontWeight: 600, fontSize: '0.8rem', '&:hover': { color: '#595f39' } }}>
									LOGIN
								</Button>
							</Link>
							<Link href="/account/join" style={{ textDecoration: 'none' }}>
								<Button sx={{
									background: '#1B1B1B',
									color: '#E4E4DE',
									fontWeight: 600,
									fontSize: '0.8rem',
									borderRadius: '6px',
									px: 2,
									'&:hover': { background: '#595f39' },
								}}>
									SIGN UP
								</Button>
							</Link>
						</Stack>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Top;
