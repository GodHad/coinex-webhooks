'use client';
import WebhooksTable from 'components/admin/default/WebhooksTable';
import UserContext from 'contexts/UserContext';
import { useContext } from 'react';
import { redirect } from 'next/navigation';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    if (!user) redirect('/auth/sign-in');

    return (
        <WebhooksTable />
    );
};

export default Dashboard;
