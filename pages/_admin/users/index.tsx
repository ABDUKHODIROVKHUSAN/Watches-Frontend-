import React, { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { Avatar, Box, Chip, List, ListItem, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { REACT_APP_API_URL } from '../../../libs/config';
import { sweetErrorAlert } from '../../../libs/sweetAlert';
import { useLanguage } from '../../../libs/i18n/LanguageContext';

type MemberStatus = 'ACTIVE' | 'BLOCK' | 'DELETE';
type MemberType = 'USER' | 'AGENT' | 'ADMIN';

type Inquiry = {
	page: number;
	limit: number;
	sort: string;
	direction: string;
	search: {
		memberStatus?: MemberStatus;
		memberType?: MemberType;
	};
};

const STATUS_TABS: Array<'ALL' | MemberStatus> = ['ALL', 'ACTIVE', 'BLOCK', 'DELETE'];
const TYPE_OPTIONS: Array<'ALL' | MemberType> = ['ALL', 'USER', 'AGENT', 'ADMIN'];

const AdminUsersPage: NextPage = () => {
	const { t } = useLanguage();
	const [inquiry, setInquiry] = useState<Inquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	});
	const [activeStatusTab, setActiveStatusTab] = useState<'ALL' | MemberStatus>('ALL');
	const [activeType, setActiveType] = useState<'ALL' | MemberType>('ALL');
	const [rows, setRows] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const { data, loading, refetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: { input: inquiry },
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		onCompleted: (response) => {
			setRows(response?.getAllMembersByAdmin?.list ?? []);
			setTotal(response?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	useEffect(() => {
		refetch({ input: inquiry }).then();
	}, [inquiry, refetch]);

	useEffect(() => {
		if (!data) return;
		setRows(data?.getAllMembersByAdmin?.list ?? []);
		setTotal(data?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0);
	}, [data]);

	const handleStatusTab = (nextTab: 'ALL' | MemberStatus) => {
		setActiveStatusTab(nextTab);
		setInquiry((prev) => {
			const nextSearch = { ...prev.search };
			if (nextTab === 'ALL') delete nextSearch.memberStatus;
			else nextSearch.memberStatus = nextTab;
			return { ...prev, page: 1, search: nextSearch };
		});
	};

	const handleTypeChange = (nextType: 'ALL' | MemberType) => {
		setActiveType(nextType);
		setInquiry((prev) => {
			const nextSearch = { ...prev.search };
			if (nextType === 'ALL') delete nextSearch.memberType;
			else nextSearch.memberType = nextType;
			return { ...prev, page: 1, search: nextSearch };
		});
	};

	const handleMemberUpdate = async (memberId: string, key: 'memberStatus' | 'memberType', value: string) => {
		try {
			setUpdatingId(memberId);
			await updateMemberByAdmin({
				variables: {
					input: {
						_id: memberId,
						[key]: value,
					},
				},
			});
			await refetch({ input: inquiry });
		} catch (err: any) {
			await sweetErrorAlert(err?.message || t('admin.updateMemberFailed'));
		} finally {
			setUpdatingId(null);
		}
	};

	const isEmpty = useMemo(() => !loading && rows.length === 0, [loading, rows.length]);

	return (
		<Box>
			<Typography sx={{ color: '#111111', fontSize: '1.6rem', fontWeight: 700, mb: 2.2 }}>{t('admin.usersTitle')}</Typography>

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
								onClick={() => handleStatusTab(status)}
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
					<Select
						size="small"
						value={activeType}
						sx={{ minWidth: 180 }}
						onChange={(e) => handleTypeChange(e.target.value as 'ALL' | MemberType)}
					>
						{TYPE_OPTIONS.map((type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</Select>
				</Stack>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow sx={{ background: '#FAFAFA' }}>
								<TableCell>USER</TableCell>
								<TableCell align="center">TYPE</TableCell>
								<TableCell align="center">STATUS</TableCell>
								<TableCell align="center">PHONE</TableCell>
								<TableCell align="center">WATCHES</TableCell>
								<TableCell align="center">LIKES</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isEmpty && (
								<TableRow>
									<TableCell align="center" colSpan={6}>
										<Typography sx={{ color: '#777777', py: 2 }}>{t('admin.noMembers')}</Typography>
									</TableCell>
								</TableRow>
							)}

							{rows.map((member) => {
								const imageSrc = member?.memberImage
									? member.memberImage.startsWith('/')
										? member.memberImage
										: `${REACT_APP_API_URL}/${member.memberImage}`
									: '/img/profile/defaultUser.svg';

								return (
									<TableRow key={member._id} hover>
										<TableCell>
											<Stack direction="row" spacing={1.1} alignItems="center">
												<Avatar src={imageSrc} sx={{ width: 36, height: 36 }} />
												<Box sx={{ minWidth: 0 }}>
													<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '0.9rem' }}>
														{member.memberNick}
													</Typography>
													<Typography sx={{ color: '#777777', fontSize: '0.78rem' }}>{member._id}</Typography>
												</Box>
											</Stack>
										</TableCell>

										<TableCell align="center">
											<Select
												size="small"
												value={member.memberType}
												disabled={updatingId === member._id}
												onChange={(e) => handleMemberUpdate(member._id, 'memberType', e.target.value)}
												sx={{ minWidth: 110 }}
											>
												<MenuItem value="USER">USER</MenuItem>
												<MenuItem value="AGENT">AGENT</MenuItem>
												<MenuItem value="ADMIN">ADMIN</MenuItem>
											</Select>
										</TableCell>

										<TableCell align="center">
											{member.memberStatus === 'DELETE' ? (
												<Chip label="DELETE" size="small" sx={{ background: '#EEEEEE', color: '#555555' }} />
											) : (
												<Select
													size="small"
													value={member.memberStatus}
													disabled={updatingId === member._id}
													onChange={(e) => handleMemberUpdate(member._id, 'memberStatus', e.target.value)}
													sx={{ minWidth: 120 }}
												>
													<MenuItem value="ACTIVE">ACTIVE</MenuItem>
													<MenuItem value="BLOCK">BLOCK</MenuItem>
													<MenuItem value="DELETE">DELETE</MenuItem>
												</Select>
											)}
										</TableCell>

										<TableCell align="center">{member.memberPhone || '-'}</TableCell>
										<TableCell align="center">{member.memberWatches ?? 0}</TableCell>
										<TableCell align="center">{member.memberLikes ?? 0}</TableCell>
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

export default withAdminLayout(AdminUsersPage);
