import type { ComponentType } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	Avatar,
	Box,
	Button,
	Divider,
	IconButton,
	Stack,
	Toolbar,
	Typography,
	AppBar,
	Drawer,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WatchIcon from '@mui/icons-material/Watch';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { REACT_APP_API_URL } from '../../config';

const drawerWidth = 260;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (loading) return;
			if (user?.memberType !== 'ADMIN') {
				router.push('/').then();
			}
		}, [loading, router, user]);

		const avatarSrc = useMemo(() => {
			if (!user?.memberImage) return '/img/profile/defaultUser.svg';
			return user.memberImage.startsWith('/') ? user.memberImage : `${REACT_APP_API_URL}/${user.memberImage}`;
		}, [user?.memberImage]);

		if (loading || user?.memberType !== 'ADMIN') return null;

		return (
			<main>
				<Box sx={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA' }}>
					<AppBar
						position="fixed"
						elevation={0}
						sx={{
							width: `calc(100% - ${drawerWidth}px)`,
							ml: `${drawerWidth}px`,
							background: 'rgba(255,255,255,0.96)',
							borderBottom: '1px solid rgba(212,175,55,0.38)',
						}}
					>
						<Toolbar sx={{ justifyContent: 'space-between' }}>
							<Stack direction="row" spacing={1} alignItems="center">
								<DashboardOutlinedIcon sx={{ color: '#111111' }} />
								<Typography sx={{ color: '#111111', fontWeight: 700 }}>Admin Dashboard</Typography>
							</Stack>

							<Stack direction="row" spacing={1.2} alignItems="center">
								<Avatar src={avatarSrc} sx={{ width: 30, height: 30 }} />
								<Typography sx={{ color: '#555555', fontSize: '0.86rem' }}>{user.memberNick}</Typography>
								<IconButton onClick={() => logOut()} size="small" sx={{ color: '#111111' }}>
									<LogoutIcon fontSize="small" />
								</IconButton>
							</Stack>
						</Toolbar>
					</AppBar>

					<Drawer
						variant="permanent"
						anchor="left"
						sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
								background: '#111111',
								color: '#FAFAFA',
							},
						}}
					>
						<Toolbar />
						<Box sx={{ px: 2.2, py: 1.8 }}>
							<Typography sx={{ color: '#D4AF37', fontSize: '0.74rem', letterSpacing: '1.6px' }}>
								TIMELESS ADMIN
							</Typography>
							<Typography sx={{ mt: 0.4, fontWeight: 700 }}>Watches Management</Typography>
						</Box>
						<Divider sx={{ borderColor: 'rgba(250,250,250,0.2)' }} />

						<Stack sx={{ px: 1.4, py: 1.4 }} spacing={0.7}>
							<Link href="/_admin/users">
								<Button
									startIcon={<GroupOutlinedIcon />}
									sx={{
										width: '100%',
										justifyContent: 'flex-start',
										color: router.pathname.startsWith('/_admin/users') ? '#111111' : '#FAFAFA',
										background: router.pathname.startsWith('/_admin/users') ? '#D4AF37' : 'transparent',
										borderRadius: '8px',
										fontWeight: 600,
										'&:hover': { background: router.pathname.startsWith('/_admin/users') ? '#D4AF37' : '#2A2A2A' },
									}}
								>
									Users
								</Button>
							</Link>

							<Link href="/_admin/watches">
								<Button
									startIcon={<WatchIcon />}
									sx={{
										width: '100%',
										justifyContent: 'flex-start',
										color: router.pathname.startsWith('/_admin/watches') ? '#111111' : '#FAFAFA',
										background: router.pathname.startsWith('/_admin/watches') ? '#D4AF37' : 'transparent',
										borderRadius: '8px',
										fontWeight: 600,
										'&:hover': { background: router.pathname.startsWith('/_admin/watches') ? '#D4AF37' : '#2A2A2A' },
									}}
								>
									Watches
								</Button>
							</Link>

							<Link href="/">
								<Button
									startIcon={<HomeOutlinedIcon />}
									sx={{
										width: '100%',
										justifyContent: 'flex-start',
										color: '#FAFAFA',
										borderRadius: '8px',
										'&:hover': { background: '#2A2A2A' },
									}}
								>
									Back to Site
								</Button>
							</Link>
						</Stack>
					</Drawer>

					<Box
						component="section"
						sx={{
							flexGrow: 1,
							ml: `${drawerWidth}px`,
							mt: '64px',
							px: { xs: 2, md: 3 },
							py: 3,
						}}
					>
						{/* @ts-ignore */}
						<Component {...props} />
					</Box>
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
