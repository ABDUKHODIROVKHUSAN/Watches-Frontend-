import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	MenuItem,
	Stack,
	TextField,
	Typography,
	CircularProgress,
} from '@mui/material';
import { GET_WATCHES } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';

const watchFinderSchema = z.object({
	budget: z.enum(['UNDER_5K', '5K_10K', '10K_25K', '25K_50K', 'ABOVE_50K']),
	style: z.enum(['LUXURY', 'SPORT', 'CLASSIC', 'DRESS', 'SMART']),
	wristSize: z.number().min(13).max(24),
	preferredBrand: z.string().max(50).optional(),
	movement: z.enum(['AUTOMATIC', 'QUARTZ', 'MANUAL']),
});

type WatchFinderFormValues = z.infer<typeof watchFinderSchema>;

type RecommendationItem = {
	id: string;
	title: string;
	brand: string;
	price: string;
	reason: string;
	image?: string;
	watchId?: string;
};

type WatchItem = {
	_id: string;
	watchType?: string;
	watchBrand?: string;
	watchTitle?: string;
	watchPrice?: number;
	watchImages?: string[];
};

const getBudgetRange = (budget: WatchFinderFormValues['budget']) => {
	switch (budget) {
		case 'UNDER_5K':
			return { min: 0, max: 5000 };
		case '5K_10K':
			return { min: 5000, max: 10000 };
		case '10K_25K':
			return { min: 10000, max: 25000 };
		case '25K_50K':
			return { min: 25000, max: 50000 };
		case 'ABOVE_50K':
			return { min: 50000, max: Number.MAX_SAFE_INTEGER };
		default:
			return { min: 0, max: Number.MAX_SAFE_INTEGER };
	}
};

