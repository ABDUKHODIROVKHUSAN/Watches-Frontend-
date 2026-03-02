import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import {
	Avatar,
	Box,
	Button,
	Chip,
	List,
	ListItem,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_WATCHES_BY_ADMIN } from '../../../apollo/admin/query';
import { REMOVE_WATCH_BY_ADMIN, UPDATE_WATCH_BY_ADMIN } from '../../../apollo/admin/mutation';
import { REACT_APP_API_URL } from '../../../libs/config';
import { sweetConfirmAlert, sweetErrorAlert } from '../../../libs/sweetAlert';

type WatchStatus = 'ACTIVE' | 'SOLD' | 'DELETE';

type Inquiry = {
	page: number;
	limit: number;
	sort: string;
	direction: string;
	search: {
		watchStatus?: WatchStatus;
		watchBrandList?: string[];
	};
};

const STATUS_TABS: Array<'ALL' | WatchStatus> = ['ALL', 'ACTIVE', 'SOLD', 'DELETE'];
const WATCH_BRANDS = ['ALL', 'ROLEX', 'OMEGA', 'CARTIER', 'TAG_HEUER', 'PATEK_PHILIPPE', 'AUDEMARS_PIGUET', 'BREITLING', 'IWC', 'HUBLOT', 'TISSOT'];

