import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Box, Button, Grid, Chip, CircularProgress, Paper, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_WATCH, GET_WATCH_AI_INSIGHTS, GET_WATCHES } from '../../apollo/user/query';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { CREATE_ORDER } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { getPaymentDetails, isPaymentDetailsComplete } from '../../libs/payment';
import { useLanguage } from '../../libs/i18n/LanguageContext';
import { localizeWatchText } from '../../libs/i18n/watchText';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';

type ManualWatchSpec = {
	fullName: string;
	diameter: string;
	powerReserve: string;
	caseMaterial: string;
	movement: string;
	crystal: string;
	bracelet: string;
	highlights: string[];
};

const MANUAL_WATCH_SPECS: Record<string, ManualWatchSpec> = {
	'rolex cosmograph daytona': {
		fullName: 'Rolex Cosmograph Daytona',
		diameter: '40 mm',
		powerReserve: 'Up to 72 hours power reserve',
		caseMaterial: 'Oystersteel and yellow gold case',
		movement: 'Swiss automatic chronograph movement',
		crystal: 'Scratch-resistant sapphire crystal',
		bracelet: 'Oyster bracelet with folding Oysterlock clasp',
		highlights: [
			'Iconic racing chronograph with high legibility dial',
			'Screw-down pushers for improved water resistance',
			'Precision timekeeping and durable daily-wear design',
			'Premium gold-tone accents for elevated luxury appeal',
		],
	},
	'hublot king gold': {
		fullName: 'Hublot King Gold',
		diameter: '44 mm',
		powerReserve: 'Up to 42 hours power reserve',
		caseMaterial: '18K King Gold case with satin and polished finish',
		movement: 'Swiss automatic skeleton chronograph movement',
		crystal: 'Anti-reflective sapphire crystal',
		bracelet: 'Black rubber strap with deployant clasp',
		highlights: [
			'Bold sporty-luxury identity with skeletonized dial',
			'Fusion of precious metal case and technical materials',
			'High-impact wrist presence with modern architecture',
			'Performance-focused chronograph functionality',
		],
	},
	'tissot ballade 39mm': {
		fullName: 'Tissot Ballade 39mm',
		diameter: '39 mm',
		powerReserve: 'Up to 80 hours power reserve',
		caseMaterial: '316L stainless steel case with yellow gold PVD coating',
		movement: 'Swiss automatic movement',
		crystal: 'Scratch-resistant sapphire crystal with double-sided antireflective coating',
		bracelet: 'Interchangeable quick release bracelet',
		highlights: [
			'See-through caseback for movement visibility',
			'Long power reserve for extended daily reliability',
			'Balanced dress-sport profile for versatile styling',
			'Swiss craftsmanship with premium finishing',
		],
	},
	'rolex submariner date': {
		fullName: 'Rolex Submariner Date',
		diameter: '41 mm',
		powerReserve: 'Up to 70 hours power reserve',
		caseMaterial: 'Oystersteel case with unidirectional ceramic bezel',
		movement: 'Swiss automatic movement (Chronometer certified)',
		crystal: 'Scratch-resistant sapphire crystal with Cyclops lens',
		bracelet: 'Oyster bracelet with Glidelock extension system',
		highlights: [
			'Legendary dive-watch design with exceptional robustness',
			'Unidirectional timing bezel engineered for underwater use',
			'Highly legible dial with luminous hour markers',
			'Versatile icon that works from sport to formal casual looks',
		],
	},
	'cartier tank must': {
		fullName: 'Cartier Tank Must',
		diameter: '33.7 x 25.5 mm',
		powerReserve: 'Quartz caliber / long battery life',
		caseMaterial: 'Stainless steel case with polished finish',
		movement: 'Swiss quartz movement',
		crystal: 'Scratch-resistant mineral/sapphire crystal (model dependent)',
		bracelet: 'Interchangeable leather strap or steel bracelet',
		highlights: [
			'Historic rectangular case inspired by the original Tank design',
			'Elegant slim profile ideal for dress styling',
			'Roman numeral dial and sword-shaped hands',
			'Parisian luxury aesthetic with timeless versatility',
		],
	},
	'omega seamaster diver 300m': {
		fullName: 'Omega Seamaster Diver 300M',
		diameter: '42 mm',
		powerReserve: 'Up to 55 hours power reserve',
		caseMaterial: 'Stainless steel case with ceramic bezel insert',
		movement: 'Swiss automatic Co-Axial Master Chronometer movement',
		crystal: 'Domed scratch-resistant sapphire crystal',
		bracelet: 'Steel bracelet with diver extension',
		highlights: [
			'Professional dive specifications with 300m water resistance',
			'Wave-pattern dial and laser-engraved ceramic details',
			'Antimagnetic Master Chronometer performance',
			'Strong sport-luxury identity with daily wear comfort',
		],
	},
	'patek philippe nautilus': {
		fullName: 'Patek Philippe Nautilus',
		diameter: '40 mm (varies by reference)',
		powerReserve: 'Up to 45 hours power reserve',
		caseMaterial: 'Stainless steel case with horizontally embossed dial',
		movement: 'Swiss automatic in-house movement',
		crystal: 'Sapphire crystal front and exhibition caseback',
		bracelet: 'Integrated steel bracelet with fold-over clasp',
		highlights: [
			'One of the most collectible modern luxury sports watches',
			'Distinctive porthole-inspired bezel architecture',
			'Excellent finishing and balanced case proportions',
			'Strong market demand and prestige-driven desirability',
		],
	},
	'iwc portugieser chronograph': {
		fullName: 'IWC Portugieser Chronograph',
		diameter: '41 mm',
		powerReserve: 'Up to 46 hours power reserve',
		caseMaterial: 'Stainless steel or 18K gold case (reference dependent)',
		movement: 'Swiss automatic chronograph movement',
		crystal: 'Convex sapphire crystal with antireflective coating',
		bracelet: 'Alligator leather strap or steel bracelet',
		highlights: [
			'Clean dial layout with elegant chronograph symmetry',
			'Refined dress chronograph character',
			'Excellent wearability with thin bezel architecture',
			'Signature Portuguese design language and heritage',
		],
	},
	'tag heuer carrera chronograph': {
		fullName: 'TAG Heuer Carrera Chronograph',
		diameter: '42 mm',
		powerReserve: 'Up to 80 hours power reserve',
		caseMaterial: 'Stainless steel case with polished/satin finishing',
		movement: 'Swiss automatic chronograph movement',
		crystal: 'Sapphire crystal with antireflective treatment',
		bracelet: 'Steel bracelet or perforated leather/rubber strap',
		highlights: [
			'Motorsport-inspired chronograph heritage',
			'Legible, performance-first dial architecture',
			'Contemporary sporty profile with premium finishing',
			'Great entry point into Swiss luxury chronographs',
		],
	},
};

