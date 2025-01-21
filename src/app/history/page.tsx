'use client'
import ReactPagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { HistoryType } from "types/history";
import { Hook } from "types/hook";
import { Pagination } from "types/pagination";
import { getHistories } from "utils/api";
import DebouncedInput from 'components/fields/DebouncedInput';
import TanstackDatatable from 'components/admin/data-tables/TanstackDatatable';

const History = () => {
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const columns = useMemo<ColumnDef<HistoryType>[]>(
        () => [
            {
                accessorKey: 'hook',
                header: 'Hook',
                cell: info => <p className="text-sm font-bold text-navy-700 dark:text-white">{(info.getValue() as Hook).name}</p>,
            },
            {
                accessorKey: 'symbol',
                header: 'Ticker',
                cell: info => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue() as string}</p>
            },
            {
                accessorKey: 'action',
                header: 'Action',
                cell: info => {
                    const action = info.getValue() as string
                    return (
                        <p className={`text-sm font-bold text-center rounded-full ${action === 'sell' ? 'text-[#d34053] bg-[#d340531a]' : 'text-[#219653] bg-[#2196531a]'}`}>{action}</p>
                    )
                }
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: info => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue() as string}</p>
            },
            {
                accessorKey: 'data',
                header: 'Status',
                cell: info => {
                    const data = info.row.original.data;
                    return <p className={`text-sm font-bold ${(data && data.code === 0) ? 'text-[#219653]' : 'text-[#d34053]'}`}>{(data && data.code === 0) ? 'Success' : 'Failed'}</p>
                }
            },
            {
                accessorKey: 'data',
                header: 'Message',
                cell: info => {
                    const data = info.row.original.data;
                    return <p className={`text-sm font-bold text-navy-700 dark:text-white'}`}>{data ? data.message : ''}</p>
                }
            },
            {
                accessorKey: 'createdAt',
                header: 'Date',
                cell: info => <p className="text-sm font-bold text-navy-700 dark:text-white">{moment(info.getValue()).format('YYYY-MM-DD hh:mm:ss')}</p>
            }
        ]
        ,
        []
    );

    const [data, setData] = useState<HistoryType[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0
    })

    const table = useReactTable({
        data,
        columns,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    });


    const handleGetHistories = async () => {
        setIsLoading(true);
        const result = await getHistories({ perPage: pagination.perPage, currentPage: pagination.currentPage, searchTerm: globalFilter });
        setData(result.histories);
        setPagination(result.pagination);
        setIsLoading(false);
    }

    useEffect(() => {
        handleGetHistories();
    }, [pagination.perPage, pagination.currentPage, globalFilter])

    return (
        <>
            <div className="flex sm:flex-row flex-col sm:items-center justify-between mt-4 mb-4 items-start gap-1 text-navy-700 dark:text-white">
                <div className="flex items-center gap-1 ">
                    Show
                    <select
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 px-3 py-1 text-sm outline-none"
                        value={pagination.perPage}
                        onChange={e => {
                            setPagination(prev => ({
                                ...prev,
                                perPage: Number(e.target.value)
                            }))
                        }}
                    >
                        {[10, 25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    entries
                </div>
                <div className="flex items-center gap-1">
                    Search:
                    <DebouncedInput
                        type="text"
                        value={globalFilter}
                        onChange={value => setGlobalFilter(value.toString())}
                        placeholder={``}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 px-3 py-1 text-sm outline-none"
                    />
                </div>
            </div>
            <TanstackDatatable
                table={table}
                isLoading={isLoading}
            />
            {data.length > 0 &&
                <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between mt-4 gap-1 text-navy-700 dark:text-white">
                    <div className="col-sm-12 col-md-5">
                        <div
                            className="dataTables_info"
                            id="membershipsDataTable_info"
                            role="status"
                            aria-live="polite"
                        >
                            {`Showing ${((pagination.currentPage - 1) * pagination.perPage + 1)} to ${Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)} of ${pagination.totalItems} entries`}
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-7">
                        {pagination.totalItems > 0 && (
                            <div className="flex items-center justify-end gap-2">
                                <ReactPagination
                                    current={pagination.currentPage}
                                    total={pagination.totalPages}
                                    onPageChange={(page) => {
                                        setPagination(prev => ({ ...prev, currentPage: page }));
                                    }}
                                    maxWidth={5}
                                    previousLabel="Previous"
                                    nextLabel="Next"
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default History;