const AiWatchFinder = () => {
	const { isDark } = useThemeMode();
	const [loading, setLoading] = React.useState(false);
	const [results, setResults] = React.useState<RecommendationItem[]>([]);
	const [getWatches] = useLazyQuery(GET_WATCHES, { fetchPolicy: 'network-only' });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<WatchFinderFormValues>({
		resolver: zodResolver(watchFinderSchema),
		defaultValues: {
			budget: '10K_25K',
			style: 'LUXURY',
			wristSize: 17,
			preferredBrand: '',
			movement: 'AUTOMATIC',
		},
	});

	const onSubmit = async (values: WatchFinderFormValues) => {
		setLoading(true);
		setResults([]);

		try {
			const { data } = await getWatches({
				variables: {
					input: {
						page: 1,
						limit: 50,
						search: {
							typeList: [values.style],
							...(values.preferredBrand?.trim() ? { text: values.preferredBrand.trim() } : {}),
						},
					},
				},
			});

			const list: WatchItem[] = data?.getWatches?.list || [];
			const { min, max } = getBudgetRange(values.budget);
			const filteredByBudget = list.filter((watch) => {
				const price = Number(watch?.watchPrice || 0);
				return price >= min && price <= max;
			});

			const source = filteredByBudget.length > 0 ? filteredByBudget : list;
			const mapped: RecommendationItem[] = source.slice(0, 3).map((watch, index) => ({
				id: `${watch._id}-${index}`,
				watchId: watch._id,
				title: watch.watchTitle || 'Watch',
				brand: watch.watchBrand || 'Brand',
				price: `$${Number(watch.watchPrice || 0).toLocaleString()}`,
				reason: `Matches your ${values.style.toLowerCase()} preference and budget profile.`,
				image: watch.watchImages?.[0] ? `${REACT_APP_API_URL}/${watch.watchImages[0]}` : undefined,
			}));

			setResults(mapped);
		} catch (error) {
			console.log('AI Watch Finder fetch failed:', error);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Stack spacing={2.2}>
				<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700 }}>
					AI Watch Finder
				</Typography>
				<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', maxWidth: 820 }}>
					Answer a few questions and let AI shortlist watches that match your budget, style, and wrist profile.
				</Typography>
			</Stack>

			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{
					mt: 3,
					p: { xs: 2.2, md: 3 },
					borderRadius: '18px',
					border: isDark ? '1px solid rgba(212,175,55,0.34)' : '1px solid rgba(17,17,17,0.12)',
					background: isDark ? '#101722' : '#FFFFFF',
					boxShadow: '0 10px 26px rgba(17,17,17,0.05)',
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<TextField
							select
							fullWidth
							label="Budget"
							{...register('budget')}
							error={Boolean(errors.budget)}
							helperText={errors.budget?.message}
						>
							<MenuItem value="UNDER_5K">Under $5,000</MenuItem>
							<MenuItem value="5K_10K">$5,000 - $10,000</MenuItem>
							<MenuItem value="10K_25K">$10,000 - $25,000</MenuItem>
							<MenuItem value="25K_50K">$25,000 - $50,000</MenuItem>
							<MenuItem value="ABOVE_50K">Above $50,000</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							select
							fullWidth
							label="Style"
							{...register('style')}
							error={Boolean(errors.style)}
							helperText={errors.style?.message}
						>
							<MenuItem value="LUXURY">Luxury</MenuItem>
							<MenuItem value="SPORT">Sport</MenuItem>
							<MenuItem value="CLASSIC">Classic</MenuItem>
							<MenuItem value="DRESS">Dress</MenuItem>
							<MenuItem value="SMART">Smart</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							type="number"
							fullWidth
							label="Wrist Size (cm)"
							{...register('wristSize', { valueAsNumber: true })}
							error={Boolean(errors.wristSize)}
							helperText={errors.wristSize?.message}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							label="Preferred Brand (optional)"
							placeholder="Rolex, Omega, Cartier..."
							{...register('preferredBrand')}
							error={Boolean(errors.preferredBrand)}
							helperText={errors.preferredBrand?.message}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							select
							fullWidth
							label="Movement"
							{...register('movement')}
							error={Boolean(errors.movement)}
							helperText={errors.movement?.message}
						>
							<MenuItem value="AUTOMATIC">Automatic</MenuItem>
							<MenuItem value="QUARTZ">Quartz</MenuItem>
							<MenuItem value="MANUAL">Manual</MenuItem>
						</TextField>
					</Grid>
				</Grid>

				<Stack direction="row" justifyContent="flex-end" sx={{ mt: 2.2 }}>
					<Button
						type="submit"
						variant="contained"
						disabled={loading}
						sx={{
							background: '#111111',
							color: '#C6A969',
							fontWeight: 700,
							borderRadius: '12px',
							px: 2.8,
							textTransform: 'none',
							'&:hover': { background: '#252525' },
						}}
					>
						{loading ? <CircularProgress size={20} sx={{ color: '#C6A969' }} /> : 'Find My Watch'}
					</Button>
				</Stack>
			</Box>

			<Stack spacing={1.6} sx={{ mt: 3 }}>
				{!loading && results.length === 0 ? (
					<Typography sx={{ color: isDark ? '#9CA3AF' : '#7a7a7a', fontSize: '0.9rem' }}>
						No recommendations yet. Submit the form to see AI suggestions.
					</Typography>
				) : null}
				<Grid container spacing={2}>
					{results.map((item) => (
						<Grid key={item.id} item xs={12} md={4}>
							<Card
								sx={{
									borderRadius: '16px',
									border: '1px solid rgba(198,169,105,0.42)',
									boxShadow: '0 8px 20px rgba(17,17,17,0.06)',
									height: '100%',
									overflow: 'hidden',
									transition: 'transform 0.25s ease, box-shadow 0.25s ease',
									'&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 30px rgba(17,17,17,0.1)' },
								}}
							>
								{item.image ? (
									<Box
										component="img"
										src={item.image}
										alt={item.title}
										sx={{
											width: '100%',
											height: 190,
											objectFit: 'cover',
											background: isDark ? '#1a2434' : '#F2F2F2',
											borderBottom: '1px solid rgba(17,17,17,0.08)',
										}}
									/>
								) : (
									<Box
										sx={{
											width: '100%',
											height: 190,
											background: isDark ? '#1a2434' : '#F2F2F2',
											borderBottom: '1px solid rgba(17,17,17,0.08)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Typography sx={{ fontSize: 42 }}>⌚</Typography>
									</Box>
								)}
								<CardContent>
									<Typography sx={{ color: isDark ? '#AEB6C2' : '#777777', fontSize: '0.76rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
										{item.brand}
									</Typography>
									<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, fontSize: '1.1rem', mt: 0.6 }}>
										{item.title}
									</Typography>
									<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 600, mt: 0.8 }}>{item.price}</Typography>
									<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', fontSize: '0.88rem', mt: 1.2, lineHeight: 1.6 }}>
										{item.reason}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Stack>
		</Container>
	);
};

export default AiWatchFinder;
