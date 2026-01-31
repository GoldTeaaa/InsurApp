'use client';
import { Fragment, ReactElement, useState } from 'react';
import {
    ColumnDef,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    Row,
    useReactTable
} from "@tanstack/react-table"

type LaporanProduksiTableProps<TData> = {
    data: TData[]
    columns: ColumnDef<TData>[]
    isExpandable?: boolean
    renderSubComponent?: (props: { row: Row<TData> }) => ReactElement
    leftPin?: string[]
    rightPin?: string[]
}

export default function LaporanTable<TData>({
    data,
    columns,
    isExpandable = false,
    leftPin = [],
    rightPin = [],
    renderSubComponent,
}: LaporanProduksiTableProps<TData>) {

    const [expanded, setExpanded] = useState<ExpandedState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enablePinning: true,
        manualPagination: true, // Since we are fetching data per page
        state: {
            expanded,
            columnPinning: {
                left: leftPin,
                right: rightPin
            }
        },
        onExpandedChange: setExpanded,
        getRowCanExpand: () => isExpandable,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getSubRows: (row: any) => row.polis_shares ?? [],
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div className="w-full">
            <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const isPinned = header.column.getIsPinned();
                                    return (
                                        <th
                                            key={header.id}
                                            className="h-12 px-4 text-left align-middle font-medium text-white text-muted-foreground whitespace-nowrap bg-blue-700"
                                            style={{
                                                position: isPinned ? 'sticky' : 'static',
                                                left: isPinned === 'left' ? `${header.column.getStart('left')}px` : undefined,
                                                right: isPinned === 'right' ? `${header.column.getAfter('right')}px` : undefined,
                                                zIndex: isPinned ? 1 : 0,
                                                width: header.column.getSize(),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}  
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <Fragment key={row.id}>
                                    <tr
                                        onClick={row.getToggleExpandedHandler()}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map(cell => {
                                            const isPinned = cell.column.getIsPinned();
                                            return (
                                                <td
                                                    key={cell.id}
                                                    className="p-4 align-middle whitespace-nowrap bg-white"
                                                    style={{
                                                        position: isPinned ? 'sticky' : 'static',
                                                        left: isPinned === 'left' ? `${cell.column.getStart()}px` : undefined,
                                                        right: isPinned === 'right' ? `${cell.column.getAfter('right')}px` : undefined,
                                                        width: cell.column.getSize(),
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            )
                                        }
                                        )}
                                    </tr>
                                    {isExpandable && row.getIsExpanded() && renderSubComponent && (
                                        <tr className="border-b">
                                            <td colSpan={row.getVisibleCells().length}>
                                                {renderSubComponent({ row })}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}