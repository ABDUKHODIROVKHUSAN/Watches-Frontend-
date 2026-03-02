import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';

const AdminIndexPage: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.push('/_admin/users').then();
	}, [router]);

	return null;
};

export default withAdminLayout(AdminIndexPage);
