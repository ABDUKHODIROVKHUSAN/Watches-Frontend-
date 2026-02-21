import React, { useEffect } from 'react';
import { Stack, Container, Typography, Box, Button, Avatar } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { getJwtToken, logOut, updateUserInfo } from '../../libs/auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../libs/config';
import LogoutIcon from '@mui/icons-material/Logout';
import WatchIcon from '@mui/icons-material/Watch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';

const MyPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		else router.push('/account/join');
	}, []);

	if (!user?._id) return null;

	return (
		<>
			<Head><title>My Page - Watches</title></Head>
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Container maxWidth="md" sx={{ pt: 15, pb: 6 }}>
					<Stack alignItems="center" sx={{ mb: 4 }}>
						<Avatar
							src={user.memberImage?.startsWith('/') ? user.memberImage : `${REACT_APP_API_URL}/${user.memberImage}`}
							sx={{ width: 120, height: 120, mb: 2, border: '3px solid #c9a96e' }}
						/>
						<Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
							{user.memberNick}
						</Typography>
						<Typography sx={{ color: '#c9a96e', textTransform: 'uppercase', letterSpacing: 2 }}>
							{user.memberType}
						</Typography>
						{user.memberFullName && (
							<Typography sx={{ color: '#b0b0b0', mt: 1 }}>{user.memberFullName}</Typography>
						)}
					</Stack>

					<Stack direction="row" justifyContent="center" spacing={4} sx={{ mb: 4 }}>
						{[
							{ icon: <WatchIcon />, label: 'Watches', value: user.memberWatches },
							{ icon: <FavoriteIcon />, label: 'Likes', value: user.memberLikes },
							{ icon: <VisibilityIcon />, label: 'Views', value: user.memberViews },
						].map((stat) => (
							<Box key={stat.label} sx={{
								textAlign: 'center',
								p: 3,
								background: '#1a1a2e',
								borderRadius: '12px',
								border: '1px solid rgba(201,169,110,0.1)',
								minWidth: 120,
							}}>
								<Box sx={{ color: '#c9a96e', mb: 1 }}>{stat.icon}</Box>
								<Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{stat.value}</Typography>
								<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{stat.label}</Typography>
							</Box>
						))}
					</Stack>

					{user.memberDesc && (
						<Box sx={{ background: '#1a1a2e', borderRadius: '12px', p: 3, mb: 4, border: '1px solid rgba(201,169,110,0.1)' }}>
							<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1 }}>About</Typography>
							<Typography sx={{ color: '#b0b0b0' }}>{user.memberDesc}</Typography>
						</Box>
					)}

					<Stack alignItems="center">
						<Button
							variant="outlined"
							startIcon={<LogoutIcon />}
							onClick={() => logOut()}
							sx={{ color: '#ff6b6b', borderColor: '#ff6b6b', '&:hover': { borderColor: '#ff5252', background: 'rgba(255,107,107,0.1)' } }}
						>
							Logout
						</Button>
					</Stack>
				</Container>
				<Footer />
			</Stack>
		</>
	);
};

export default MyPage;
