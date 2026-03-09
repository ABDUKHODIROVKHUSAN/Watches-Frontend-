import React from 'react';
import {
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
import { useThemeMode } from '../../libs/theme/ThemeModeContext';

type WatchSpec = {
	id: string;
	name: string;
	movement: string;
	caseSize: string;
	waterResistance: string;
	powerReserve: string;
	price: string;
};

const WATCHES: WatchSpec[] = [
	{
		id: 'rolex-submariner-date',
		name: 'Rolex Submariner Date',
		movement: 'Automatic',
		caseSize: '41 mm',
		waterResistance: '300m',
		powerReserve: '70h',
		price: '$13,500',
	},
	{
		id: 'omega-seamaster-diver-300m',
		name: 'Omega Seamaster Diver 300M',
		movement: 'Automatic',
		caseSize: '42 mm',
		waterResistance: '300m',
		powerReserve: '55h',
		price: '$6,800',
	},
	{
		id: 'cartier-tank-must',
		name: 'Cartier Tank Must',
		movement: 'Quartz',
		caseSize: '33.7 x 25.5 mm',
		waterResistance: '30m',
		powerReserve: 'Battery',
		price: '$4,700',
	},
];

const AiComparison = () => {
	const { isDark } = useThemeMode();
	const [leftId, setLeftId] = React.useState(WATCHES[0].id);
	const [rightId, setRightId] = React.useState(WATCHES[1].id);
	const [showTable, setShowTable] = React.useState(false);

	const left = WATCHES.find((item) => item.id === leftId) ?? WATCHES[0];
	const right = WATCHES.find((item) => item.id === rightId) ?? WATCHES[1];

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				Watch Comparison Tool
			</Typography>
			<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', mb: 2.6 }}>
				Compare two watches side-by-side to evaluate specs, value, and wearability.
			</Typography>

			<Paper
				sx={{
					borderRadius: '18px',
					p: { xs: 2, md: 2.5 },
					border: isDark ? '1px solid rgba(212,175,55,0.34)' : '1px solid rgba(17,17,17,0.12)',
					background: isDark ? '#101722' : '#FFFFFF',
					boxShadow: '0 10px 22px rgba(17,17,17,0.05)',
				}}
			>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.6} alignItems={{ md: 'center' }}>
					<TextField
						select
						label="Watch A"
						value={leftId}
						onChange={(event) => setLeftId(event.target.value)}
						fullWidth
					>
						{WATCHES.map((watch) => (
							<MenuItem key={watch.id} value={watch.id}>
								{watch.name}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label="Watch B"
						value={rightId}
						onChange={(event) => setRightId(event.target.value)}
						fullWidth
					>
						{WATCHES.map((watch) => (
							<MenuItem key={watch.id} value={watch.id}>
								{watch.name}
							</MenuItem>
						))}
					</TextField>
					<Button
						variant="contained"
						onClick={() => setShowTable(true)}
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
						Compare
					</Button>
				</Stack>

				{showTable ? (
					<TableContainer sx={{ mt: 2.4, borderRadius: '14px', border: '1px solid rgba(198,169,105,0.42)' }}>
						<Table>
							<TableHead sx={{ background: isDark ? 'rgba(198,169,105,0.2)' : 'rgba(198,169,105,0.14)' }}>
								<TableRow>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>Specification</TableCell>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>{left.name}</TableCell>
									<TableCell sx={{ fontWeight: 700, color: isDark ? '#E5E7EB' : '#111111' }}>{right.name}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{[
									['Movement', left.movement, right.movement],
									['Case Size', left.caseSize, right.caseSize],
									['Water Resistance', left.waterResistance, right.waterResistance],
									['Power Reserve', left.powerReserve, right.powerReserve],
									['Price', left.price, right.price],
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
							Select two models and click compare to view the table.
						</Typography>
					</Box>
				)}
			</Paper>
		</Container>
	);
};

export default AiComparison;
