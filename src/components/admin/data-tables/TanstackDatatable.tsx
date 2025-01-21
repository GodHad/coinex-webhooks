import { flexRender, Table } from '@tanstack/react-table';

type TanstackDatatableProps<TData> = {
    table: Table<TData>;
    isLoading: boolean;
};

// datatable
const TanstackDatatable = <TData,>({
    table,
}: TanstackDatatableProps<TData>) => {
    return (
        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
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
                                        className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30"
                                    >
                                        <div className="items-center justify-between text-xs text-gray-200">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: '',
                                                desc: '',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getPaginationRowModel().rows.length > 0 ? table
                        .getPaginationRowModel()
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
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        }) : (
                        <tr>
                            <td colSpan={table.getHeaderGroups()[0].headers.length} className='text-center px-5 py-4 lg:px-7 2xl:px-11'>No Data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default TanstackDatatable