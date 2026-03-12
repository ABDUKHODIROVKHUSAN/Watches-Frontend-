import React from 'react';
import { Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';
import { useLanguage } from '../../libs/i18n/LanguageContext';

type WristShape = 'ROUND' | 'FLAT' | 'OVAL';
type PreferredStyle = 'DRESS' | 'SPORT' | 'EVERYDAY';

type AdvisorResult = {
	caseSize: string;
	lugToLug: string;
	styleSuggestion: string;
};

const AiWristAdvisor = () => {
	const { isDark } = useThemeMode();
	const { t } = useLanguage();
	const [circumference, setCircumference] = React.useState('17');
	const [shape, setShape] = React.useState<WristShape>('ROUND');
	const [style, setStyle] = React.useState<PreferredStyle>('EVERYDAY');
	const [result, setResult] = React.useState<AdvisorResult | null>(null);

	const calculate = () => {
		const cm = Number(circumference);
		if (!Number.isFinite(cm) || cm <= 0) return;

		let min = 36;
		let max = 40;
		if (cm >= 18) {
			min = 39;
			max = 43;
		} else if (cm <= 15.5) {
			min = 34;
			max = 38;
		}

		if (shape === 'FLAT') {
			max += 1;
		}
		if (shape === 'ROUND') {
			min -= 1;
		}

		const styleSuggestion =
			style === 'DRESS'
				? 'Slim dress watches with refined lugs and cleaner dials.'
				: style === 'SPORT'
					? 'Sport-luxury watches with robust case profile and bracelet balance.'
					: 'Balanced versatile watches suited for both casual and formal wear.';

		setResult({
			caseSize: `${min} - ${max} mm`,
			lugToLug: `${Math.round(min * 1.2)} - ${Math.round(max * 1.2)} mm`,
			styleSuggestion,
		});
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				{t('ai.wristAdvisorTitle')}
			</Typography>
			<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', mb: 2.6 }}>
				{t('ai.wristAdvisorSubtitle')}
			</Typography>

			<Paper
				sx={{
					p: { xs: 2, md: 2.8 },
					borderRadius: '18px',
					border: isDark ? '1px solid rgba(212,175,55,0.34)' : '1px solid rgba(17,17,17,0.12)',
					background: isDark ? '#101722' : '#FFFFFF',
					boxShadow: '0 10px 24px rgba(17,17,17,0.05)',
				}}
			>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.6}>
					<TextField
						label={t('ai.wristCircumference')}
						type="number"
						value={circumference}
						onChange={(event) => setCircumference(event.target.value)}
						fullWidth
					/>
					<TextField
						select
						label={t('ai.wristShape')}
						value={shape}
						onChange={(event) => setShape(event.target.value as WristShape)}
						fullWidth
					>
						<MenuItem value="ROUND">Round</MenuItem>
						<MenuItem value="FLAT">Flat</MenuItem>
						<MenuItem value="OVAL">Oval</MenuItem>
					</TextField>
					<TextField
						select
						label={t('ai.preferredStyle')}
						value={style}
						onChange={(event) => setStyle(event.target.value as PreferredStyle)}
						fullWidth
					>
						<MenuItem value="DRESS">Dress</MenuItem>
						<MenuItem value="SPORT">Sport</MenuItem>
						<MenuItem value="EVERYDAY">{t('ai.everyday')}</MenuItem>
					</TextField>
					<Button
						variant="contained"
						onClick={calculate}
						sx={{
							background: '#111111',
							color: '#C6A969',
							fontWeight: 700,
							borderRadius: '12px',
							minHeight: 56,
							px: 2.6,
							textTransform: 'none',
							'&:hover': { background: '#232323' },
						}}
					>
						{t('ai.calculate')}
					</Button>
				</Stack>

				{result ? (
					<Box
						sx={{
							mt: 2.3,
							borderRadius: '14px',
							border: '1px solid rgba(198,169,105,0.45)',
							background: isDark
								? 'linear-gradient(180deg, rgba(16,23,34,1) 0%, rgba(20,30,45,0.96) 100%)'
								: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,248,242,0.9) 100%)',
							p: 2,
						}}
					>
						<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontWeight: 700, mb: 1 }}>{t('ai.recommendation')}</Typography>
						<Typography sx={{ color: isDark ? '#CBD2DC' : '#555555', fontSize: '0.9rem', mb: 0.5 }}>
							{t('ai.caseSize')}: <b>{result.caseSize}</b>
						</Typography>
						<Typography sx={{ color: isDark ? '#CBD2DC' : '#555555', fontSize: '0.9rem', mb: 0.5 }}>
							{t('ai.lugToLug')}: <b>{result.lugToLug}</b>
						</Typography>
						<Typography sx={{ color: isDark ? '#CBD2DC' : '#555555', fontSize: '0.9rem' }}>
							{t('ai.suggestedStyle')}: <b>{result.styleSuggestion}</b>
						</Typography>
					</Box>
				) : (
					<Typography sx={{ mt: 2.2, color: isDark ? '#9CA3AF' : '#7a7a7a', fontSize: '0.9rem' }}>
						{t('ai.enterDetails')}
					</Typography>
				)}
			</Paper>
		</Container>
	);
};

export default AiWristAdvisor;
