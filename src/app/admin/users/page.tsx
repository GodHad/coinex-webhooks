'use client'
import React, { useEffect, useState } from "react";
import Card from "components/card";
import { MdCancel, MdCheckCircle, MdDeleteOutline, MdPause, MdPauseCircle, MdPlayArrow } from "react-icons/md";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { User } from "contexts/UserContext";
import moment from "moment";
import { deleteUser, getUsers, updateSubscribe } from "utils/api";

const columnHelper = createColumnHelper<User>();

const subscriptionStatus = [
    {
        content: 'Not Started',
        className: '',
        Icon: ''
    },
    {
        content: 'Active',
        className: 'text-green-500 me-1 dark:text-green-300',
        Icon: MdCheckCircle
    },
    {
        content: 'Stopped',
        className: 'text-orange-500 me-1 dark:text-orange-300',
        Icon: MdPauseCircle
    },
    {
        content: 'Ended',
        className: 'text-red-500 me-1 dark:text-red-300',
        Icon: MdCancel
    },
]

export default function UsersTable() {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = [
        columnHelper.accessor("firstName", {
            id: "firstName",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">Name</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()} {info.row.original.lastName}
                </p>
            ),
        }),
        columnHelper.accessor("email", {
            id: "email",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">Username</p>
            ),
            cell: (info) => (
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                    {info.getValue()}
                </p>
            ),
        }),
        columnHelper.accessor("subscribed", {
            id: "subscribed",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">
                    Subscribed
                </p>
            ),
            cell: (info) => {
                let index = info.getValue();
                if (!info.getValue()) index = 0;
                const { Icon, className, content } = subscriptionStatus[index];
                return (
                    <div className="flex items-center">
                        {Icon && <Icon className={className} />}
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {content}
                        </p>
                    </div>
                )
            },
        }),
        columnHelper.accessor("subscribeEndDate", {
            id: "subscribeEndDate",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">Subscribe End Date</p>
            ),
            cell: (info) => {
                const endDate = info.getValue()
                return (
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                        {endDate ? moment(endDate).format('YYYY-MM-DD hh:mm:ss') : ''}
                    </p>
                )
            }
        }),
        columnHelper.accessor("_id", {
            id: "_id",
            header: () => (
                <p className="text-sm font-bold text-gray-600 dark:text-white">
                    Actions
                </p>
            ),
            cell: (info) => (
                <div className="flex gap-1">
                    {info.row.original.subscribed === 1 ?
                        <MdPause className="w-5 h-5 cursor-pointer" onClick={() => handleUpdateSubscribe(info.getValue())} /> :
                        <MdPlayArrow className="w-5 h-5 cursor-pointer" onClick={() => handleUpdateSubscribe(info.getValue())} />
                    }
                    <MdDeleteOutline className="w-5 h-5 cursor-pointer" onClick={() => handleDelete(info.getValue())} />
                </div>
            )
        })
    ];

    const [data, setData] = useState<User[]>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    const getUsersMutation = useMutation(getUsers, {
        onSuccess: (data) => {
            setData(data);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || error.message || error);
        }
    })

    useEffect(() => {
        getUsersMutation.mutate();
    }, []);

    const handleUpdateSubscribe = async (id: string) => {
        try {
            const result = await updateSubscribe(id);
            toast.success(result.message);
            setData(prev => prev.map(user => user._id !== id ? user : result.user))
        } catch (error) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteUser(id);
            toast.success(result.message)
            setData(prev => prev.filter(user => user._id !== id));
        } catch (error) {
            toast.error(error.response.data.message || error.message || error);
        }
    }

    return (
            <div className="relative w-full h-full">
                <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
                    <div className="mt-8 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                                                >
                                                    <div className="items-center justify-between text-xs text-gray-200">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: "",
                                                            desc: "",
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length > 0 ?
                                    table
                                        .getRowModel()
                                        .rows
                                        .map((row) => {
                                            return (
                                                <tr key={row.id}>
                                                    {row.getVisibleCells().map((cell) => {
                                                        return (
                                                            <td
                                                                key={cell.id}
                                                                className="min-w-[150px] border-white/0 py-3  pr-4"
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    :
                                    <tr className='border-t border-[#EEEEEE] dark:border-strokedark'>
                                        <td colSpan={table.getHeaderGroups()[0].headers.length} className='text-center px-5 py-4 lg:px-7 2xl:px-11'>No Data</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
    );
}
