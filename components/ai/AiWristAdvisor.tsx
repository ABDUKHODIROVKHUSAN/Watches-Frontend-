import React from 'react';
import { Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';

type WristShape = 'ROUND' | 'FLAT' | 'OVAL';
type PreferredStyle = 'DRESS' | 'SPORT' | 'EVERYDAY';

type AdvisorResult = {
	caseSize: string;
	lugToLug: string;
	styleSuggestion: string;
};

const AiWristAdvisor = () => {
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
			<Typography sx={{ color: '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				Wrist Size Advisor
			</Typography>
			<Typography sx={{ color: '#666666', mb: 2.6 }}>
				Get a quick recommendation for ideal case dimensions and fit profile.
			</Typography>

			<Paper
				sx={{
					p: { xs: 2, md: 2.8 },
					borderRadius: '18px',
					border: '1px solid rgba(17,17,17,0.12)',
					boxShadow: '0 10px 24px rgba(17,17,17,0.05)',
				}}
			>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.6}>
					<TextField
						label="Wrist Circumference (cm)"
						type="number"
						value={circumference}
						onChange={(event) => setCircumference(event.target.value)}
						fullWidth
					/>
					<TextField
						select
						label="Wrist Shape"
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
						label="Preferred Style"
						value={style}
						onChange={(event) => setStyle(event.target.value as PreferredStyle)}
						fullWidth
					>
						<MenuItem value="DRESS">Dress</MenuItem>
						<MenuItem value="SPORT">Sport</MenuItem>
						<MenuItem value="EVERYDAY">Everyday</MenuItem>
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
						Calculate
					</Button>
				</Stack>

				{result ? (
					<Box
						sx={{
							mt: 2.3,
							borderRadius: '14px',
							border: '1px solid rgba(198,169,105,0.45)',
							background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,248,242,0.9) 100%)',
							p: 2,
						}}
					>
						<Typography sx={{ color: '#111111', fontWeight: 700, mb: 1 }}>Recommendation</Typography>
						<Typography sx={{ color: '#555555', fontSize: '0.9rem', mb: 0.5 }}>
							Case Size: <b>{result.caseSize}</b>
						</Typography>
						<Typography sx={{ color: '#555555', fontSize: '0.9rem', mb: 0.5 }}>
							Lug-to-Lug: <b>{result.lugToLug}</b>
						</Typography>
						<Typography sx={{ color: '#555555', fontSize: '0.9rem' }}>
							Suggested Style: <b>{result.styleSuggestion}</b>
						</Typography>
					</Box>
				) : (
					<Typography sx={{ mt: 2.2, color: '#7a7a7a', fontSize: '0.9rem' }}>
						Enter your wrist details and click calculate to view guidance.
					</Typography>
				)}
			</Paper>
		</Container>
	);
};

export default AiWristAdvisor;
