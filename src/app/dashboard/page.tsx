'use client';
import ComplexTable from 'components/admin/default/ComplexTable';
import tableDataComplex from 'variables/data-tables/tableDataComplex';

const Dashboard = () => {
    return (
        <div>
            <ComplexTable tableData={tableDataComplex} />
        </div>
    );
};

export default Dashboard;