const AdminWatchesPage: NextPage = () => {
	const [inquiry, setInquiry] = useState<Inquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	});
	const [activeStatusTab, setActiveStatusTab] = useState<'ALL' | WatchStatus>('ALL');
	const [activeBrand, setActiveBrand] = useState('ALL');
	const [rows, setRows] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [removingId, setRemovingId] = useState<string | null>(null);

	const {
		data,
		refetch,
		loading: watchesLoading,
	} = useQuery(GET_ALL_WATCHES_BY_ADMIN, {
		variables: { input: inquiry },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (response) => {
			setRows(response?.getAllWatchesByAdmin?.list ?? []);
			setTotal(response?.getAllWatchesByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateWatchByAdmin] = useMutation(UPDATE_WATCH_BY_ADMIN);
	const [removeWatchByAdmin] = useMutation(REMOVE_WATCH_BY_ADMIN);

	useEffect(() => {
		refetch({ input: inquiry }).then();
	}, [inquiry, refetch]);

	useEffect(() => {
		if (!data) return;
		setRows(data?.getAllWatchesByAdmin?.list ?? []);
		setTotal(data?.getAllWatchesByAdmin?.metaCounter?.[0]?.total ?? 0);
	}, [data]);

	const handleTabChange = (nextTab: 'ALL' | WatchStatus) => {
		setActiveStatusTab(nextTab);
		setInquiry((prev) => {
			const nextSearch = { ...prev.search };
			if (nextTab === 'ALL') delete nextSearch.watchStatus;
			else nextSearch.watchStatus = nextTab;
			return { ...prev, page: 1, search: nextSearch };
		});
	};

	const handleBrandChange = (brand: string) => {
		setActiveBrand(brand);
		setInquiry((prev) => {
			const nextSearch = { ...prev.search };
			if (brand === 'ALL') delete nextSearch.watchBrandList;
			else nextSearch.watchBrandList = [brand];
			return { ...prev, page: 1, search: nextSearch };
		});
	};

	const handleStatusUpdate = async (watchId: string, watchStatus: WatchStatus) => {
		try {
			setUpdatingId(watchId);
			await updateWatchByAdmin({ variables: { input: { _id: watchId, watchStatus } } });
			await refetch({ input: inquiry });
		} catch (err: any) {
			await sweetErrorAlert(err?.message || 'Failed to update watch');
		} finally {
			setUpdatingId(null);
		}
	};

	const handleRemove = async (watchId: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Are you sure to remove this watch permanently?');
			if (!confirmed) return;
			setRemovingId(watchId);
			await removeWatchByAdmin({ variables: { input: watchId } });
			await refetch({ input: inquiry });
		} catch (err: any) {
			await sweetErrorAlert(err?.message || 'Failed to remove watch');
		} finally {
			setRemovingId(null);
		}
	};

	const empty = useMemo(() => !watchesLoading && rows.length === 0, [rows.length, watchesLoading]);

	return (
		<Box>
			<Typography sx={{ color: '#111111', fontSize: '1.6rem', fontWeight: 700, mb: 2.2 }}>Watches Admin</Typography>

			<Stack
				sx={{
					background: '#FFFFFF',
					border: '1px solid rgba(212,175,55,0.38)',
					borderRadius: '12px',
					overflow: 'hidden',
					boxShadow: '0 6px 20px rgba(17,17,17,0.07)',
				}}
			>
				<Stack sx={{ px: 2.2, pt: 2.2 }}>
					<List sx={{ display: 'flex', p: 0, gap: 1 }}>
						{STATUS_TABS.map((status) => (
							<ListItem
								key={status}
								onClick={() => handleTabChange(status)}
								sx={{
									width: 'auto',
									px: 1.5,
									py: 0.8,
									borderRadius: '8px 8px 0 0',
									borderBottom: '2px solid',
									borderColor: activeStatusTab === status ? '#111111' : 'transparent',
									color: activeStatusTab === status ? '#111111' : '#777777',
									fontWeight: activeStatusTab === status ? 700 : 500,
									cursor: 'pointer',
								}}
							>
								{status}
							</ListItem>
						))}
					</List>
				</Stack>

				<Stack direction="row" justifyContent="flex-end" sx={{ px: 2.2, pb: 1.8 }}>
					<Select size="small" value={activeBrand} sx={{ minWidth: 180 }} onChange={(e) => handleBrandChange(e.target.value)}>
						{WATCH_BRANDS.map((brand) => (
							<MenuItem key={brand} value={brand}>
								{brand}
							</MenuItem>
						))}
					</Select>
				</Stack>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow sx={{ background: '#FAFAFA' }}>
								<TableCell>WATCH</TableCell>
								<TableCell align="center">PRICE</TableCell>
								<TableCell align="center">SELLER</TableCell>
								<TableCell align="center">BRAND</TableCell>
								<TableCell align="center">STATUS</TableCell>
								<TableCell align="center">ACTION</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{empty && (
								<TableRow>
									<TableCell align="center" colSpan={6}>
										<Typography sx={{ color: '#777777', py: 2 }}>No watches found.</Typography>
									</TableCell>
								</TableRow>
							)}

							{rows.map((watch) => {
								const imageSrc = watch?.watchImages?.[0] ? `${REACT_APP_API_URL}/${watch.watchImages[0]}` : '';
								const isDelete = watch.watchStatus === 'DELETE';
								return (
									<TableRow key={watch._id} hover>
										<TableCell>
											<Stack direction="row" spacing={1.1} alignItems="center">
												{watch.watchStatus === 'ACTIVE' ? (
													<Link href={`/watches/detail?id=${watch._id}`}>
														<Avatar src={imageSrc} sx={{ width: 38, height: 38 }} />
													</Link>
												) : (
													<Avatar src={imageSrc} sx={{ width: 38, height: 38 }} />
												)}
												<Box sx={{ minWidth: 0 }}>
													<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '0.9rem' }}>
														{watch.watchTitle}
													</Typography>
													<Typography sx={{ color: '#777777', fontSize: '0.78rem' }}>{watch._id}</Typography>
												</Box>
											</Stack>
										</TableCell>

										<TableCell align="center">${Number(watch.watchPrice || 0).toLocaleString()}</TableCell>
										<TableCell align="center">{watch?.memberData?.memberNick || '-'}</TableCell>
										<TableCell align="center">{watch.watchBrand}</TableCell>

										<TableCell align="center">
											{isDelete ? (
												<Chip label="DELETE" size="small" sx={{ background: '#EEEEEE', color: '#555555' }} />
											) : (
												<Select
													size="small"
													value={watch.watchStatus}
													disabled={updatingId === watch._id}
													onChange={(e) => handleStatusUpdate(watch._id, e.target.value as WatchStatus)}
													sx={{ minWidth: 120 }}
												>
													<MenuItem value="ACTIVE">ACTIVE</MenuItem>
													<MenuItem value="SOLD">SOLD</MenuItem>
													<MenuItem value="DELETE">DELETE</MenuItem>
												</Select>
											)}
										</TableCell>

										<TableCell align="center">
											{isDelete ? (
												<Button
													size="small"
													variant="outlined"
													disabled={removingId === watch._id}
													onClick={() => handleRemove(watch._id)}
													sx={{
														color: '#111111',
														borderColor: 'rgba(0,0,0,0.25)',
														'&:hover': { borderColor: '#D4AF37', color: '#D4AF37' },
													}}
												>
													Remove
												</Button>
											) : (
												<Typography sx={{ color: '#777777', fontSize: '0.8rem' }}>-</Typography>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>

				<TablePagination
					component="div"
					count={total}
					page={inquiry.page - 1}
					rowsPerPage={inquiry.limit}
					rowsPerPageOptions={[10, 20, 40]}
					onPageChange={(_, newPage) => setInquiry((prev) => ({ ...prev, page: newPage + 1 }))}
					onRowsPerPageChange={(e) =>
						setInquiry((prev) => ({
							...prev,
							page: 1,
							limit: Number(e.target.value),
						}))
					}
				/>
			</Stack>
		</Box>
	);
};

export default withAdminLayout(AdminWatchesPage);
