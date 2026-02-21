import React, { useEffect, useState } from 'react';
import { Stack, Container, Typography, Grid, Card, CardContent, CardMedia, Box, TextField, MenuItem, Pagination, Chip } from '@mui/material';
import Head from 'next/head';
import Top from '../../libs/components/Top';
import Footer from '../../libs/components/Footer';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../apollo/user/query';
import { getJwtToken, updateUserInfo } from '../../libs/auth';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { REACT_APP_API_URL } from '../../libs/config';

const WatchesPage = () => {
	const [searchText, setSearchText] = useState('');
	const [brand, setBrand] = useState('');
	const [type, setType] = useState('');
	const [page, setPage] = useState(1);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	const { data, loading, refetch } = useQuery(GET_WATCHES, {
		variables: {
			input: {
				page: page,
				limit: 12,
				search: {
					...(brand && { brandList: [brand] }),
					...(type && { typeList: [type] }),
					...(searchText && { text: searchText }),
				},
			},
		},
		fetchPolicy: 'network-only',
	});

	const watches = data?.getWatches?.list || [];
	const total = data?.getWatches?.metaCounter?.[0]?.total || 0;

	const brands = ['ROLEX', 'OMEGA', 'CARTIER', 'TAG_HEUER', 'PATEK_PHILIPPE', 'AUDEMARS_PIGUET', 'BREITLING', 'IWC', 'HUBLOT'];
	const types = ['LUXURY', 'SPORT', 'CLASSIC', 'DRESS', 'DIVING', 'SMART'];

	return (
		<>
			<Head><title>Watches Collection</title></Head>
			<Stack sx={{ background: '#0f0f1a', minHeight: '100vh' }}>
				<Top />
				<Stack sx={{
					pt: 15, pb: 4,
					background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
					textAlign: 'center',
				}}>
					<Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '2px' }}>
						OUR COLLECTION
					</Typography>
					<Typography sx={{ color: '#c9a96e', mt: 1, letterSpacing: '3px' }}>
						Discover Premium Timepieces
					</Typography>
				</Stack>

				<Container maxWidth="lg" sx={{ py: 4 }}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
						<TextField
							size="small"
							placeholder="Search watches..."
							value={searchText}
							onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
							sx={{
								flex: 1,
								'& .MuiOutlinedInput-root': {
									color: '#fff',
									'& fieldset': { borderColor: 'rgba(201,169,110,0.3)' },
									'&:hover fieldset': { borderColor: '#c9a96e' },
								},
								'& .MuiInputBase-input::placeholder': { color: '#666' },
							}}
						/>
						<TextField
							select size="small" value={brand}
							onChange={(e) => { setBrand(e.target.value); setPage(1); }}
							sx={{
								minWidth: 160,
								'& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(201,169,110,0.3)' } },
								'& .MuiSvgIcon-root': { color: '#c9a96e' },
							}}
						SelectProps={{ displayEmpty: true }}
					>
						<MenuItem value="">All Brands</MenuItem>
							{brands.map((b) => <MenuItem key={b} value={b}>{b.replace('_', ' ')}</MenuItem>)}
						</TextField>
						<TextField
							select size="small" value={type}
							onChange={(e) => { setType(e.target.value); setPage(1); }}
							sx={{
								minWidth: 140,
								'& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(201,169,110,0.3)' } },
								'& .MuiSvgIcon-root': { color: '#c9a96e' },
							}}
						SelectProps={{ displayEmpty: true }}
					>
						<MenuItem value="">All Types</MenuItem>
							{types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
						</TextField>
					</Stack>

					{loading ? (
						<Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 10 }}>Loading watches...</Typography>
					) : watches.length === 0 ? (
						<Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 10 }}>No watches found</Typography>
					) : (
						<Grid container spacing={3}>
							{watches.map((watch: any) => (
								<Grid item xs={12} sm={6} md={4} lg={3} key={watch._id}>
									<Link href={`/watches/detail?id=${watch._id}`} style={{ textDecoration: 'none' }}>
										<Card sx={{
											background: '#1a1a2e',
											borderRadius: '12px',
											overflow: 'hidden',
											border: '1px solid rgba(201,169,110,0.1)',
											transition: 'all 0.3s',
											cursor: 'pointer',
											'&:hover': { transform: 'translateY(-4px)', borderColor: '#c9a96e', boxShadow: '0 8px 30px rgba(201,169,110,0.15)' },
										}}>
											<Box sx={{ height: 220, background: '#16213e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
												{watch.watchImages?.[0] ? (
													<CardMedia
														component="img"
														image={`${REACT_APP_API_URL}/${watch.watchImages[0]}`}
														alt={watch.watchTitle}
														sx={{ height: '100%', objectFit: 'cover' }}
													/>
												) : (
													<Typography sx={{ color: '#444', fontSize: 60 }}>⌚</Typography>
												)}
											</Box>
											<CardContent sx={{ p: 2 }}>
												<Chip label={watch.watchBrand} size="small" sx={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e', mb: 1, fontSize: '0.7rem' }} />
												<Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
													{watch.watchTitle}
												</Typography>
												<Typography sx={{ color: '#c9a96e', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
													${watch.watchPrice?.toLocaleString()}
												</Typography>
												<Stack direction="row" spacing={2} sx={{ color: '#666', fontSize: '0.8rem' }}>
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<VisibilityIcon sx={{ fontSize: 14 }} />
														<span>{watch.watchViews}</span>
													</Stack>
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<FavoriteIcon sx={{ fontSize: 14 }} />
														<span>{watch.watchLikes}</span>
													</Stack>
												</Stack>
											</CardContent>
										</Card>
									</Link>
								</Grid>
							))}
						</Grid>
					)}

					{total > 12 && (
						<Stack alignItems="center" sx={{ mt: 4 }}>
							<Pagination
								count={Math.ceil(total / 12)}
								page={page}
								onChange={(_, v) => setPage(v)}
								sx={{ '& .MuiPaginationItem-root': { color: '#c9a96e' } }}
							/>
						</Stack>
					)}
				</Container>
				<Footer />
			</Stack>
		</>
	);
};

export default WatchesPage;
