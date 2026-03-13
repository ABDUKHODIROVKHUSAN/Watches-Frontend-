import React from 'react';
import {
	CircularProgress,
	Box,
	Button,
	Container,
	MenuItem,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';
import { useLanguage } from '../../libs/i18n/LanguageContext';

type CompareWatch = {
	_id: string;
	watchTitle?: string;
	watchBrand?: string;
	watchType?: string;
	watchPrice?: number;
	watchDesc?: string;
	watchImages?: string[];
};

const getMovementLabel = (watch: CompareWatch): string => {
	const text = `${watch.watchTitle || ''} ${watch.watchDesc || ''}`.toLowerCase();
	if (text.includes('automatic')) return 'Automatic';
	if (text.includes('quartz')) return 'Quartz';
	if (text.includes('manual')) return 'Manual';
	return 'N/A';
};

const getCaseSizeLabel = (watch: CompareWatch): string => {
	const text = `${watch.watchTitle || ''} ${watch.watchDesc || ''}`;
	const match = text.match(/(\d{2}(?:\.\d+)?)\s?mm/i);
	return match ? `${match[1]} mm` : 'N/A';
};

const AiComparison = () => {
	const { isDark } = useThemeMode();
	const { t } = useLanguage();
	const [leftId, setLeftId] = React.useState('');
	const [rightId, setRightId] = React.useState('');
	const [showTable, setShowTable] = React.useState(false);
	const itemHeight = 48;
	const menuProps = {
		PaperProps: {
			sx: {
				maxHeight: itemHeight * 4 + 8,
			},
		},
	};

	const { data, loading } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: 1,
				limit: 300,
				sort: 'createdAt',
				search: {},
			},
		},
		fetchPolicy: 'network-only',
	});

	const watches: CompareWatch[] = React.useMemo(() => data?.getWatches?.list ?? [], [data?.getWatches?.list]);

	React.useEffect(() => {
		if (!watches.length) return;
		if (!leftId) setLeftId(watches[0]._id);
		if (!rightId) setRightId(watches[1]?._id || watches[0]._id);
	}, [watches, leftId, rightId]);

	const left = watches.find((item) => item._id === leftId) ?? watches[0];
	const right = watches.find((item) => item._id === rightId) ?? watches[1] ?? watches[0];

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				{t('ai.comparisonTitle')}
			</Typography>
			<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', mb: 2.6 }}>
				{t('ai.comparisonSubtitle')}
			</Typography>
			<Box
				sx={{
					height: { xs: 180, md: 230 },
					borderRadius: '18px',
					overflow: 'hidden',
					mb: 2.2,
					border: isDark ? '1px solid rgba(212,175,55,0.28)' : '1px solid rgba(17,17,17,0.1)',
					backgroundImage:
						'linear-gradient(120deg, rgba(16,23,34,0.74), rgba(16,23,34,0.28)), url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'flex-end',
					p: 2,
				}}
			>
				<Typography sx={{ color: '#FAFAFA', fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' } }}>
					{t('ai.comparisonTitle')}
				</Typography>
			</Box>

			<Paper
				sx={{
					borderRadius: '18px',
					p: { xs: 2, md: 2.5 },
					border: isDark ? '1px solid rgba(212,175,55,0.34)' : '1px solid rgba(17,17,17,0.12)',
					background: isDark ? '#101722' : '#FFFFFF',
					boxShadow: '0 10px 22px rgba(17,17,17,0.05)',
				}}
			>
				{loading ? (
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.6 }}>
						<CircularProgress size={18} />
						<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', fontSize: '0.9rem' }}>{t('watches.loading')}</Typography>
					</Stack>
				) : null}
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.6} alignItems={{ md: 'center' }}>
					<TextField
						select
						label={t('ai.watchA')}
						value={leftId}
						onChange={(event) => setLeftId(event.target.value)}
						fullWidth
						disabled={!watches.length}
						SelectProps={{ MenuProps: menuProps }}
					>
						{watches.map((watch) => (
							<MenuItem key={watch._id} value={watch._id}>
								{watch.watchBrand?.replace(/_/g, ' ')} - {watch.watchTitle}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label={t('ai.watchB')}
						value={rightId}
						onChange={(event) => setRightId(event.target.value)}
						fullWidth
						disabled={!watches.length}
						SelectProps={{ MenuProps: menuProps }}
					>
						{watches.map((watch) => (
							<MenuItem key={watch._id} value={watch._id}>
								{watch.watchBrand?.replace(/_/g, ' ')} - {watch.watchTitle}
							</MenuItem>
						))}
					</TextField>
					<Button
						variant="contained"
						onClick={() => setShowTable(true)}
						disabled={!left || !right}
						sx={{
							background: '#111111',
							color: '#C6A969',
							fontWeight: 700,
							borderRadius: '12px',
							px: 2.3,
							minHeight: 56,
							textTransform: 'none',
							'&:hover': { background: '#232323' },
						}}
					>
						{t('ai.compare')}
					</Button>
				</Stack>

				{!watches.length && !loading ? (
					<Box sx={{ mt: 2.2 }}>
						<Typography sx={{ color: isDark ? '#9CA3AF' : '#7a7a7a', fontSize: '0.9rem' }}>{t('watches.noCatalog')}</Typography>
					</Box>
				) : null}

				{showTable && left && right ? (
					<TableContainer sx={{ mt: 2.4, borderRadius: '14px', border: '1px solid rgba(198,169,105,0.42)' }}>
						<Table>
							<TableHead sx={{ background: isDark ? 'rgba(198,169,105,0.2)' : 'rgba(198,169,105,0.14)' }}>
								<TableRow>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>{t('ai.specification')}</TableCell>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>{left.watchTitle}</TableCell>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>{right.watchTitle}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 600 }}>Image</TableCell>
									<TableCell>
										{left.watchImages?.[0] ? (
											<Box component="img" src={`${REACT_APP_API_URL}/${left.watchImages[0]}`} alt={left.watchTitle || 'Watch'} sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '8px' }} />
										) : (
											'-'
										)}
									</TableCell>
									<TableCell>
										{right.watchImages?.[0] ? (
											<Box component="img" src={`${REACT_APP_API_URL}/${right.watchImages[0]}`} alt={right.watchTitle || 'Watch'} sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '8px' }} />
										) : (
											'-'
										)}
									</TableCell>
								</TableRow>
								{[
									['Brand', left.watchBrand?.replace(/_/g, ' '), right.watchBrand?.replace(/_/g, ' ')],
									['Type', left.watchType, right.watchType],
									['Price', `$${Number(left.watchPrice || 0).toLocaleString()}`, `$${Number(right.watchPrice || 0).toLocaleString()}`],
									['Movement', getMovementLabel(left), getMovementLabel(right)],
									['Case Size (mm)', getCaseSizeLabel(left), getCaseSizeLabel(right)],
								].map(([label, leftValue, rightValue]) => (
									<TableRow key={label}>
										<TableCell sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 600 }}>{label}</TableCell>
										<TableCell sx={{ color: isDark ? '#CBD2DC' : '#555555' }}>{leftValue}</TableCell>
										<TableCell sx={{ color: isDark ? '#CBD2DC' : '#555555' }}>{rightValue}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box sx={{ mt: 2.2 }}>
						<Typography sx={{ color: isDark ? '#9CA3AF' : '#7a7a7a', fontSize: '0.9rem' }}>
							{t('ai.selectAndCompare')}
						</Typography>
					</Box>
				)}
			</Paper>
		</Container>
	);
};

export default AiComparison;
