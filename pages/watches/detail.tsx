import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Box, Button, Grid, Chip, CircularProgress, Paper, Divider } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { useRouter } from 'next/router';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_WATCH, GET_WATCH_AI_INSIGHTS } from '../../apollo/user/query';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import { REACT_APP_API_URL } from '../../libs/config';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

const WatchDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [selectedImage, setSelectedImage] = useState(0);
	const [initialImageSet, setInitialImageSet] = useState(false);

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

	const [getAIInsights, { data: aiData, loading: aiLoading }] = useLazyQuery(GET_WATCH_AI_INSIGHTS, {
		fetchPolicy: 'network-only',
	});

	const watch = data?.getWatch;
	const ai = aiData?.getWatchAIInsights;

	if (loading || !watch) {
		return (
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh' }}>
				<Top />
				<Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', pt: 20 }}>
					<CircularProgress sx={{ color: '#111111' }} />
				</Stack>
			</Stack>
		);
	}

	return (
		<>
			<Head><title>{watch.watchTitle} - Watches</title></Head>
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh' }}>
				<Top />
				<Container maxWidth="lg" sx={{ pt: 13, pb: 6 }}>
					<Link href="/watches" passHref>
						<Button startIcon={<ArrowBackIcon />} sx={{ color: '#777', mb: 3, '&:hover': { color: '#111111' } }}>
							Back to Collection
						</Button>
					</Link>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{
								height: 420,
								background: 'rgba(255,255,255,0.7)',
								borderRadius: '16px',
								border: '1px solid #D4AF37',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
								mb: 2,
							}}>
								{watch.watchImages?.[selectedImage] ? (
									<img
										src={`${REACT_APP_API_URL}/${watch.watchImages[selectedImage]}`}
										alt={watch.watchTitle}
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								) : (
									<Typography sx={{ fontSize: 100 }}>⌚</Typography>
								)}
							</Box>
							{watch.watchImages?.length > 1 && (
								<Stack direction="row" spacing={1}>
									{watch.watchImages.map((_: string, i: number) => (
										<Box key={i} onClick={() => setSelectedImage(i)} sx={{
											width: 64, height: 64,
											background: 'rgba(255,255,255,0.7)',
											border: selectedImage === i ? '2px solid #111111' : '1px solid #D4AF37',
											borderRadius: '10px',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											overflow: 'hidden',
										}}>
											<img src={`${REACT_APP_API_URL}/${watch.watchImages[i]}`} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }} />
										</Box>
									))}
								</Stack>
							)}
						</Grid>

						<Grid item xs={12} md={6}>
							<Chip label={watch.watchBrand} sx={{ background: 'rgba(17,17,17,0.08)', color: '#111111', fontWeight: 600, mb: 2 }} />
							<Typography variant="h3" sx={{ color: '#111111', fontWeight: 700, mb: 1 }}>
								{watch.watchTitle}
							</Typography>
							<Typography variant="h4" sx={{ color: '#111111', fontWeight: 700, mb: 3 }}>
								${watch.watchPrice?.toLocaleString()}
							</Typography>

							<Stack direction="row" spacing={3} sx={{ mb: 3 }}>
								<Chip label={watch.watchType} variant="outlined" sx={{ color: '#777', borderColor: '#D4AF37' }} />
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#888' }}>
									<VisibilityIcon sx={{ fontSize: 18 }} /><span>{watch.watchViews} views</span>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#888' }}>
									<FavoriteIcon sx={{ fontSize: 18, color: '#111111' }} /><span>{watch.watchLikes} likes</span>
								</Stack>
							</Stack>

							{watch.watchDesc && (
								<Typography sx={{ color: '#666', mb: 3, lineHeight: 1.8 }}>
									{watch.watchDesc}
								</Typography>
							)}

							<Button
								variant="contained"
								startIcon={aiLoading ? <CircularProgress size={20} sx={{ color: '#FAFAFA' }} /> : <AutoAwesomeIcon />}
								disabled={aiLoading}
								onClick={() => getAIInsights({ variables: { watchId: id } })}
								sx={{
									background: 'linear-gradient(135deg, #111111, #2B2B2B)',
									color: '#FAFAFA',
									fontWeight: 700,
									px: 4, py: 1.5,
									fontSize: '1rem',
									borderRadius: '12px',
									'&:hover': { background: 'linear-gradient(135deg, #2B2B2B, #111111)' },
									'&.Mui-disabled': { background: '#D4AF37', color: '#111111' },
								}}
							>
								{aiLoading ? 'Getting AI Insights...' : 'AI Help — Learn About This Watch'}
							</Button>
						</Grid>
					</Grid>

					{ai && (
						<Paper sx={{ background: 'rgba(255,255,255,0.7)', borderRadius: '16px', border: '1px solid #D4AF37', p: 4, mt: 4, boxShadow: '0 4px 20px rgba(27,27,27,0.04)' }}>
							<Typography variant="h5" sx={{ color: '#111111', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<AutoAwesomeIcon /> AI Insights
							</Typography>
							<Typography sx={{ color: '#666', mb: 3 }}>{ai.summary}</Typography>
							<Divider sx={{ borderColor: '#D4AF37', mb: 3 }} />

							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>📊 Sales Info</Typography>
									<Typography sx={{ color: '#666', mb: 3 }}>{ai.salesInfo}</Typography>

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>💰 Price Range</Typography>
									<Typography sx={{ color: '#666', mb: 3 }}>{ai.priceRange}</Typography>

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>🌟 Celebrity Wearers</Typography>
									{ai.celebrityWearers?.map((c: any, i: number) => (
										<Box key={i} sx={{ mb: 1 }}>
											<Typography sx={{ color: '#111111', fontWeight: 500 }}>{c.name}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{c.description}</Typography>
										</Box>
									))}
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1 }}>👔 Fashion Tips</Typography>
									{ai.fashionTips?.map((f: any, i: number) => (
										<Box key={i} sx={{ mb: 1.5, p: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: '1px solid #D4AF37' }}>
											<Typography sx={{ color: '#111111', fontWeight: 500 }}>{f.outfit}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Best for: {f.occasion}</Typography>
										</Box>
									))}

									<Typography sx={{ color: '#111111', fontWeight: 600, mb: 1, mt: 2 }}>💡 Fun Facts</Typography>
									{ai.funFacts?.map((fact: string, i: number) => (
										<Typography key={i} sx={{ color: '#666', mb: 0.5, pl: 1, borderLeft: '2px solid #111111' }}>
											{fact}
										</Typography>
									))}
								</Grid>
							</Grid>
						</Paper>
					)}
				</Container>
				<Footer />
			</Stack>
		</>
	);
};

export default WatchDetail;
