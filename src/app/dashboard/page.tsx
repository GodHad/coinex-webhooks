'use client';
import ComplexTable from 'components/admin/default/ComplexTable';
import UserContext from 'contexts/UserContext';
import { useContext } from 'react';
import { redirect } from 'next/navigation';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    if (!user) redirect('/auth/sign-in');

    return (
        <ComplexTable />
    );
};

export default Dashboard;
