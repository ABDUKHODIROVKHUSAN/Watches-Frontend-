import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Box, CircularProgress, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';
import AiHero from '../components/ai/AiHero';
import AiWatchFinder from '../components/ai/AiWatchFinder';
import AiChatAssistant from '../components/ai/AiChatAssistant';
import AiComparison from '../components/ai/AiComparison';
import AiVisualSearch from '../components/ai/AiVisualSearch';
import AiWristAdvisor from '../components/ai/AiWristAdvisor';
import { GET_WATCH_BRAND_AI_INSIGHTS } from '../apollo/user/query';
import { useThemeMode } from '../libs/theme/ThemeModeContext';

const AiHelpPage = () => {
	const { isDark } = useThemeMode();
	const [latestBrand, setLatestBrand] = React.useState('');
	const [brandSearchError, setBrandSearchError] = React.useState('');
	const [getBrandInsights, { data, loading }] = useLazyQuery(GET_WATCH_BRAND_AI_INSIGHTS, {
		fetchPolicy: 'network-only',
	});

	const handleQuickSearch = async (value: string): Promise<void> => {
		const text = value.trim();
		if (!text) return;
		setBrandSearchError('');
		setLatestBrand(text);
		try {
			await getBrandInsights({ variables: { brand: text } });
		} catch (error) {
			console.log('Brand AI search failed:', error);
			setBrandSearchError('Could not fetch brand insights right now. Please try again.');
		}
	};

	const brandInsights = data?.getWatchBrandAIInsights;

	return (
		<>
			<Head>
				<title>AI Help - Timeless Watches</title>
			</Head>
			<Stack sx={{ minHeight: '100vh', background: isDark ? '#0b0f16' : '#FAFAFA', display: 'flex' }}>
				<Top />
				<Box sx={{ pt: 0 }}>
					<AiHero onQuickSearch={handleQuickSearch} />
					{loading ? (
						<Container maxWidth="lg" sx={{ py: 4 }}>
							<Stack direction="row" spacing={1.2} alignItems="center">
								<CircularProgress size={22} sx={{ color: isDark ? '#E5E7EB' : '#111111' }} />
								<Typography sx={{ color: isDark ? '#CBD2DC' : '#444' }}>
									Finding well-known details for <b>{latestBrand}</b>...
								</Typography>
							</Stack>
						</Container>
					) : null}
					{brandSearchError ? (
						<Container maxWidth="lg" sx={{ py: 3 }}>
							<Typography sx={{ color: '#C62828' }}>{brandSearchError}</Typography>
						</Container>
					) : null}
					{brandInsights ? (
						<Container maxWidth="lg" sx={{ py: 4 }}>
							<Paper sx={{ borderRadius: '16px', border: '1px solid #D4AF37', p: { xs: 2, md: 2.4 }, background: isDark ? '#101722' : '#FFFFFF' }}>
								<Typography sx={{ color: isDark ? '#AEB6C2' : '#777', fontSize: '0.78rem', letterSpacing: '1.4px', textTransform: 'uppercase', mb: 0.6 }}>
									Brand Insights
								</Typography>
								<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.2rem', md: '1.45rem' }, fontWeight: 700 }}>
									{brandInsights.watchBrand} - {brandInsights.watchTitle}
								</Typography>
								<Typography sx={{ color: isDark ? '#CBD2DC' : '#555', mt: 1, lineHeight: 1.7 }}>
									{brandInsights.summary}
								</Typography>

								<Grid container spacing={2} sx={{ mt: 0.4 }}>
									<Grid item xs={12} md={6}>
										<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, mb: 0.6 }}>Typical Price Range</Typography>
										<Typography sx={{ color: isDark ? '#CBD2DC' : '#555' }}>{brandInsights.priceRange}</Typography>
										<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, mt: 1.2, mb: 0.6 }}>Market Snapshot</Typography>
										<Typography sx={{ color: isDark ? '#AEB6C2' : '#666', fontSize: '0.9rem' }}>
											{brandInsights.salesInfo}
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, mb: 0.6 }}>Well-Known Names</Typography>
										<Stack spacing={0.55}>
											{brandInsights.celebrityWearers?.slice(0, 2).map((person: any, idx: number) => (
												<Typography key={idx} sx={{ color: isDark ? '#CBD2DC' : '#555', fontSize: '0.9rem' }}>
													• {person.name}
												</Typography>
											))}
										</Stack>
										<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, mt: 1.2, mb: 0.6 }}>Quick Facts</Typography>
										<Stack spacing={0.45}>
											{brandInsights.funFacts?.slice(0, 2).map((fact: string, idx: number) => (
												<Typography key={idx} sx={{ color: isDark ? '#CBD2DC' : '#555', fontSize: '0.9rem' }}>
													{fact}
												</Typography>
											))}
										</Stack>
									</Grid>
								</Grid>
							</Paper>
						</Container>
					) : null}
					<AiWatchFinder />
					<AiChatAssistant />
					<AiComparison />
					<AiVisualSearch />
					<AiWristAdvisor />
				</Box>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default AiHelpPage;
