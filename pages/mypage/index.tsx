import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Stack,
	Container,
	Typography,
	Box,
	Button,
	Avatar,
	Grid,
	Chip,
	TextField,
	MenuItem,
	Divider,
	IconButton,
} from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { getJwtToken, logOut, updateStorage, updateUserInfo } from '../../libs/auth';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../libs/config';
import LogoutIcon from '@mui/icons-material/Logout';
import WatchIcon from '@mui/icons-material/Watch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Link from 'next/link';
import { GET_FAVORITE_WATCHES } from '../../apollo/user/query';
import { IMAGE_UPLOADER, UPDATE_MEMBER } from '../../apollo/user/mutation';

type TabKey = 'overview' | 'collection' | 'payment';

const MyPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabKey>('overview');
	const [editMode, setEditMode] = useState(false);
	const [cardType, setCardType] = useState('VISA');
	const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
	const [cardCvc, setCardCvc] = useState('428');
	const [cardExpiry, setCardExpiry] = useState('11/28');
	const [cardHolder, setCardHolder] = useState('');
	const [profileForm, setProfileForm] = useState({
		memberNick: '',
		memberFullName: '',
		memberPhone: '',
		memberAddress: '',
		memberEmail: '',
	});
	const [browseSeconds, setBrowseSeconds] = useState(0);
	const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
	const [pendingAvatarPreview, setPendingAvatarPreview] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [updateMemberMutation] = useMutation(UPDATE_MEMBER);
	const [imageUploaderMutation] = useMutation(IMAGE_UPLOADER);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		else router.push('/account/join');
	}, []);

	const { data: favoriteData, loading: favoritesLoading } = useQuery(GET_FAVORITE_WATCHES, {
		skip: !user?._id,
		variables: { input: { page: 1, limit: 12 } },
		fetchPolicy: 'network-only',
	});

	const favoriteWatches = favoriteData?.getFavoriteWatches?.list || [];

	const totalCollectionValue = useMemo(() => {
		const sum = favoriteWatches.reduce((acc: number, watch: any) => acc + Number(watch.watchPrice || 0), 0);
		if (sum > 0) return sum;
		return Math.max(0, (user.memberWatches || 0) * 4800);
	}, [favoriteWatches, user.memberWatches]);

	const totalOrders = useMemo(() => Math.max(0, Math.round((user.memberPoints || 0) / 80)), [user.memberPoints]);
	const estimatedBrowsingHours = useMemo(() => Number((browseSeconds / 3600).toFixed(1)), [browseSeconds]);
	const isVipMember = totalCollectionValue >= 50000 && totalOrders > 0;
	const displayName = profileForm.memberFullName || profileForm.memberNick || user.memberNick || 'User';
	const displayTitle = 'Luxury Watch Collector & Enthusiast';
	const profileEmail =
		profileForm.memberEmail ||
		`${(profileForm.memberNick || user.memberNick || 'member').toLowerCase().replace(/\s+/g, '.')}@timeless.com`;

	const tabButtonSx = (key: TabKey) => ({
		color: activeTab === key ? '#111111' : '#666666',
		fontWeight: activeTab === key ? 700 : 500,
		letterSpacing: '0.5px',
		borderBottom: activeTab === key ? '2px solid #D4AF37' : '2px solid transparent',
		borderRadius: 0,
		px: 0.8,
		minHeight: 34,
		fontSize: '0.88rem',
		'&:hover': { background: 'transparent', color: '#111111' },
	});

	useEffect(() => {
		if (!user?._id) return;
		const savedEmail = localStorage.getItem(`memberEmail:${user._id}`) || '';
		const savedSeconds = Number(localStorage.getItem(`browseSeconds:${user._id}`) || 0);
		setProfileForm({
			memberNick: user.memberNick || '',
			memberFullName: user.memberFullName || user.memberNick || '',
			memberPhone: user.memberPhone || '',
			memberAddress: user.memberAddress || '',
			memberEmail: savedEmail,
		});
		setCardHolder(user.memberFullName || user.memberNick || 'User');
		setBrowseSeconds(savedSeconds);
	}, [user]);

	useEffect(() => {
		if (!user?._id) return;
		const timer = setInterval(() => {
			setBrowseSeconds((prev) => {
				const next = prev + 10;
				localStorage.setItem(`browseSeconds:${user._id}`, String(next));
				return next;
			});
		}, 10000);
		return () => clearInterval(timer);
	}, [user?._id]);

	if (!user?._id) return null;

	const handleProfileSave = async () => {
		try {
			let nextMemberImage: string | undefined;
			if (pendingAvatarFile) {
				const uploadResult = await imageUploaderMutation({
					variables: { file: pendingAvatarFile, target: 'member' },
				});
				nextMemberImage = uploadResult?.data?.imageUploader;
			}

			const result = await updateMemberMutation({
				variables: {
					input: {
						_id: user._id,
						memberNick: profileForm.memberNick,
						memberFullName: profileForm.memberFullName,
						memberPhone: profileForm.memberPhone,
						memberAddress: profileForm.memberAddress,
						...(nextMemberImage ? { memberImage: nextMemberImage } : {}),
					},
				},
			});
			const token = result?.data?.updateMember?.accessToken;
			if (token) {
				updateStorage({ jwtToken: token });
				updateUserInfo(token);
			}
			if (user?._id) localStorage.setItem(`memberEmail:${user._id}`, profileForm.memberEmail);
			setPendingAvatarFile(null);
			setPendingAvatarPreview('');
			setEditMode(false);
		} catch (err) {
			console.log('Profile save failed', err);
		}
	};

	const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPendingAvatarFile(file);
		setPendingAvatarPreview(URL.createObjectURL(file));
	};

	return (
		<>
			<Head><title>My Page - Watches</title></Head>
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex' }}>
				<Top />
				<Container maxWidth="lg" sx={{ pt: 14, pb: 8 }}>
					<Stack
						sx={{
							background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(247,247,247,1) 100%)',
							border: '1px solid rgba(212,175,55,0.28)',
							borderRadius: '18px',
							p: { xs: 2.5, md: 4 },
							boxShadow: '0 12px 34px rgba(0,0,0,0.12)',
						}}
					>
						<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
							<Stack direction="row" spacing={2} alignItems="center">
								<Box sx={{ position: 'relative', width: 88, height: 88 }}>
									<Avatar
										src={
											pendingAvatarPreview ||
											(user.memberImage?.startsWith('/')
												? user.memberImage
												: `${REACT_APP_API_URL}/${user.memberImage}`)
										}
										sx={{ width: 88, height: 88, border: '2px solid #D4AF37' }}
									/>
									<Box
										onClick={() => editMode && fileInputRef.current?.click()}
										sx={{
											position: 'absolute',
											inset: 0,
											borderRadius: '50%',
											background: 'rgba(0,0,0,0.45)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: editMode ? 'pointer' : 'default',
											opacity: 0,
											transition: 'opacity 0.25s',
											'&:hover': { opacity: editMode ? 1 : 0 },
										}}
									>
										<CameraAltOutlinedIcon sx={{ color: '#FAFAFA' }} />
									</Box>
								</Box>
								<input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarSelect} />
								<Stack spacing={0.5}>
									<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
										<Typography sx={{ color: '#111111', fontSize: { xs: '1.4rem', md: '2rem' }, fontWeight: 600 }}>
											{displayName}
										</Typography>
										<Chip
											label={isVipMember ? 'VIP MEMBER' : 'USER'}
											size="small"
											sx={{
												background: 'rgba(212,175,55,0.18)',
												border: '1px solid rgba(212,175,55,0.55)',
												color: '#D4AF37',
												fontWeight: 700,
											}}
										/>
									</Stack>
									<Typography sx={{ color: '#555555', fontSize: '0.95rem' }}>{displayTitle}</Typography>
									<Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 0.5 }}>
										<Stack direction="row" spacing={0.5} alignItems="center">
											<LocationOnOutlinedIcon sx={{ color: '#666666', fontSize: 16 }} />
											<Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>
												{user.memberAddress || 'New York, USA'}
											</Typography>
										</Stack>
										<Stack direction="row" spacing={0.5} alignItems="center">
											<AlternateEmailOutlinedIcon sx={{ color: '#666666', fontSize: 16 }} />
											<Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>{profileEmail}</Typography>
										</Stack>
										<Stack direction="row" spacing={0.5} alignItems="center">
											<AutoAwesomeOutlinedIcon sx={{ color: '#666666', fontSize: 16 }} />
											<Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>Member account</Typography>
										</Stack>
									</Stack>
								</Stack>
							</Stack>
							<Stack direction="row" spacing={1} justifyContent="flex-end">
								<IconButton
									onClick={() => setEditMode((prev) => !prev)}
									sx={{ color: '#111111', border: '1px solid rgba(0,0,0,0.16)', width: 34, height: 34 }}
								>
									<EditOutlinedIcon sx={{ fontSize: 18 }} />
								</IconButton>
								<Button
									variant="outlined"
									startIcon={<LogoutIcon />}
									onClick={() => logOut()}
									sx={{
										color: '#111111',
										borderColor: 'rgba(0,0,0,0.24)',
										minWidth: 86,
										height: 34,
										fontSize: '0.75rem',
										'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
									}}
								>
									Logout
								</Button>
							</Stack>
						</Stack>

						<Grid container spacing={2} sx={{ mb: 3 }}>
							{[
								{ icon: <WatchIcon />, label: 'Watches Owned', value: user.memberWatches, color: '#f59e0b' },
								{ icon: <FavoriteIcon />, label: 'Wishlist Items', value: favoriteWatches.length || user.memberLikes, color: '#ec4899' },
								{ icon: <ShoppingBagOutlinedIcon />, label: 'Total Orders', value: totalOrders, color: '#6366f1' },
								{
									icon: <TrendingUpOutlinedIcon />,
									label: 'Collection Value',
									value: `$${Math.round(totalCollectionValue / 1000)}K`,
									color: '#14b8a6',
								},
							].map((stat) => (
								<Grid item xs={12} sm={6} md={3} key={stat.label}>
									<Box
										sx={{
											p: 2.2,
											borderRadius: '14px',
											border: '1px solid rgba(0,0,0,0.12)',
											background: '#FFFFFF',
											height: '100%',
											boxShadow: '0 4px 14px rgba(17,17,17,0.05)',
										}}
									>
										<Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
										<Typography sx={{ color: '#111111', fontSize: '1.5rem', fontWeight: 600 }}>{stat.value}</Typography>
										<Typography sx={{ color: '#666666', fontSize: '0.84rem' }}>{stat.label}</Typography>
									</Box>
								</Grid>
							))}
						</Grid>

						<Stack direction="row" spacing={3} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 0.5 }}>
							<Button onClick={() => setActiveTab('overview')} sx={tabButtonSx('overview')}>Overview</Button>
							<Button onClick={() => setActiveTab('collection')} sx={tabButtonSx('collection')}>Collection</Button>
							<Button onClick={() => setActiveTab('payment')} sx={tabButtonSx('payment')}>Payment Details</Button>
						</Stack>
						<Divider sx={{ borderColor: 'rgba(0,0,0,0.12)', mb: 3 }} />

						{activeTab === 'overview' && (
							<Grid container spacing={2}>
								{[
									{ label: 'Phone Number', value: user.memberPhone || '+1 000 000 0000', icon: <PhoneIphoneOutlinedIcon /> },
									{ label: 'Full Name', value: profileForm.memberFullName || user.memberFullName || user.memberNick || 'User', icon: <AutoAwesomeOutlinedIcon /> },
									{ label: 'Email', value: profileEmail, icon: <AlternateEmailOutlinedIcon /> },
									{ label: 'Address', value: user.memberAddress || 'New York, USA', icon: <LocationOnOutlinedIcon /> },
									{ label: 'Wishlist Items', value: String(favoriteWatches.length || user.memberLikes || 0), icon: <FavoriteIcon /> },
									{ label: 'Hours Browsed', value: `${estimatedBrowsingHours} hrs`, icon: <VisibilityIcon /> },
								].map((item) => (
									<Grid item xs={12} md={6} key={item.label}>
										<Box
											sx={{
												p: 2.2,
												borderRadius: '14px',
												background: '#FFFFFF',
												border: '1px solid rgba(0,0,0,0.12)',
											}}
										>
											<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
												<Box sx={{ color: '#D4AF37' }}>{item.icon}</Box>
												<Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>{item.label}</Typography>
											</Stack>
											{editMode && (item.label === 'Phone Number' || item.label === 'Full Name' || item.label === 'Address' || item.label === 'Email') ? (
													<TextField
														size="small"
														fullWidth
														value={
															item.label === 'Phone Number'
																? profileForm.memberPhone
																: item.label === 'Full Name'
																	? profileForm.memberFullName
																	: item.label === 'Address'
																		? profileForm.memberAddress
																		: profileForm.memberEmail
														}
														onChange={(e) =>
															setProfileForm((prev) => ({
																...prev,
																[item.label === 'Phone Number'
																	? 'memberPhone'
																	: item.label === 'Full Name'
																		? 'memberFullName'
																		: item.label === 'Address'
																			? 'memberAddress'
																			: 'memberEmail']: e.target.value,
															}))
														}
													/>
											) : (
												<Typography sx={{ color: '#111111', fontWeight: 600 }}>{item.value}</Typography>
											)}
										</Box>
									</Grid>
								))}
								{editMode && (
									<Grid item xs={12}>
										<Stack direction="row" spacing={1} justifyContent="flex-end">
											<Button
												variant="outlined"
												startIcon={<CloseOutlinedIcon />}
												onClick={() => {
													setEditMode(false);
													setPendingAvatarFile(null);
													setPendingAvatarPreview('');
												}}
												sx={{ color: '#111111', borderColor: 'rgba(0,0,0,0.24)' }}
											>
												Cancel
											</Button>
											<Button
												variant="contained"
												startIcon={<SaveOutlinedIcon />}
												onClick={handleProfileSave}
												sx={{ background: '#111111', color: '#FAFAFA', '&:hover': { background: '#2b2b2b' } }}
											>
												Save Changes
											</Button>
										</Stack>
									</Grid>
								)}
							</Grid>
						)}

						{activeTab === 'collection' && (
							<>
								{favoritesLoading ? (
									<Typography sx={{ color: '#666666' }}>Loading collection...</Typography>
								) : favoriteWatches.length === 0 ? (
									<Box
										sx={{
											border: '1px dashed rgba(212,175,55,0.55)',
											borderRadius: '14px',
											background:
												'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(249,249,249,0.9) 100%)',
											py: { xs: 4, md: 5 },
											px: 3,
											textAlign: 'center',
										}}
									>
										<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '1rem', mb: 0.8 }}>
											No liked watches yet
										</Typography>
										<Typography sx={{ color: '#666666', fontSize: '0.88rem', mb: 2.2 }}>
											Save favorites from the Watches page to build your personal collection.
										</Typography>
										<Link href="/watches" style={{ textDecoration: 'none' }}>
											<Button
												variant="outlined"
												sx={{
													color: '#111111',
													borderColor: 'rgba(0,0,0,0.24)',
													fontSize: '0.78rem',
													letterSpacing: '1.2px',
													px: 2.8,
													'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
												}}
											>
												Explore Watches
											</Button>
										</Link>
									</Box>
								) : (
									<Grid container spacing={2}>
										{favoriteWatches.map((watch: any) => (
											<Grid item xs={12} md={4} key={watch._id}>
												<Box
													sx={{
														borderRadius: '14px',
														overflow: 'hidden',
														border: '1px solid rgba(0,0,0,0.12)',
														background: '#FFFFFF',
														boxShadow: '0 6px 16px rgba(17,17,17,0.06)',
													}}
												>
													<Box sx={{ position: 'relative', height: 190, background: '#f4f4f4' }}>
														{watch.watchImages?.[0] ? (
															<img
																src={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
																alt={watch.watchTitle}
																style={{ width: '100%', height: '100%', objectFit: 'cover' }}
															/>
														) : (
															<Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
																<WatchIcon sx={{ color: '#D4AF37', fontSize: 54 }} />
															</Stack>
														)}
														<Box
															sx={{
																position: 'absolute',
																right: 10,
																top: 10,
																background: 'rgba(212,175,55,0.94)',
																color: '#111111',
																px: 1.1,
																py: 0.4,
																borderRadius: '999px',
																fontWeight: 700,
																fontSize: '0.72rem',
															}}
														>
															${watch.watchPrice?.toLocaleString()}
														</Box>
													</Box>
													<Box sx={{ p: 2 }}>
														<Typography sx={{ color: '#111111', fontWeight: 600, mb: 0.3 }}>{watch.watchTitle}</Typography>
														<Typography sx={{ color: '#666666', mb: 1.5, fontSize: '0.85rem' }}>
															{watch.watchBrand?.replace('_', ' ')}
														</Typography>
														<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
															<Button
																fullWidth
																sx={{
																	color: '#111111',
																	border: '1px solid rgba(0,0,0,0.18)',
																	'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
																}}
															>
																Details
															</Button>
														</Link>
													</Box>
												</Box>
											</Grid>
										))}
									</Grid>
								)}
							</>
						)}

						{activeTab === 'payment' && (
							<Grid container spacing={2}>
								<Grid item xs={12} md={7}>
									<Box
										sx={{
											p: 2.5,
											borderRadius: '14px',
											background: '#FFFFFF',
											border: '1px solid rgba(0,0,0,0.12)',
										}}
									>
										<Typography sx={{ color: '#111111', fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
											Card Account Details
										</Typography>
										<Stack spacing={2}>
											<TextField
												label="Card Holder"
												value={cardHolder}
												onChange={(e) => setCardHolder(e.target.value)}
												size="small"
												fullWidth
												InputLabelProps={{ sx: { color: '#666666' } }}
												sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
											/>
											<TextField
												label="Card Type"
												value={cardType}
												onChange={(e) => setCardType(e.target.value)}
												size="small"
												select
												fullWidth
												InputLabelProps={{ sx: { color: '#666666' } }}
												sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
											>
												{['VISA', 'MASTERCARD', 'DOMESTIC'].map((opt) => (
													<MenuItem key={opt} value={opt}>{opt}</MenuItem>
												))}
											</TextField>
											<TextField
												label="Card Number"
												value={cardNumber}
												onChange={(e) => setCardNumber(e.target.value)}
												size="small"
												fullWidth
												InputLabelProps={{ sx: { color: '#666666' } }}
												sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
											/>
											<Stack direction="row" spacing={2}>
												<TextField
													label="CVC"
													value={cardCvc}
													onChange={(e) => setCardCvc(e.target.value)}
													size="small"
													fullWidth
													InputLabelProps={{ sx: { color: '#666666' } }}
													sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
												/>
												<TextField
													label="Exp Date"
													value={cardExpiry}
													onChange={(e) => setCardExpiry(e.target.value)}
													size="small"
													fullWidth
													InputLabelProps={{ sx: { color: '#666666' } }}
													sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
												/>
											</Stack>
										</Stack>
									</Box>
								</Grid>
								<Grid item xs={12} md={5}>
									<Stack spacing={2}>
										<Box
											sx={{
												p: 2.6,
												borderRadius: '16px',
												background:
													'linear-gradient(145deg, #123a33 0%, #1f4d45 42%, #5b2a2a 100%)',
												border: '1px solid rgba(212,175,55,0.5)',
												boxShadow: '0 10px 28px rgba(0,0,0,0.25)',
												position: 'relative',
												overflow: 'hidden',
											}}
										>
											<Box
												sx={{
													position: 'absolute',
													inset: 0,
													background:
														'radial-gradient(circle at 15% 10%, rgba(212,175,55,0.28), transparent 42%)',
													pointerEvents: 'none',
												}}
											/>
											<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
												<Typography sx={{ color: '#D4AF37', fontWeight: 700, letterSpacing: 1.2, fontSize: '0.78rem' }}>
													TIMELESS PAY
												</Typography>
												<Typography sx={{ color: '#FAFAFA', fontWeight: 700, fontSize: '0.85rem' }}>
													{cardType}
												</Typography>
											</Stack>
											<Box
												sx={{
													width: 38,
													height: 28,
													borderRadius: '6px',
													background: 'linear-gradient(160deg, #d4af37, #9f7e2e)',
													mb: 2.2,
												}}
											/>
											<Typography
												sx={{
													color: '#FAFAFA',
													fontWeight: 600,
													letterSpacing: 2,
													fontSize: '1.05rem',
													mb: 2.4,
													fontFamily: '"Roboto Mono", monospace',
												}}
											>
												{cardNumber}
											</Typography>
											<Stack direction="row" justifyContent="space-between" alignItems="flex-end">
												<Box>
													<Typography sx={{ color: 'rgba(250,250,250,0.62)', fontSize: '0.66rem', mb: 0.2 }}>
														CARD HOLDER
													</Typography>
													<Typography sx={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.86rem' }}>
														{cardHolder || 'USER'}
													</Typography>
												</Box>
												<Box sx={{ textAlign: 'right' }}>
													<Typography sx={{ color: 'rgba(250,250,250,0.62)', fontSize: '0.66rem', mb: 0.2 }}>
														EXP
													</Typography>
													<Typography sx={{ color: '#FAFAFA', fontWeight: 600, fontSize: '0.86rem' }}>
														{cardExpiry}
													</Typography>
												</Box>
											</Stack>
										</Box>
										<Box
											sx={{
												p: 2,
												borderRadius: '14px',
												background: '#FFFFFF',
												border: '1px solid rgba(0,0,0,0.12)',
											}}
										>
											<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1.2 }}>Billing Snapshot</Typography>
											<Typography sx={{ color: '#666666', fontSize: '0.84rem' }}>Card Type: {cardType}</Typography>
											<Typography sx={{ color: '#666666', fontSize: '0.84rem' }}>Security Code: {cardCvc}</Typography>
											<Typography sx={{ color: '#666666', fontSize: '0.84rem' }}>Status: Active</Typography>
										</Box>
									</Stack>
								</Grid>
							</Grid>
						)}
					</Stack>
				</Container>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default MyPage;
