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

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	const { data, loading } = useQuery(GET_WATCH, {
		variables: { input: id },
		skip: !id,
		fetchPolicy: 'network-only',
	});

	const [getAIInsights, { data: aiData, loading: aiLoading }] = useLazyQuery(GET_WATCH_AI_INSIGHTS, {
		fetchPolicy: 'network-only',
	});

	const watch = data?.getWatch;
	const ai = aiData?.getWatchAIInsights;

	if (loading || !watch) {
		return (
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<CircularProgress sx={{ color: '#c9a96e' }} />
				</Stack>
			</Stack>
		);
	}

	return (
		<>
			<Head><title>{watch.watchTitle} - Watches</title></Head>
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Container maxWidth="lg" sx={{ pt: 15, pb: 6 }}>
					<Link href="/watches" passHref>
						<Button startIcon={<ArrowBackIcon />} sx={{ color: '#c9a96e', mb: 3 }}>
							Back to Collection
						</Button>
					</Link>

					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{
								height: 400,
								background: '#1a1a2e',
								borderRadius: '16px',
								border: '1px solid rgba(201,169,110,0.2)',
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
										style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
									/>
								) : (
									<Typography sx={{ fontSize: 100 }}>⌚</Typography>
								)}
							</Box>
							{watch.watchImages?.length > 1 && (
								<Stack direction="row" spacing={1}>
									{watch.watchImages.map((_: string, i: number) => (
										<Box key={i} onClick={() => setSelectedImage(i)} sx={{
											width: 60, height: 60,
											background: selectedImage === i ? 'rgba(201,169,110,0.2)' : '#1a1a2e',
											border: selectedImage === i ? '2px solid #c9a96e' : '1px solid rgba(201,169,110,0.1)',
											borderRadius: '8px',
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
							<Chip label={watch.watchBrand} sx={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e', mb: 2 }} />
							<Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
								{watch.watchTitle}
							</Typography>
							<Typography variant="h4" sx={{ color: '#c9a96e', fontWeight: 700, mb: 3 }}>
								${watch.watchPrice?.toLocaleString()}
							</Typography>

							<Stack direction="row" spacing={3} sx={{ mb: 3 }}>
								<Chip label={watch.watchType} variant="outlined" sx={{ color: '#b0b0b0', borderColor: '#444' }} />
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#b0b0b0' }}>
									<VisibilityIcon sx={{ fontSize: 18 }} /><span>{watch.watchViews} views</span>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#b0b0b0' }}>
									<FavoriteIcon sx={{ fontSize: 18 }} /><span>{watch.watchLikes} likes</span>
								</Stack>
							</Stack>

							{watch.watchDesc && (
								<Typography sx={{ color: '#b0b0b0', mb: 3, lineHeight: 1.8 }}>
									{watch.watchDesc}
								</Typography>
							)}

							<Button
								variant="contained"
								startIcon={aiLoading ? <CircularProgress size={20} sx={{ color: '#0f0f1a' }} /> : <AutoAwesomeIcon />}
								disabled={aiLoading}
								onClick={() => getAIInsights({ variables: { watchId: id } })}
								sx={{
									background: 'linear-gradient(135deg, #c9a96e, #b8944f)',
									color: '#0f0f1a',
									fontWeight: 700,
									px: 4, py: 1.5,
									fontSize: '1rem',
									borderRadius: '12px',
									'&:hover': { background: 'linear-gradient(135deg, #d4b87a, #c9a96e)' },
									'&.Mui-disabled': { background: '#444', color: '#888' },
								}}
							>
								{aiLoading ? 'Getting AI Insights...' : '✨ AI Help — Learn About This Watch'}
							</Button>
						</Grid>
					</Grid>

					{ai && (
						<Paper sx={{ background: '#1a1a2e', borderRadius: '16px', border: '1px solid rgba(201,169,110,0.2)', p: 4, mt: 4 }}>
							<Typography variant="h5" sx={{ color: '#c9a96e', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
								<AutoAwesomeIcon /> AI Insights
							</Typography>
							<Typography sx={{ color: '#b0b0b0', mb: 3 }}>{ai.summary}</Typography>
							<Divider sx={{ borderColor: 'rgba(201,169,110,0.1)', mb: 3 }} />

							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1 }}>📊 Sales Info</Typography>
									<Typography sx={{ color: '#b0b0b0', mb: 3 }}>{ai.salesInfo}</Typography>

									<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1 }}>💰 Price Range</Typography>
									<Typography sx={{ color: '#b0b0b0', mb: 3 }}>{ai.priceRange}</Typography>

									<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1 }}>🌟 Celebrity Wearers</Typography>
									{ai.celebrityWearers?.map((c: any, i: number) => (
										<Box key={i} sx={{ mb: 1 }}>
											<Typography sx={{ color: '#fff', fontWeight: 500 }}>{c.name}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>{c.description}</Typography>
										</Box>
									))}
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1 }}>👔 Fashion Tips</Typography>
									{ai.fashionTips?.map((f: any, i: number) => (
										<Box key={i} sx={{ mb: 1.5, p: 1.5, background: 'rgba(201,169,110,0.05)', borderRadius: '8px' }}>
											<Typography sx={{ color: '#fff', fontWeight: 500 }}>{f.outfit}</Typography>
											<Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Best for: {f.occasion}</Typography>
										</Box>
									))}

									<Typography sx={{ color: '#c9a96e', fontWeight: 600, mb: 1, mt: 2 }}>💡 Fun Facts</Typography>
									{ai.funFacts?.map((fact: string, i: number) => (
										<Typography key={i} sx={{ color: '#b0b0b0', mb: 0.5, pl: 1, borderLeft: '2px solid #c9a96e' }}>
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
