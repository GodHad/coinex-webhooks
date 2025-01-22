import React, { useContext, useEffect, useState } from "react";
import Card from "components/card";
import { MdAdd, MdCancel, MdCheck, MdCheckCircle, MdContentCopy, MdDeleteOutline, MdEdit, MdPause, MdPlayArrow } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Hook } from "types/hook";
import { useMutation } from "react-query";
import { deleteHook, getHooks, insertHook, updateHook } from "utils/api";
import { toast } from "react-toastify";
import HookModal from "./HookModal";
import UserContext from "contexts/UserContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AdminHook } from "types/admin-hook";

const columnHelper = createColumnHelper<Hook>();

export default function WebhooksTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hook, setHook] = useState<Hook | null>(null);
  const { user } = useContext(UserContext);

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Webhook Name</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("url", {
      id: "url",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Webhook URL</p>
      ),
      cell: (info) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [copied, setCopied] = useState(false);
        const isSubscribed = info.row.original.isSubscribed;
        const adminHook = info.row.original.adminHook;

        const handleCopy = () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset to original icon after 2 seconds
        };

        return (
          <div className="flex items-center space-x-2">
            {!adminHook ?
              <>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {info.getValue()}
                </p>
                <CopyToClipboard text={`https://api.nothingparticular.com/api/webhooks/${isSubscribed ? '' : user.email + '/'}${info.getValue()}`} onCopy={handleCopy}>
                  <button
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                    title="Copy URL"
                  >
                    {copied ? (
                      <MdCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <MdContentCopy className="w-5 h-5" />
                    )}
                  </button>
                </CopyToClipboard>
              </>
              :
              `${(adminHook as AdminHook).name}(${(adminHook as AdminHook).pair})`
            }
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          STATUS
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue() === 0 ? (
            <MdCheckCircle className="text-green-500 me-1 dark:text-green-300" />
          ) : (
            <MdCancel className="text-red-500 me-1 dark:text-red-300" />
          )}
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue() === 0 ? 'Active' : 'Deactive'}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("coinExApiKey", {
      id: "coinExApiKey",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">CoinEx API Key</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("coinExApiSecret", {
      id: "coinExApiSecret",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">CoinEx API Secret</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("tradeDirection", {
      id: "tradeDirection",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Trade Direction
        </p>
      ),
      cell: (info) => {
        const tradeDirection = info.getValue() as string;
        return (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {tradeDirection === 'BOTH' ? 'BOTH' : tradeDirection === 'LONG_ONLY' ? 'Long Only' : 'Short Only'}
          </p>
        )
      },
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
          <MdEdit className="w-5 h-5 cursor-pointer" onClick={() => handleEdit(info.row.original)} />
          {info.row.original.status === 0 ?
            <MdPause className="w-5 h-5 cursor-pointer" onClick={() => handleSetStatus(info.row.original)} /> :
            <MdPlayArrow className="w-5 h-5 cursor-pointer" onClick={() => handleSetStatus(info.row.original)} />
          }
          <MdDeleteOutline className="w-5 h-5 cursor-pointer" onClick={() => handleDelete(info.getValue())} />
        </div>
      )
    })
  ];

  const [data, setData] = useState<Hook[]>([]);
  const { jwtToken } = useContext(UserContext);

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

  const getHooksMutation = useMutation(getHooks, {
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || error.message || error);
    }
  })

  useEffect(() => {
    getHooksMutation.mutate(jwtToken);
  }, [jwtToken]);

  const handleClickAdd = () => {
    setHook(null);
    setIsOpen(true);
  }

  const handleEdit = (_hook) => {
    setHook(_hook);
    setIsOpen(true);
  }

  const handleSubmit = async (_hook: Hook, isUsingAdminHook: boolean) => {
    if (!hook) {
      const result = await insertHook(_hook, isUsingAdminHook);
      if (result) {
        setData(prev => [...prev, result.hook]);
        toast.success(result.message);
        setIsOpen(false);
        setHook(null);
      }
    } else {
      const result = await updateHook(_hook, isUsingAdminHook);
      if (result) {
        setData(prev => prev.map(hook => hook._id === _hook._id ? result.hook : hook));
        toast.success(result.message);
        setIsOpen(false);
        setHook(null);
      }
    }
  }

  const handleSetStatus = async (_hook: Hook) => {
    _hook.status = 1 - _hook.status;
    const result = await updateHook(_hook, !!_hook.adminHook);
    if (result) {
      setData(prev => prev.map(hook => hook._id === _hook._id ? result.hook : hook));
      toast.success(result.message);
      setIsOpen(false);
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteHook(id);
    if (result) {
      setData(prev => prev.filter(hook => hook._id !== id));
      toast.success(result.message);
    }
  }

  return (
    <div className="relative w-full h-full">
      <button
        className="flex gap-2 my-4 rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 cursor-pointer"
        onClick={handleClickAdd}
      >
        <MdAdd className="h-6 w-6" /> Add
      </button>

      <HookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hook={hook}
        handleSubmit={handleSubmit}
      />

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
