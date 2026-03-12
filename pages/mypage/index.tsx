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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import Link from 'next/link';
import { GET_FAVORITE_WATCHES, GET_SELLER_WATCHES } from '../../apollo/user/query';
import {
	CREATE_WATCH,
	IMAGE_UPLOADER,
	IMAGES_UPLOADER,
	LIKE_TARGET_WATCH,
	UPDATE_MEMBER,
	UPDATE_WATCH,
} from '../../apollo/user/mutation';
import { getPaymentDetails, setPaymentDetails } from '../../libs/payment';
import { sweetConfirmAlert, sweetErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { useLanguage } from '../../libs/i18n/LanguageContext';
import { localizeWatchText } from '../../libs/i18n/watchText';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';

type TabKey = 'overview' | 'addWatch' | 'myWatches' | 'collection' | 'payment';
type SellerWatchStatus = 'ACTIVE' | 'SOLD' | 'OUT_OF_STOCK';

const MyPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { t } = useLanguage();
	const { isDark } = useThemeMode();
	const [activeTab, setActiveTab] = useState<TabKey>('overview');
	const [editMode, setEditMode] = useState(false);
	const [cardType, setCardType] = useState('VISA');
	const [cardNumber, setCardNumber] = useState('');
	const [cardCvc, setCardCvc] = useState('');
	const [cardExpiry, setCardExpiry] = useState('');
	const [cardHolder, setCardHolder] = useState('');
	const [paymentError, setPaymentError] = useState('');
	const [paymentSaved, setPaymentSaved] = useState(false);
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
	const [removingWatchId, setRemovingWatchId] = useState<string | null>(null);
	const [clearingCollection, setClearingCollection] = useState(false);
	const [addWatchForm, setAddWatchForm] = useState({
		watchType: 'LUXURY',
		watchBrand: 'ROLEX',
		watchTitle: '',
		watchTitleKo: '',
		watchTitleUz: '',
		watchPrice: '',
		watchDesc: '',
		watchDescKo: '',
		watchDescUz: '',
		watchBarter: false,
		watchRent: false,
		watchBestSeller: false,
		manufacturedAt: '',
	});
	const [addWatchFiles, setAddWatchFiles] = useState<File[]>([]);
	const [creatingWatch, setCreatingWatch] = useState(false);
	const [updatingWatchId, setUpdatingWatchId] = useState<string | null>(null);
	const [editWatchOpen, setEditWatchOpen] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
	const [savingWatchEdit, setSavingWatchEdit] = useState(false);
	const [editWatchFiles, setEditWatchFiles] = useState<File[]>([]);
	const [editWatchForm, setEditWatchForm] = useState({
		_id: '',
		watchType: 'LUXURY',
		watchBrand: 'ROLEX',
		watchTitle: '',
		watchTitleKo: '',
		watchTitleUz: '',
		watchPrice: '',
		watchDesc: '',
		watchDescKo: '',
		watchDescUz: '',
		watchBarter: false,
		watchRent: false,
		watchBestSeller: false,
		manufacturedAt: '',
		watchImages: [] as string[],
	});
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [updateMemberMutation] = useMutation(UPDATE_MEMBER);
	const [imageUploaderMutation] = useMutation(IMAGE_UPLOADER);
	const [imagesUploaderMutation] = useMutation(IMAGES_UPLOADER);
	const [createWatchMutation] = useMutation(CREATE_WATCH);
	const [updateWatchMutation] = useMutation(UPDATE_WATCH);
	const [likeTargetWatchMutation] = useMutation(LIKE_TARGET_WATCH);
	const isSeller = user?.memberType === 'AGENT';

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		else router.push('/account/join');
	}, []);

	const { data: favoriteData, loading: favoritesLoading, refetch: refetchFavoriteWatches } = useQuery(GET_FAVORITE_WATCHES, {
		skip: !user?._id,
		variables: { input: { page: 1, limit: 200 } },
		fetchPolicy: 'network-only',
	});

	const favoriteWatches = favoriteData?.getFavoriteWatches?.list || [];
	const { data: sellerWatchesData, loading: sellerWatchesLoading, refetch: refetchSellerWatches } = useQuery(
		GET_SELLER_WATCHES,
		{
			skip: !isSeller || !user?._id,
			variables: {
				input: {
					page: 1,
					limit: 100,
					search: {},
				},
			},
			fetchPolicy: 'network-only',
		},
	);
	const sellerWatches = sellerWatchesData?.getSellerWatches?.list || [];

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
		const savedPayment = getPaymentDetails(user._id);
		setProfileForm({
			memberNick: user.memberNick || '',
			memberFullName: user.memberFullName || user.memberNick || '',
			memberPhone: user.memberPhone || '',
			memberAddress: user.memberAddress || '',
			memberEmail: savedEmail,
		});
		setCardHolder(savedPayment.cardHolder || user.memberFullName || user.memberNick || '');
		setCardType(savedPayment.cardType || 'VISA');
		setCardNumber(savedPayment.cardNumber || '');
		setCardCvc(savedPayment.cardCvc || '');
		setCardExpiry(savedPayment.cardExpiry || '');
		setBrowseSeconds(savedSeconds);
	}, [user]);

	useEffect(() => {
		if (!user?._id) return;
		setPaymentDetails(
			{
				cardHolder,
				cardType,
				cardNumber,
				cardCvc,
				cardExpiry,
			},
			user._id,
		);
	}, [user?._id, cardHolder, cardType, cardNumber, cardCvc, cardExpiry]);

	useEffect(() => {
		if (!router.isReady) return;
		const tab = router.query?.tab;
		if (tab === 'payment') setActiveTab('payment');
	}, [router.isReady, router.query?.tab]);

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
			const safeNick = (profileForm.memberNick || user.memberNick || '').trim();
			const safeFullName = (profileForm.memberFullName || '').trim();
			const safePhone = (profileForm.memberPhone || '').trim();
			const safeAddress = (profileForm.memberAddress || '').trim();

			let nextMemberImage: string | undefined;
			if (pendingAvatarFile) {
				const uploadResult = await imageUploaderMutation({
					variables: { file: pendingAvatarFile, target: 'member' },
				});
				nextMemberImage = uploadResult?.data?.imageUploader;
			}

			const updateInput: Record<string, any> = {
				_id: user._id,
			};

			// Send only valid non-empty values to satisfy backend validators.
			if (safeNick.length >= 3 && safeNick.length <= 12) updateInput.memberNick = safeNick;
			if (safeFullName.length >= 3 && safeFullName.length <= 100) updateInput.memberFullName = safeFullName;
			if (safePhone) updateInput.memberPhone = safePhone;
			if (safeAddress.length >= 3 && safeAddress.length <= 100) updateInput.memberAddress = safeAddress;
			if (nextMemberImage) updateInput.memberImage = nextMemberImage;

			const result = await updateMemberMutation({
				variables: {
					input: updateInput,
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
		} catch (err: any) {
			const message =
				err?.graphQLErrors?.[0]?.message ||
				err?.networkError?.result?.errors?.[0]?.message ||
				err?.message ||
				'Save failed. Please check your input values and try again.';
			await sweetErrorAlert(message);
			console.log('Profile save failed', err);
		}
	};

	const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPendingAvatarFile(file);
		setPendingAvatarPreview(URL.createObjectURL(file));
	};

	const handleRemoveFromCollection = async (watchId: string) => {
		if (!watchId) return;
		try {
			setRemovingWatchId(watchId);
			await likeTargetWatchMutation({ variables: { input: watchId } });
			await refetchFavoriteWatches();
		} catch (err) {
			console.log('Remove from collection failed:', err);
		} finally {
			setRemovingWatchId(null);
		}
	};

	const handleClearCollection = async () => {
		if (!favoriteWatches.length) return;
		const confirmed = await sweetConfirmAlert('Clear entire wishlist collection?');
		if (!confirmed) return;
		try {
			setClearingCollection(true);
			await Promise.allSettled(
				favoriteWatches.map((watch: any) =>
					likeTargetWatchMutation({ variables: { input: watch._id } }),
				),
			);
			await refetchFavoriteWatches();
		} catch (err) {
			console.log('Clear collection failed:', err);
		} finally {
			setClearingCollection(false);
		}
	};

	const formatCardNumber = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 19);
		return digits.replace(/(.{4})/g, '$1 ').trim();
	};

	const formatExpiry = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 4);
		if (digits.length <= 2) return digits;
		return `${digits.slice(0, 2)}/${digits.slice(2)}`;
	};

	const validatePaymentDetails = () => {
		const holder = cardHolder.trim();
		const numberDigits = cardNumber.replace(/\s+/g, '');
		const cvcDigits = cardCvc.replace(/\D/g, '');
		const expiry = cardExpiry.trim();

		if (holder.length < 3) return 'Card holder name must be at least 3 characters.';
		if (!/^\d{13,19}$/.test(numberDigits)) return 'Card number must be 13-19 digits.';
		if (!/^\d{3,4}$/.test(cvcDigits)) return 'CVC must be 3 or 4 digits.';
		if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return 'Expiry must be in MM/YY format.';

		const [mm, yy] = expiry.split('/');
		const now = new Date();
		const currentYY = now.getFullYear() % 100;
		const currentMM = now.getMonth() + 1;
		const expYY = Number(yy);
		const expMM = Number(mm);
		if (expYY < currentYY || (expYY === currentYY && expMM < currentMM)) {
			return 'Card expiry date is in the past.';
		}
		return '';
	};

	const handleSavePaymentDetails = () => {
		setPaymentSaved(false);
		const error = validatePaymentDetails();
		if (error) {
			setPaymentError(error);
			return;
		}
		setPaymentError('');
		setPaymentDetails(
			{
				cardHolder: cardHolder.trim(),
				cardType,
				cardNumber: cardNumber.trim(),
				cardCvc: cardCvc.trim(),
				cardExpiry: cardExpiry.trim(),
			},
			user._id,
		);
		setPaymentSaved(true);
	};

	const handleAddWatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setAddWatchFiles(files.slice(0, 5));
	};

	const handleCreateWatch = async () => {
		try {
			if (!addWatchForm.watchTitle.trim()) return sweetErrorAlert('Watch title is required.');
			if (!addWatchForm.watchPrice || Number(addWatchForm.watchPrice) <= 0) {
				return sweetErrorAlert('Watch price must be greater than 0.');
			}
			if (!addWatchFiles.length) return sweetErrorAlert('Please upload at least one watch image.');

			setCreatingWatch(true);
			const uploadResult = await imagesUploaderMutation({
				variables: { files: addWatchFiles, target: 'watch' },
			});

			const uploadedImages = (uploadResult?.data?.imagesUploader || []).filter(Boolean);
			if (!uploadedImages.length) return sweetErrorAlert('Image upload failed. Please try again.');

			await createWatchMutation({
				variables: {
					input: {
						watchType: addWatchForm.watchType,
						watchBrand: addWatchForm.watchBrand,
						watchTitle: addWatchForm.watchTitle.trim(),
						watchTitleI18n: {
							en: addWatchForm.watchTitle.trim(),
							ko: addWatchForm.watchTitleKo.trim() || undefined,
							uz: addWatchForm.watchTitleUz.trim() || undefined,
						},
						watchPrice: Number(addWatchForm.watchPrice),
						watchImages: uploadedImages,
						watchDesc: addWatchForm.watchDesc.trim() || undefined,
						watchDescI18n: {
							en: addWatchForm.watchDesc.trim() || undefined,
							ko: addWatchForm.watchDescKo.trim() || undefined,
							uz: addWatchForm.watchDescUz.trim() || undefined,
						},
						watchBarter: addWatchForm.watchBarter,
						watchRent: addWatchForm.watchRent,
						watchBestSeller: addWatchForm.watchBestSeller,
						manufacturedAt: addWatchForm.manufacturedAt ? new Date(addWatchForm.manufacturedAt) : undefined,
					},
				},
			});

			await sweetMixinSuccessAlert('Watch created successfully.');
			setAddWatchForm({
				watchType: 'LUXURY',
				watchBrand: 'ROLEX',
				watchTitle: '',
				watchTitleKo: '',
				watchTitleUz: '',
				watchPrice: '',
				watchDesc: '',
				watchDescKo: '',
				watchDescUz: '',
				watchBarter: false,
				watchRent: false,
				watchBestSeller: false,
				manufacturedAt: '',
			});
			setAddWatchFiles([]);
			await refetchSellerWatches();
			setActiveTab('myWatches');
		} catch (err: any) {
			const message =
				err?.graphQLErrors?.[0]?.message ||
				err?.networkError?.result?.errors?.[0]?.message ||
				err?.message ||
				'Failed to create watch.';
			await sweetErrorAlert(message);
		} finally {
			setCreatingWatch(false);
		}
	};

	const handleOpenEditWatch = (watch: any) => {
		const manufacturedAtValue = watch?.manufacturedAt
			? new Date(watch.manufacturedAt).toISOString().slice(0, 10)
			: '';
		setEditWatchForm({
			_id: watch._id,
			watchType: watch.watchType || 'LUXURY',
			watchBrand: watch.watchBrand || 'ROLEX',
			watchTitle: watch?.watchTitleI18n?.en || watch.watchTitle || '',
			watchTitleKo: watch?.watchTitleI18n?.ko || '',
			watchTitleUz: watch?.watchTitleI18n?.uz || '',
			watchPrice: String(watch.watchPrice || ''),
			watchDesc: watch?.watchDescI18n?.en || watch.watchDesc || '',
			watchDescKo: watch?.watchDescI18n?.ko || '',
			watchDescUz: watch?.watchDescI18n?.uz || '',
			watchBarter: Boolean(watch.watchBarter),
			watchRent: Boolean(watch.watchRent),
			watchBestSeller: Boolean(watch.watchBestSeller),
			manufacturedAt: manufacturedAtValue,
			watchImages: Array.isArray(watch.watchImages) ? watch.watchImages : [],
		});
		setEditWatchFiles([]);
		setEditWatchOpen(true);
	};

	const handleEditWatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setEditWatchFiles(files.slice(0, 5));
	};

	const handleSaveWatchEdit = async () => {
		try {
			if (!editWatchForm._id) return;
			if (!editWatchForm.watchTitle.trim()) return sweetErrorAlert('Watch title is required.');
			if (!editWatchForm.watchPrice || Number(editWatchForm.watchPrice) <= 0) {
				return sweetErrorAlert('Watch price must be greater than 0.');
			}
			if (editWatchForm.watchDesc.trim() && editWatchForm.watchDesc.trim().length < 5) {
				return sweetErrorAlert('Description must be at least 5 characters.');
			}

			setSavingWatchEdit(true);
			let mergedImages = [...editWatchForm.watchImages];

			if (editWatchFiles.length) {
				const uploadResult = await imagesUploaderMutation({
					variables: { files: editWatchFiles, target: 'watch' },
				});
				const newlyUploaded = (uploadResult?.data?.imagesUploader || []).filter(Boolean);
				mergedImages = [...mergedImages, ...newlyUploaded].slice(0, 10);
			}

			if (!mergedImages.length) {
				return sweetErrorAlert('Please keep at least one image for the watch.');
			}

			await updateWatchMutation({
				variables: {
					input: {
						_id: editWatchForm._id,
						watchType: editWatchForm.watchType,
						watchBrand: editWatchForm.watchBrand,
						watchTitle: editWatchForm.watchTitle.trim(),
						watchTitleI18n: {
							en: editWatchForm.watchTitle.trim(),
							ko: editWatchForm.watchTitleKo.trim() || undefined,
							uz: editWatchForm.watchTitleUz.trim() || undefined,
						},
						watchPrice: Number(editWatchForm.watchPrice),
						watchDesc: editWatchForm.watchDesc.trim() || undefined,
						watchDescI18n: {
							en: editWatchForm.watchDesc.trim() || undefined,
							ko: editWatchForm.watchDescKo.trim() || undefined,
							uz: editWatchForm.watchDescUz.trim() || undefined,
						},
						watchBarter: editWatchForm.watchBarter,
						watchRent: editWatchForm.watchRent,
						watchBestSeller: editWatchForm.watchBestSeller,
						watchImages: mergedImages,
						manufacturedAt: editWatchForm.manufacturedAt ? new Date(editWatchForm.manufacturedAt) : undefined,
					},
				},
			});

			await sweetMixinSuccessAlert('Watch updated successfully.');
			setEditWatchOpen(false);
			setEditWatchFiles([]);
			await refetchSellerWatches();
		} catch (err: any) {
			const message =
				err?.graphQLErrors?.[0]?.message ||
				err?.networkError?.result?.errors?.[0]?.message ||
				err?.message ||
				'Failed to update watch.';
			await sweetErrorAlert(message);
		} finally {
			setSavingWatchEdit(false);
		}
	};

	const handleSellerStatusUpdate = async (watchId: string, watchStatus: SellerWatchStatus) => {
		try {
			setUpdatingWatchId(watchId);
			await updateWatchMutation({
				variables: {
					input: {
						_id: watchId,
						watchStatus,
					},
				},
			});
			await refetchSellerWatches();
		} catch (err: any) {
			const message =
				err?.graphQLErrors?.[0]?.message ||
				err?.networkError?.result?.errors?.[0]?.message ||
				err?.message ||
				'Failed to update watch status.';
			await sweetErrorAlert(message);
		} finally {
			setUpdatingWatchId(null);
		}
	};

	const handleConfirmLogout = () => {
		setLogoutDialogOpen(false);
		logOut();
	};

	return (
		<>
			<Head><title>My Page - Watches</title></Head>
			<Stack sx={{ background: isDark ? '#0b0f16' : '#FAFAFA', minHeight: '100vh', display: 'flex' }}>
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
									onClick={() => setLogoutDialogOpen(true)}
									sx={{
										color: '#111111',
										borderColor: 'rgba(0,0,0,0.24)',
										minWidth: 86,
										height: 34,
										fontSize: '0.75rem',
										'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
									}}
								>
									{t('auth.logout')}
								</Button>
							</Stack>
						</Stack>

						<Grid container spacing={2} sx={{ mb: 3 }}>
							{[
								{ icon: <WatchIcon />, label: t('mypage.watchesOwned'), value: user.memberWatches, color: '#f59e0b' },
								{ icon: <FavoriteIcon />, label: t('mypage.wishlistItems'), value: favoriteWatches.length || user.memberLikes, color: '#ec4899' },
								{ icon: <ShoppingBagOutlinedIcon />, label: t('mypage.totalOrders'), value: totalOrders, color: '#6366f1' },
								{
									icon: <TrendingUpOutlinedIcon />,
									label: t('mypage.collectionValue'),
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
							<Button onClick={() => setActiveTab('overview')} sx={tabButtonSx('overview')}>{t('mypage.overview')}</Button>
							{isSeller && <Button onClick={() => setActiveTab('addWatch')} sx={tabButtonSx('addWatch')}>{t('mypage.addWatch')}</Button>}
							{isSeller && <Button onClick={() => setActiveTab('myWatches')} sx={tabButtonSx('myWatches')}>{t('mypage.myWatches')}</Button>}
							<Button onClick={() => setActiveTab('collection')} sx={tabButtonSx('collection')}>{t('mypage.collection')}</Button>
							<Button onClick={() => setActiveTab('payment')} sx={tabButtonSx('payment')}>{t('mypage.paymentDetails')}</Button>
						</Stack>
						<Divider sx={{ borderColor: 'rgba(0,0,0,0.12)', mb: 3 }} />

						{activeTab === 'overview' && (
							<Grid container spacing={2}>
								{[
									{ field: 'phone', label: t('mypage.phoneNumber'), value: user.memberPhone || '+1 000 000 0000', icon: <PhoneIphoneOutlinedIcon /> },
									{ field: 'name', label: t('mypage.fullName'), value: profileForm.memberFullName || user.memberFullName || user.memberNick || 'User', icon: <AutoAwesomeOutlinedIcon /> },
									{ field: 'email', label: t('mypage.email'), value: profileEmail, icon: <AlternateEmailOutlinedIcon /> },
									{ field: 'address', label: t('mypage.address'), value: user.memberAddress || 'New York, USA', icon: <LocationOnOutlinedIcon /> },
									{ field: 'wishlist', label: t('mypage.wishlistItems'), value: String(favoriteWatches.length || user.memberLikes || 0), icon: <FavoriteIcon /> },
									{ field: 'hours', label: t('mypage.hoursBrowsed'), value: `${estimatedBrowsingHours} ${t('mypage.hrs')}`, icon: <VisibilityIcon /> },
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
											{editMode && (item.field === 'phone' || item.field === 'name' || item.field === 'address' || item.field === 'email') ? (
													<TextField
														size="small"
														fullWidth
														value={
															item.field === 'phone'
																? profileForm.memberPhone
																: item.field === 'name'
																	? profileForm.memberFullName
																	: item.field === 'address'
																		? profileForm.memberAddress
																		: profileForm.memberEmail
														}
														onChange={(e) =>
															setProfileForm((prev) => ({
																...prev,
																[item.field === 'phone'
																	? 'memberPhone'
																	: item.field === 'name'
																		? 'memberFullName'
																		: item.field === 'address'
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
							<Box sx={{ minHeight: { xs: 'auto', md: 540 } }}>
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
									<>
										<Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
											<Button
												size="small"
												variant="outlined"
												startIcon={<DeleteSweepOutlinedIcon />}
												onClick={handleClearCollection}
												disabled={clearingCollection}
												sx={{
													color: '#111111',
													borderColor: 'rgba(0,0,0,0.2)',
													fontSize: '0.74rem',
													'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
												}}
											>
												{clearingCollection ? 'Clearing...' : 'Clear Collection'}
											</Button>
										</Stack>
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
														<IconButton
															size="small"
															onClick={() => handleRemoveFromCollection(watch._id)}
															disabled={removingWatchId === watch._id || clearingCollection}
															sx={{
																position: 'absolute',
																left: 10,
																top: 10,
																background: 'rgba(17,17,17,0.78)',
																color: '#FAFAFA',
																width: 30,
																height: 30,
																'&:hover': { background: '#111111', color: '#D4AF37' },
															}}
														>
															<DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
														</IconButton>
													</Box>
													<Box sx={{ p: 2 }}>
														<Typography sx={{ color: '#111111', fontWeight: 600, mb: 0.3 }}>
															{watch.watchTitle}
														</Typography>
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
									</>
								)}
							</Box>
						)}

						{isSeller && activeTab === 'addWatch' && (
							<Box sx={{ minHeight: { xs: 'auto', md: 540 } }}>
								<Grid container spacing={2}>
									<Grid item xs={12} md={6}>
										<TextField
											label="Watch Title (EN)"
											size="small"
											fullWidth
											value={addWatchForm.watchTitle}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchTitle: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											label="Type"
											size="small"
											fullWidth
											select
											value={addWatchForm.watchType}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchType: e.target.value }))}
										>
											{['LUXURY', 'SPORT', 'CLASSIC', 'DRESS', 'SMART'].map((opt) => (
												<MenuItem key={opt} value={opt}>{opt}</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											label="Watch Title (KO)"
											size="small"
											fullWidth
											value={addWatchForm.watchTitleKo}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchTitleKo: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											label="Watch Title (UZ)"
											size="small"
											fullWidth
											value={addWatchForm.watchTitleUz}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchTitleUz: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<TextField
											label="Brand"
											size="small"
											fullWidth
											select
											value={addWatchForm.watchBrand}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchBrand: e.target.value }))}
										>
											{[
												'ROLEX',
												'OMEGA',
												'CARTIER',
												'TAG_HEUER',
												'PATEK_PHILIPPE',
												'AUDEMARS_PIGUET',
												'BREITLING',
												'IWC',
												'HUBLOT',
												'TISSOT',
											].map((opt) => (
												<MenuItem key={opt} value={opt}>{opt}</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} md={4}>
										<TextField
											label="Price (USD)"
											size="small"
											fullWidth
											type="number"
											value={addWatchForm.watchPrice}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchPrice: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<TextField
											label="Manufactured At"
											size="small"
											fullWidth
											type="date"
											value={addWatchForm.manufacturedAt}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, manufacturedAt: e.target.value }))}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<Button
											component="label"
											variant="outlined"
											fullWidth
											sx={{
												height: 40,
												color: '#111111',
												borderColor: 'rgba(0,0,0,0.24)',
												'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
											}}
										>
											Upload Images (max 5)
											<input type="file" hidden multiple accept="image/*" onChange={handleAddWatchFileChange} />
										</Button>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Description (EN)"
											size="small"
											fullWidth
											multiline
											minRows={3}
											value={addWatchForm.watchDesc}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchDesc: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											label="Description (KO)"
											size="small"
											fullWidth
											multiline
											minRows={2}
											value={addWatchForm.watchDescKo}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchDescKo: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											label="Description (UZ)"
											size="small"
											fullWidth
											multiline
											minRows={2}
											value={addWatchForm.watchDescUz}
											onChange={(e) => setAddWatchForm((prev) => ({ ...prev, watchDescUz: e.target.value }))}
										/>
									</Grid>
									<Grid item xs={12}>
										<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
											{addWatchFiles.map((file) => (
												<Chip key={file.name + file.size} label={file.name} size="small" />
											))}
											{addWatchFiles.length === 0 && (
												<Typography sx={{ color: '#777777', fontSize: '0.82rem' }}>No images selected.</Typography>
											)}
										</Stack>
									</Grid>
									<Grid item xs={12}>
										<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
											<Chip
												label={`Barter: ${addWatchForm.watchBarter ? 'Yes' : 'No'}`}
												onClick={() => setAddWatchForm((prev) => ({ ...prev, watchBarter: !prev.watchBarter }))}
												sx={{ cursor: 'pointer' }}
												color={addWatchForm.watchBarter ? 'warning' : 'default'}
											/>
											<Chip
												label={`Rent: ${addWatchForm.watchRent ? 'Yes' : 'No'}`}
												onClick={() => setAddWatchForm((prev) => ({ ...prev, watchRent: !prev.watchRent }))}
												sx={{ cursor: 'pointer' }}
												color={addWatchForm.watchRent ? 'warning' : 'default'}
											/>
											<Chip
												label={`Best Seller: ${addWatchForm.watchBestSeller ? 'Yes' : 'No'}`}
												onClick={() => setAddWatchForm((prev) => ({ ...prev, watchBestSeller: !prev.watchBestSeller }))}
												sx={{ cursor: 'pointer' }}
												color={addWatchForm.watchBestSeller ? 'warning' : 'default'}
											/>
										</Stack>
									</Grid>
									<Grid item xs={12}>
										<Stack direction="row" justifyContent="flex-end">
											<Button
												variant="contained"
												onClick={handleCreateWatch}
												disabled={creatingWatch}
												sx={{ background: '#111111', color: '#FAFAFA', '&:hover': { background: '#2b2b2b' } }}
											>
												{creatingWatch ? 'Creating...' : 'Create Watch'}
											</Button>
										</Stack>
									</Grid>
								</Grid>
							</Box>
						)}

						{isSeller && activeTab === 'myWatches' && (
							<Box sx={{ minHeight: { xs: 'auto', md: 540 } }}>
								{sellerWatchesLoading ? (
									<Typography sx={{ color: '#666666' }}>Loading your watches...</Typography>
								) : sellerWatches.length === 0 ? (
									<Box
										sx={{
											border: '1px dashed rgba(212,175,55,0.55)',
											borderRadius: '14px',
											py: { xs: 4, md: 5 },
											px: 3,
											textAlign: 'center',
										}}
									>
										<Typography sx={{ color: '#111111', fontWeight: 600, mb: 0.8 }}>No watches listed yet</Typography>
										<Typography sx={{ color: '#666666', fontSize: '0.88rem' }}>
											{t('mypage.useAddWatch')}
										</Typography>
									</Box>
								) : (
									<Grid container spacing={2}>
										{sellerWatches.map((watch: any) => (
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
													<Box sx={{ height: 190, background: '#f4f4f4', position: 'relative' }}>
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
														<IconButton
															size="small"
															onClick={() => handleOpenEditWatch(watch)}
															sx={{
																position: 'absolute',
																top: 10,
																right: 10,
																background: 'rgba(255,255,255,0.92)',
																border: '1px solid rgba(0,0,0,0.12)',
																color: '#111111',
																width: 32,
																height: 32,
																'&:hover': { background: '#FFFFFF', color: '#D4AF37', borderColor: '#D4AF37' },
															}}
														>
															<EditOutlinedIcon sx={{ fontSize: 17 }} />
														</IconButton>
													</Box>
													<Box sx={{ p: 2 }}>
														<Typography sx={{ color: '#111111', fontWeight: 600, mb: 0.3 }}>
															{watch.watchTitle}
														</Typography>
														<Typography sx={{ color: '#666666', mb: 1, fontSize: '0.85rem' }}>
															{watch.watchBrand?.replace('_', ' ')} • ${Number(watch.watchPrice || 0).toLocaleString()}
														</Typography>
														<TextField
															size="small"
															select
															fullWidth
															value={watch.watchStatus}
															onChange={(e) => handleSellerStatusUpdate(watch._id, e.target.value as SellerWatchStatus)}
															disabled={updatingWatchId === watch._id}
														>
															<MenuItem value="ACTIVE">ACTIVE</MenuItem>
															<MenuItem value="SOLD">SOLD</MenuItem>
															<MenuItem value="OUT_OF_STOCK">OUT OF STOCK</MenuItem>
														</TextField>
													</Box>
												</Box>
											</Grid>
										))}
									</Grid>
								)}
							</Box>
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
												onChange={(e) => {
													setCardHolder(e.target.value);
													setPaymentSaved(false);
													if (paymentError) setPaymentError('');
												}}
												size="small"
												fullWidth
												InputLabelProps={{ sx: { color: '#666666' } }}
												sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
											/>
											<TextField
												label="Card Type"
												value={cardType}
												onChange={(e) => {
													setCardType(e.target.value);
													setPaymentSaved(false);
													if (paymentError) setPaymentError('');
												}}
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
												onChange={(e) => {
													setCardNumber(formatCardNumber(e.target.value));
													setPaymentSaved(false);
													if (paymentError) setPaymentError('');
												}}
												size="small"
												fullWidth
												InputLabelProps={{ sx: { color: '#666666' } }}
												sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
											/>
											<Stack direction="row" spacing={2}>
												<TextField
													label="CVC"
													value={cardCvc}
													onChange={(e) => {
														setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
														setPaymentSaved(false);
														if (paymentError) setPaymentError('');
													}}
													size="small"
													fullWidth
													InputLabelProps={{ sx: { color: '#666666' } }}
													sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
												/>
												<TextField
													label="Exp Date"
													value={cardExpiry}
													onChange={(e) => {
														setCardExpiry(formatExpiry(e.target.value));
														setPaymentSaved(false);
														if (paymentError) setPaymentError('');
													}}
													size="small"
													fullWidth
													InputLabelProps={{ sx: { color: '#666666' } }}
													sx={{ '& .MuiOutlinedInput-root': { color: '#111111', '& fieldset': { borderColor: 'rgba(0,0,0,0.22)' } } }}
												/>
											</Stack>
											<Stack direction="row" alignItems="center" justifyContent="space-between">
												<Box sx={{ minHeight: 22 }}>
													{paymentError ? (
														<Typography sx={{ color: '#C62828', fontSize: '0.79rem' }}>{paymentError}</Typography>
													) : paymentSaved ? (
														<Typography sx={{ color: '#2e7d32', fontSize: '0.79rem', fontWeight: 600 }}>
															Payment details saved successfully.
														</Typography>
													) : (
														<Typography sx={{ color: '#777777', fontSize: '0.77rem' }}>
															Format: Card 13-19 digits, CVC 3-4, Exp MM/YY
														</Typography>
													)}
												</Box>
												<Button
													variant="contained"
													onClick={handleSavePaymentDetails}
													sx={{
														background: '#111111',
														color: '#D4AF37',
														textTransform: 'none',
														fontWeight: 700,
														px: 2.1,
														'&:hover': { background: '#2b2b2b' },
													}}
												>
													Save Details
												</Button>
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
				<Dialog
					open={logoutDialogOpen}
					onClose={() => setLogoutDialogOpen(false)}
					PaperProps={{
						sx: {
							borderRadius: '14px',
							background: isDark ? '#101722' : '#FFFFFF',
							border: '1px solid rgba(212,175,55,0.5)',
							boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
							minWidth: { xs: 'auto', sm: 420 },
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
							{t('common.yes')}
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={editWatchOpen}
					onClose={() => !savingWatchEdit && setEditWatchOpen(false)}
					fullWidth
					maxWidth="md"
				>
					<DialogTitle sx={{ color: '#111111', fontWeight: 700 }}>Edit Watch</DialogTitle>
					<DialogContent dividers>
						<Grid container spacing={2} sx={{ mt: 0.1 }}>
							<Grid item xs={12} md={6}>
								<TextField
									label="Watch Title (EN)"
									size="small"
									fullWidth
									value={editWatchForm.watchTitle}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchTitle: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									label="Type"
									size="small"
									fullWidth
									select
									value={editWatchForm.watchType}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchType: e.target.value }))}
								>
									{['LUXURY', 'SPORT', 'CLASSIC', 'DRESS', 'SMART'].map((opt) => (
										<MenuItem key={opt} value={opt}>{opt}</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									label="Watch Title (KO)"
									size="small"
									fullWidth
									value={editWatchForm.watchTitleKo}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchTitleKo: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									label="Watch Title (UZ)"
									size="small"
									fullWidth
									value={editWatchForm.watchTitleUz}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchTitleUz: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={3}>
								<TextField
									label="Brand"
									size="small"
									fullWidth
									select
									value={editWatchForm.watchBrand}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchBrand: e.target.value }))}
								>
									{[
										'ROLEX',
										'OMEGA',
										'CARTIER',
										'TAG_HEUER',
										'PATEK_PHILIPPE',
										'AUDEMARS_PIGUET',
										'BREITLING',
										'IWC',
										'HUBLOT',
										'TISSOT',
									].map((opt) => (
										<MenuItem key={opt} value={opt}>{opt}</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									label="Price (USD)"
									size="small"
									fullWidth
									type="number"
									value={editWatchForm.watchPrice}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchPrice: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<TextField
									label="Manufactured At"
									size="small"
									fullWidth
									type="date"
									value={editWatchForm.manufacturedAt}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, manufacturedAt: e.target.value }))}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<Button
									component="label"
									variant="outlined"
									fullWidth
									sx={{
										height: 40,
										color: '#111111',
										borderColor: 'rgba(0,0,0,0.24)',
										'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
									}}
								>
									Add More Photos
									<input type="file" hidden multiple accept="image/*" onChange={handleEditWatchFileChange} />
								</Button>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Description (EN)"
									size="small"
									fullWidth
									multiline
									minRows={3}
									value={editWatchForm.watchDesc}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchDesc: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Description (KO)"
									size="small"
									fullWidth
									multiline
									minRows={2}
									value={editWatchForm.watchDescKo}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchDescKo: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									label="Description (UZ)"
									size="small"
									fullWidth
									multiline
									minRows={2}
									value={editWatchForm.watchDescUz}
									onChange={(e) => setEditWatchForm((prev) => ({ ...prev, watchDescUz: e.target.value }))}
								/>
							</Grid>
							<Grid item xs={12}>
								<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
									{editWatchForm.watchImages.map((img, idx) => (
										<Chip key={`${img}-${idx}`} label={`Existing ${idx + 1}`} size="small" />
									))}
									{editWatchFiles.map((file) => (
										<Chip key={file.name + file.size} label={`New: ${file.name}`} size="small" color="warning" />
									))}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
									<Chip
										label={`Barter: ${editWatchForm.watchBarter ? 'Yes' : 'No'}`}
										onClick={() => setEditWatchForm((prev) => ({ ...prev, watchBarter: !prev.watchBarter }))}
										sx={{ cursor: 'pointer' }}
										color={editWatchForm.watchBarter ? 'warning' : 'default'}
									/>
									<Chip
										label={`Rent: ${editWatchForm.watchRent ? 'Yes' : 'No'}`}
										onClick={() => setEditWatchForm((prev) => ({ ...prev, watchRent: !prev.watchRent }))}
										sx={{ cursor: 'pointer' }}
										color={editWatchForm.watchRent ? 'warning' : 'default'}
									/>
									<Chip
										label={`Best Seller: ${editWatchForm.watchBestSeller ? 'Yes' : 'No'}`}
										onClick={() => setEditWatchForm((prev) => ({ ...prev, watchBestSeller: !prev.watchBestSeller }))}
										sx={{ cursor: 'pointer' }}
										color={editWatchForm.watchBestSeller ? 'warning' : 'default'}
									/>
								</Stack>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setEditWatchOpen(false)} disabled={savingWatchEdit} sx={{ color: '#666' }}>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleSaveWatchEdit}
							disabled={savingWatchEdit}
							sx={{ background: '#111111', color: '#FAFAFA', '&:hover': { background: '#2b2b2b' } }}
						>
							{savingWatchEdit ? 'Saving...' : 'Save Changes'}
						</Button>
					</DialogActions>
				</Dialog>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default MyPage;
