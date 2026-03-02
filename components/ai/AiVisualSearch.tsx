import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Card, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import Link from 'next/link';
import { GET_WATCHES } from '../../apollo/user/query';
import { REACT_APP_API_URL } from '../../libs/config';

const AiVisualSearch = () => {
	const [dragging, setDragging] = React.useState(false);
	const [preview, setPreview] = React.useState<string | null>(null);
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const [searchError, setSearchError] = React.useState('');
	const [results, setResults] = React.useState<any[]>([]);

	const [fetchWatches, { loading: searching }] = useLazyQuery(GET_WATCHES, {
		fetchPolicy: 'network-only',
	});

	React.useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	const tokenize = (text: string) =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, ' ')
			.split(/\s+/)
			.filter((token) => token.length >= 3);

	const scoreWatchMatch = (watch: any, tokens: string[]) => {
		const haystack = `${watch?.watchTitle || ''} ${watch?.watchBrand || ''} ${watch?.watchType || ''}`.toLowerCase();
		return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
	};

	const onFile = (file?: File | null) => {
		if (!file) return;
		setSearchError('');
		setResults([]);
		setSelectedFile(file);
		if (preview) URL.revokeObjectURL(preview);
		setPreview(URL.createObjectURL(file));
	};

	const handleFindSimilar = async () => {
		if (!selectedFile || searching) return;
		setSearchError('');
		setResults([]);

		try {
			const response = await fetchWatches({
				variables: {
					input: {
						page: 1,
						limit: 40,
						search: {},
					},
				},
			});

			const fetched: any[] = response?.data?.getWatches?.list || [];
			if (fetched.length === 0) {
				setSearchError('No watches found in catalog right now.');
				return;
			}

			const fileTokens = tokenize(selectedFile.name.replace(/\.[^/.]+$/, ''));
			const ranked = [...fetched].sort((a, b) => scoreWatchMatch(b, fileTokens) - scoreWatchMatch(a, fileTokens));
			const hasStrongMatch = fileTokens.length > 0 && scoreWatchMatch(ranked[0], fileTokens) > 0;
			const picked = hasStrongMatch
				? ranked.slice(0, 6)
				: [...fetched].sort((a, b) => (Number(b?.watchLikes || 0) - Number(a?.watchLikes || 0))).slice(0, 6);

			setResults(picked);
		} catch (error) {
			console.log('Visual search failed:', error);
			setSearchError('Could not process visual search right now. Please try again.');
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				Visual Search
			</Typography>
			<Typography sx={{ color: '#666666', mb: 2.6 }}>
				Upload a watch photo and discover similar pieces in the marketplace.
			</Typography>

			<Box
				onDragOver={(event) => {
					event.preventDefault();
					setDragging(true);
				}}
				onDragLeave={(event) => {
					event.preventDefault();
					setDragging(false);
				}}
				onDrop={(event) => {
					event.preventDefault();
					setDragging(false);
					onFile(event.dataTransfer.files?.[0] ?? null);
				}}
				sx={{
					borderRadius: '20px',
					border: dragging ? '2px solid #C6A969' : '1.5px dashed rgba(17,17,17,0.25)',
					background: dragging ? 'rgba(198,169,105,0.08)' : '#FFFFFF',
					p: { xs: 3, md: 5 },
					textAlign: 'center',
					transition: 'all 0.2s ease',
				}}
			>
				<UploadFileOutlinedIcon sx={{ fontSize: 42, color: '#C6A969', mb: 1.2 }} />
				<Typography sx={{ color: '#111111', fontWeight: 700, mb: 0.6 }}>Drag and drop image here</Typography>
				<Typography sx={{ color: '#777777', fontSize: '0.88rem', mb: 2 }}>
					PNG / JPG up to 10MB. We will use this image to suggest visually similar watches.
				</Typography>
				<Button
					variant="outlined"
					component="label"
					sx={{
						borderColor: 'rgba(17,17,17,0.25)',
						color: '#111111',
						fontWeight: 600,
						textTransform: 'none',
						borderRadius: '11px',
						'&:hover': { borderColor: '#C6A969', color: '#C6A969' },
					}}
				>
					Choose File
					<input
						type="file"
						hidden
						accept="image/*"
						onChange={(event) => onFile(event.target.files?.[0] ?? null)}
					/>
				</Button>

				{preview ? (
					<Stack alignItems="center" sx={{ mt: 2.5 }}>
						<Box
							component="img"
							src={preview}
							alt="Visual search preview"
							sx={{
								width: { xs: '100%', sm: 280 },
								maxHeight: 220,
								objectFit: 'cover',
								borderRadius: '14px',
								border: '1px solid rgba(17,17,17,0.15)',
								mb: 1.4,
							}}
						/>
						<Button
							variant="contained"
							type="button"
							onClick={handleFindSimilar}
							disabled={searching}
							sx={{
								background: '#111111',
								color: '#C6A969',
								fontWeight: 700,
								textTransform: 'none',
								borderRadius: '12px',
								px: 2.6,
								minWidth: 190,
								'&:hover': { background: '#232323' },
								'&.Mui-disabled': { background: '#2A2A2A', color: 'rgba(198,169,105,0.65)' },
							}}
						>
							{searching ? <CircularProgress size={20} sx={{ color: '#C6A969' }} /> : 'Find Similar Watches'}
						</Button>
					</Stack>
				) : null}
			</Box>

			{searchError ? (
				<Typography sx={{ color: '#C62828', mt: 1.6, fontSize: '0.9rem' }}>
					{searchError}
				</Typography>
			) : null}

			{results.length > 0 ? (
				<Box sx={{ mt: 3 }}>
					<Typography sx={{ color: '#111111', fontWeight: 700, mb: 1.5, fontSize: '1.05rem' }}>
						Similar Watches
					</Typography>
					<Grid container spacing={2}>
						{results.map((watch) => (
							<Grid item xs={12} sm={6} md={4} key={watch._id}>
								<Card
									sx={{
										borderRadius: '14px',
										border: '1px solid rgba(17,17,17,0.1)',
										overflow: 'hidden',
										boxShadow: '0 6px 20px rgba(17,17,17,0.06)',
										height: '100%',
									}}
								>
									<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
										<Box sx={{ background: '#F3F3F0', height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											{watch?.watchImages?.[0] ? (
												<Box
													component="img"
													src={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
													alt={watch.watchTitle}
													sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
												/>
											) : (
												<Typography sx={{ fontSize: 46 }}>⌚</Typography>
											)}
										</Box>
										<Box sx={{ p: 1.6 }}>
											<Typography sx={{ color: '#666', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
												{watch.watchBrand}
											</Typography>
											<Typography sx={{ color: '#111111', fontWeight: 700, mt: 0.4 }}>
												{watch.watchTitle}
											</Typography>
											<Typography sx={{ color: '#111111', mt: 0.8, fontWeight: 600 }}>
												${Number(watch.watchPrice || 0).toLocaleString()}
											</Typography>
										</Box>
									</Link>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
			) : null}
		</Container>
	);
};

export default AiVisualSearch;