const normalizeTitle = (title?: string) => (title || '').trim().toLowerCase();

const WatchDetail = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t, locale } = useLanguage();
	const { isDark } = useThemeMode();
	const { id } = router.query;
	const [selectedImage, setSelectedImage] = useState(0);
	const [initialImageSet, setInitialImageSet] = useState(false);
	const [buyDialogOpen, setBuyDialogOpen] = useState(false);
	const [paymentRequiredDialogOpen, setPaymentRequiredDialogOpen] = useState(false);
	const [shippingAddress, setShippingAddress] = useState('');
	const [purchaseError, setPurchaseError] = useState('');

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	const { data, loading } = useQuery(GET_WATCH, {
		variables: { input: id },
		skip: !id,
		fetchPolicy: 'network-only',
		onCompleted: (result) => {
			if (!initialImageSet && result?.getWatch?.watchImages?.length > 1) {
				setSelectedImage(1);
				setInitialImageSet(true);
			}
		},
	});

	const { data: relatedData } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: 1,
				limit: 12,
				search: {
					...(data?.getWatch?.watchType ? { typeList: [data.getWatch.watchType] } : {}),
				},
			},
		},
		skip: !data?.getWatch?.watchType,
		fetchPolicy: 'network-only',
	});

	const { data: fallbackData } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: 1,
				limit: 12,
				sort: 'createdAt',
				search: {},
			},
		},
		skip: !data?.getWatch?._id,
		fetchPolicy: 'network-only',
	});

	const [getAIInsights, { data: aiData, loading: aiLoading }] = useLazyQuery(GET_WATCH_AI_INSIGHTS, {
		fetchPolicy: 'network-only',
	});
	const [createOrderMutation, { loading: orderLoading }] = useMutation(CREATE_ORDER);

	const watch = data?.getWatch;
	const localizedWatchTitle = watch?.watchTitle;
	const localizedWatchDesc = localizeWatchText(watch?.watchDesc, watch?.watchDescI18n, locale);
	const ai = aiData?.getWatchAIInsights;
	const galleryImages = Array.from({ length: 3 }, (_, i) => watch?.watchImages?.[i] || watch?.watchImages?.[0] || null);
	const relatedCandidates = relatedData?.getWatches?.list || [];
	const fallbackCandidates = fallbackData?.getWatches?.list || [];
	const relatedWatches = [...relatedCandidates, ...fallbackCandidates]
		.filter((item: any) => item?._id && item._id !== watch?._id)
		// Avoid repetitive "same-looking" recommendations by deduping by title first.
		.filter(
			(item: any, index: number, arr: any[]) =>
				arr.findIndex((x: any) => (x.watchTitle || '').trim().toLowerCase() === (item.watchTitle || '').trim().toLowerCase()) === index,
		)
		.slice(0, 4);
	const selectedSpec = MANUAL_WATCH_SPECS[normalizeTitle(watch?.watchTitle)] || {
		fullName: localizedWatchTitle || watch?.watchTitle || 'Luxury Watch',
		diameter: '39-42 mm',
		powerReserve: 'Up to 40-80 hours power reserve',
		caseMaterial: 'Premium stainless steel case',
		movement: 'Swiss automatic movement',
		crystal: 'Scratch-resistant sapphire crystal',
		bracelet: 'Interchangeable bracelet/strap system',
		highlights: [
			'Balanced proportions for comfortable daily wear',
			'Premium materials with refined finishing',
			'Excellent readability in different light conditions',
			'Designed for both formal and casual styling',
		],
	};

	const handleBuyNow = async () => {
		const jwt = getJwtToken();
		if (!jwt) {
			router.push('/account/join');
			return;
		}

		const paymentDetails = getPaymentDetails(user?._id);
		if (!isPaymentDetailsComplete(paymentDetails)) {
			setPaymentRequiredDialogOpen(true);
			return;
		}

		setPurchaseError('');
		setBuyDialogOpen(true);
	};

	const handleConfirmPurchase = async () => {
		setPurchaseError('');

		try {
			await createOrderMutation({
				variables: {
					input: {
						watchId: String(watch._id),
						paymentMethod: 'CARD',
						shippingAddress: shippingAddress.trim(),
					},
				},
			});
			setBuyDialogOpen(false);
			setShippingAddress('');
			router.push('/mypage');
		} catch (err: any) {
			const message = err?.message?.replace('GraphQL error: ', '') || t('watchDetail.purchaseFailed');
			setPurchaseError(message);
		}
	};

	if (loading || !watch) {
		return (
			<Stack sx={{ background: isDark ? '#0b0f16' : '#FAFAFA', minHeight: '100vh' }}>
				<Top />
				<Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', pt: 20 }}>
					<CircularProgress sx={{ color: '#111111' }} />
				</Stack>
			</Stack>
		);
	}

	return (
		<>
			<Head><title>{localizedWatchTitle || watch.watchTitle} - Watches</title></Head>
			<Stack sx={{ background: isDark ? '#0b0f16' : '#FAFAFA', minHeight: '100vh' }}>
				<Top />
				<Container maxWidth="lg" sx={{ pt: 13, pb: 6 }}>
					<Link href="/watches" passHref>
						<Button startIcon={<ArrowBackIcon />} sx={{ color: '#777', mb: 3, '&:hover': { color: '#111111' } }}>
							{t('watchDetail.back')}
						</Button>
					</Link>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={1.3}
								sx={{ minHeight: { xs: 460, md: 420 } }}
							>
								{galleryImages.map((image, i) => {
									const active = selectedImage === i;
									return (
										<Box
											key={i}
											onClick={() => setSelectedImage(i)}
											sx={{
												flex: { xs: 'unset', md: active ? 1.8 : 1 },
												height: { xs: active ? 240 : 110, md: 420 },
												background: 'rgba(255,255,255,0.72)',
												borderRadius: '16px',
												border: active ? '2px solid #111111' : '1px solid #D4AF37',
												cursor: 'pointer',
												overflow: 'hidden',
												position: 'relative',
												transition: 'all 0.35s ease',
												transform: active ? 'scale(1)' : 'scale(0.96)',
												opacity: active ? 1 : 0.78,
												boxShadow: active
													? '0 12px 28px rgba(17,17,17,0.18)'
													: '0 4px 12px rgba(17,17,17,0.08)',
												'&:hover': {
													opacity: 1,
													transform: active ? 'scale(1)' : 'scale(0.98)',
												},
											}}
										>
											{image ? (
												<img
													src={`${REACT_APP_API_URL}/${image}`}
													alt={`${watch.watchTitle} ${i + 1}`}
													style={{ width: '100%', height: '100%', objectFit: 'cover' }}
												/>
											) : (
												<Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
													<Typography sx={{ fontSize: 60 }}>⌚</Typography>
												</Stack>
											)}
										</Box>
									);
								})}
							</Stack>
						</Grid>

						<Grid item xs={12} md={6}>
							<Chip label={watch.watchBrand} sx={{ background: 'rgba(17,17,17,0.08)', color: '#111111', fontWeight: 600, mb: 2 }} />
							<Typography variant="h3" sx={{ color: '#111111', fontWeight: 700, mb: 1 }}>
								{localizedWatchTitle || watch.watchTitle}
							</Typography>
							<Typography variant="h4" sx={{ color: '#111111', fontWeight: 700, mb: 3 }}>
								${watch.watchPrice?.toLocaleString()}
							</Typography>

							<Stack direction="row" spacing={3} sx={{ mb: 3 }}>
								<Chip label={watch.watchType} variant="outlined" sx={{ color: '#777', borderColor: '#D4AF37' }} />
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#888' }}>
									<VisibilityIcon sx={{ fontSize: 18 }} /><span>{watch.watchViews} {t('watchDetail.views')}</span>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#888' }}>
									<FavoriteIcon sx={{ fontSize: 18, color: '#111111' }} /><span>{watch.watchLikes} {t('watchDetail.likes')}</span>
								</Stack>
							</Stack>

							{watch.watchDesc && (
								<Typography sx={{ color: '#666', mb: 3, lineHeight: 1.8 }}>
									{localizedWatchDesc || watch.watchDesc}
								</Typography>
							)}

							<Stack direction="row" spacing={1.2} alignItems="stretch" flexWrap="wrap">
								<Button
									variant="contained"
									startIcon={aiLoading ? <CircularProgress size={20} sx={{ color: '#FAFAFA' }} /> : <AutoAwesomeIcon />}
									disabled={aiLoading}
									onClick={() => getAIInsights({ variables: { watchId: id } })}
									sx={{
										background: 'linear-gradient(135deg, #111111, #2B2B2B)',
										color: '#FAFAFA',
										fontWeight: 700,
										px: 4,
										fontSize: '1rem',
										borderRadius: '12px',
										minHeight: 52,
										'&:hover': { background: 'linear-gradient(135deg, #2B2B2B, #111111)' },
										'&.Mui-disabled': { background: '#D4AF37', color: '#111111' },
									}}
								>
									{aiLoading ? t('watchDetail.aiLoading') : t('watchDetail.aiButton')}
								</Button>
								<Button
									variant="outlined"
									disabled={orderLoading}
									onClick={handleBuyNow}
									sx={{
										borderColor: '#111111',
										color: '#111111',
										fontWeight: 700,
										px: 4,
										fontSize: '0.96rem',
										borderRadius: '12px',
										minHeight: 52,
										'&:hover': { borderColor: '#D4AF37', color: '#D4AF37', background: 'rgba(212,175,55,0.08)' },
									}}
								>
									{orderLoading ? t('watchDetail.processingOrder') : t('watchDetail.buyNow')}
								</Button>
							</Stack>
						</Grid>
					</Grid>

					{ai && (
						<Paper sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: '16px', border: '1px solid #D4AF37', p: 4, mt: 4, boxShadow: '0 4px 20px rgba(27,27,27,0.04)' }}>
							<Typography variant="h5" sx={{ color: '#111111', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<AutoAwesomeIcon /> {t('watchDetail.aiInsights')}
							</Typography>
							<Typography sx={{ color: '#666', mb: 3 }}>{ai.summary}</Typography>
							<Divider sx={{ borderColor: '#D4AF37', mb: 3 }} />

							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>📊 {t('watchDetail.salesInfo')}</Typography>
									<Typography sx={{ color: '#666', mb: 3 }}>{ai.salesInfo}</Typography>

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>💰 {t('watchDetail.priceRange')}</Typography>
									<Typography sx={{ color: '#666', mb: 3 }}>{ai.priceRange}</Typography>

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>🌟 {t('watchDetail.celebrityWearers')}</Typography>
									{ai.celebrityWearers?.map((c: any, i: number) => (
										<Box key={i} sx={{ mb: 1 }}>
											<Typography sx={{ color: '#111111', fontWeight: 500 }}>{c.name}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{c.description}</Typography>
										</Box>
									))}
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>👔 {t('watchDetail.fashionTips')}</Typography>
									{ai.fashionTips?.map((f: any, i: number) => (
										<Box key={i} sx={{ mb: 1.5, p: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: '1px solid #D4AF37' }}>
											<Typography sx={{ color: '#111111', fontWeight: 500 }}>{f.outfit}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{t('watchDetail.bestFor')}: {f.occasion}</Typography>
										</Box>
									))}

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1, mt: 2 }}>💡 {t('watchDetail.funFacts')}</Typography>
									{ai.funFacts?.map((fact: string, i: number) => (
										<Typography key={i} sx={{ color: '#666', mb: 0.5, pl: 1, borderLeft: '2px solid #111111' }}>
											{fact}
										</Typography>
									))}
								</Grid>
							</Grid>
						</Paper>
					)}

					<Paper sx={{ background: 'rgba(255,255,255,0.72)', borderRadius: '16px', border: '1px solid #D4AF37', p: { xs: 2.5, md: 3.5 }, mt: 4, boxShadow: '0 4px 20px rgba(27,27,27,0.04)' }}>
						<Typography variant="h5" sx={{ color: '#111111', mb: 2.2, fontWeight: 700 }}>
							{t('watchDetail.specs')}
						</Typography>
						<Grid container spacing={2.5}>
							<Grid item xs={12} md={6}>
								<Stack spacing={1.1}>
									<Typography sx={{ color: '#666', fontSize: '0.85rem' }}>{t('watchDetail.fullName')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.fullName}</Typography>
									<Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2 }}>{t('watchDetail.diameter')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.diameter}</Typography>
									<Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2 }}>{t('watchDetail.powerReserve')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.powerReserve}</Typography>
								</Stack>
							</Grid>
							<Grid item xs={12} md={6}>
								<Stack spacing={1.1}>
									<Typography sx={{ color: '#666', fontSize: '0.85rem' }}>{t('watchDetail.caseMaterial')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.caseMaterial}</Typography>
									<Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2 }}>{t('watchDetail.movement')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.movement}</Typography>
									<Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2 }}>{t('watchDetail.crystal')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.crystal}</Typography>
									<Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2 }}>{t('watchDetail.bracelet')}</Typography>
									<Typography sx={{ color: '#111111', fontWeight: 600 }}>{selectedSpec.bracelet}</Typography>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Divider sx={{ borderColor: 'rgba(212,175,55,0.5)', my: 0.5 }} />
								<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>{t('watchDetail.highlights')}</Typography>
								<Stack spacing={0.8}>
									{selectedSpec.highlights.map((item, idx) => (
										<Typography key={idx} sx={{ color: '#666', pl: 1.2, borderLeft: '2px solid #D4AF37' }}>
											{item}
										</Typography>
									))}
								</Stack>
							</Grid>
						</Grid>
					</Paper>

					{relatedWatches.length > 0 && (
						<Paper sx={{ background: 'transparent', borderRadius: '0', border: 'none', p: 0, mt: 4, boxShadow: 'none' }}>
							<Typography sx={{ color: '#111111', mb: 2.4, fontWeight: 500, fontSize: { xs: '1.3rem', md: '2rem' }, textAlign: 'center' }}>
								{t('watchDetail.youMayAlsoLike')}
							</Typography>
							<Grid container spacing={2}>
								{relatedWatches.map((item: any) => (
									<Grid item xs={12} sm={6} md={3} key={item._id}>
										<Link href={`/watches/detail?id=${item._id}`} style={{ textDecoration: 'none' }}>
											<Box
												sx={{
													borderRadius: '0',
													overflow: 'hidden',
													border: '1px solid rgba(0,0,0,0.06)',
													background: '#FFFFFF',
													cursor: 'pointer',
													transition: 'all 0.2s ease',
													'&:hover': {
														transform: 'translateY(-2px)',
														boxShadow: '0 6px 18px rgba(17,17,17,0.1)',
													},
												}}
											>
												<Box sx={{ height: 255, background: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
													{item.watchImages?.[0] ? (
														<img
															src={`${REACT_APP_API_URL}/${item.watchImages[0]}`}
															alt={item.watchTitle}
															style={{ width: '100%', height: '100%', objectFit: 'contain' }}
														/>
													) : (
														<Typography sx={{ fontSize: 42 }}>⌚</Typography>
													)}
													<IconButton
														size="small"
														sx={{
															position: 'absolute',
															top: 8,
															right: 8,
															color: '#888',
															background: 'rgba(255,255,255,0.8)',
															width: 26,
															height: 26,
															'&:hover': { color: '#E53935', background: '#fff' },
														}}
													>
														<FavoriteBorderIcon sx={{ fontSize: 16 }} />
													</IconButton>
												</Box>
												<Box sx={{ p: 1.35 }}>
													<Typography sx={{ color: '#111111', fontSize: '0.78rem', letterSpacing: '0.7px', textTransform: 'uppercase', mb: 0.6, fontWeight: 600 }}>
														{item.watchTitle}
													</Typography>
													<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '0.95rem', mb: 1.2 }}>
														${item.watchPrice?.toLocaleString()}
													</Typography>
													<Typography sx={{ color: '#555', fontSize: '0.72rem' }}>
														{(item.watchType || 'Watch').charAt(0).toUpperCase() + (item.watchType || 'watch').slice(1).toLowerCase()}
														{'  '}
														• {'  '}
														+{Math.max(3, relatedWatches.length + 15)} {t('watchDetail.models')}
													</Typography>
												</Box>
											</Box>
										</Link>
									</Grid>
								))}
							</Grid>
						</Paper>
					)}

				</Container>
				<Dialog
					open={paymentRequiredDialogOpen}
					onClose={() => setPaymentRequiredDialogOpen(false)}
					PaperProps={{
						sx: {
							borderRadius: '16px',
							background: '#FFFFFF',
							border: '1px solid rgba(212,175,55,0.58)',
							boxShadow: '0 24px 54px rgba(0,0,0,0.3)',
							minWidth: { xs: 'auto', sm: 440 },
						},
					}}
				>
					<DialogTitle sx={{ color: '#111111', fontWeight: 700, pb: 0.7 }}>
						{t('watchDetail.paymentRequiredTitle')}
					</DialogTitle>
					<DialogContent sx={{ pt: '8px !important' }}>
						<Box
							sx={{
								border: '1px solid rgba(212,175,55,0.35)',
								borderRadius: '12px',
								p: 1.6,
								background: 'linear-gradient(180deg, rgba(250,250,250,0.98) 0%, rgba(246,246,246,0.94) 100%)',
							}}
						>
							<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '0.95rem', mb: 0.8 }}>
								{t('watchDetail.paymentRequiredHeading')}
							</Typography>
							<Typography sx={{ color: '#666666', fontSize: '0.9rem', lineHeight: 1.55 }}>
								{t('watchDetail.paymentRequiredMessage')}{' '}
								<Box component="span" sx={{ color: '#111111', fontWeight: 600 }}>
									{t('watchDetail.paymentRequiredPath')}
								</Box>{' '}
								{t('watchDetail.paymentRequiredSuffix')}
							</Typography>
						</Box>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2.1 }}>
						<Button
							onClick={() => setPaymentRequiredDialogOpen(false)}
							variant="outlined"
							sx={{
								color: '#111111',
								borderColor: 'rgba(0,0,0,0.24)',
								textTransform: 'none',
								'&:hover': { borderColor: '#D4AF37', color: '#D4AF37', background: 'rgba(212,175,55,0.07)' },
							}}
						>
							{t('watchDetail.notNow')}
						</Button>
						<Button
							onClick={() => {
								setPaymentRequiredDialogOpen(false);
								router.push('/mypage?tab=payment');
							}}
							variant="contained"
							sx={{
								background: '#111111',
								color: '#D4AF37',
								textTransform: 'none',
								fontWeight: 700,
								'&:hover': { background: '#292929' },
							}}
						>
							{t('watchDetail.goToPayment')}
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={buyDialogOpen}
					onClose={() => !orderLoading && setBuyDialogOpen(false)}
					PaperProps={{
						sx: {
							borderRadius: '14px',
							background: '#FFFFFF',
							border: '1px solid rgba(212,175,55,0.52)',
							boxShadow: '0 20px 44px rgba(0,0,0,0.28)',
							minWidth: { xs: 'auto', sm: 440 },
						},
					}}
				>
					<DialogTitle sx={{ color: '#111111', fontWeight: 700, pb: 1 }}>{t('watchDetail.confirmPurchaseTitle')}</DialogTitle>
					<DialogContent sx={{ pt: '8px !important' }}>
						<Typography sx={{ color: '#666', mb: 1.2 }}>
							{t('watchDetail.purchasing')} <b>{localizedWatchTitle || watch.watchTitle}</b>
						</Typography>
						<Typography sx={{ color: '#111111', fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
							${watch.watchPrice?.toLocaleString()}
						</Typography>
						<TextField
							label={t('watchDetail.shippingAddress')}
							fullWidth
							size="small"
							value={shippingAddress}
							onChange={(e) => setShippingAddress(e.target.value)}
							InputLabelProps={{ sx: { color: '#666' } }}
							sx={{
								'& .MuiOutlinedInput-root': {
									color: '#111111',
									'& fieldset': { borderColor: 'rgba(0,0,0,0.22)' },
									'&:hover fieldset': { borderColor: '#D4AF37' },
									'&.Mui-focused fieldset': { borderColor: '#111111' },
								},
							}}
						/>
						{purchaseError && (
							<Typography sx={{ color: '#C62828', mt: 1.3, fontSize: '0.88rem' }}>
								{purchaseError}
							</Typography>
						)}
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2.1 }}>
						<Button
							onClick={() => setBuyDialogOpen(false)}
							disabled={orderLoading}
							variant="outlined"
							sx={{ color: '#111111', borderColor: 'rgba(0,0,0,0.25)', textTransform: 'none' }}
						>
							{t('common.cancel')}
						</Button>
						<Button
							onClick={handleConfirmPurchase}
							disabled={orderLoading}
							variant="contained"
							sx={{ background: '#111111', color: '#D4AF37', textTransform: 'none', fontWeight: 700, '&:hover': { background: '#282828' } }}
						>
							{orderLoading ? t('common.processing') : t('watchDetail.confirmPurchase')}
						</Button>
					</DialogActions>
				</Dialog>
				<Footer />
			</Stack>
		</>
	);
};

export default WatchDetail;
