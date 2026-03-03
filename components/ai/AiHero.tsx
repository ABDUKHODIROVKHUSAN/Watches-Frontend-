import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';

type AiHeroProps = {
	onQuickSearch?: (value: string) => void;
};

const AiHero = ({ onQuickSearch }: AiHeroProps) => {
	const [query, setQuery] = React.useState('');

	return (
		<Stack
			sx={{
				position: 'relative',
				overflow: 'hidden',
				py: { xs: 12, md: 16 },
				background:
					'radial-gradient(circle at 20% 20%, rgba(198,169,105,0.22), transparent 32%), linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=80)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					opacity: 0.12,
				}}
			/>
			<Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
				<Typography
					sx={{
						color: '#C6A969',
						fontSize: '0.78rem',
						fontWeight: 700,
						letterSpacing: '2.4px',
						textTransform: 'uppercase',
						mb: 1.2,
					}}
				>
					Timeless Watches
				</Typography>
				<Typography
					sx={{
						color: '#FAFAFA',
						fontWeight: 700,
						fontSize: { xs: '2rem', md: '3.2rem' },
						letterSpacing: '0.8px',
						mb: 1.2,
					}}
				>
					AI Watch Assistant
				</Typography>
				<Typography sx={{ color: 'rgba(250,250,250,0.8)', fontSize: '1rem', mb: 3.5 }}>
					Find your perfect timepiece with intelligent guidance
				</Typography>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ maxWidth: 640, mx: 'auto' }}>
					<TextField
						fullWidth
						placeholder="Search by watch model, style, or brand..."
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								onQuickSearch?.(query.trim());
							}
						}}
						InputProps={{
							sx: {
								background: 'rgba(255,255,255,0.95)',
								borderRadius: '14px',
								'& fieldset': { borderColor: 'rgba(198,169,105,0.4)' },
							},
						}}
					/>
					<Button
						variant="contained"
						onClick={() => onQuickSearch?.(query.trim())}
						sx={{
							background: '#C6A969',
							color: '#111111',
							fontWeight: 700,
							borderRadius: '14px',
							px: 2.8,
							minHeight: 56,
							textTransform: 'none',
							'&:hover': { background: '#d4b57b' },
						}}
					>
						Search
					</Button>
				</Stack>
			</Container>
		</Stack>
	);
};

export default AiHero;
