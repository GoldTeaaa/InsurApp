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
}

export default function LaporanTable<TData>({
    data,
    columns,
    isExpandable = false,
    renderSubComponent,
}: LaporanProduksiTableProps<TData>) {

    const [expanded, setExpanded] = useState<ExpandedState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true, // Since we are fetching data per page
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getRowCanExpand: () => isExpandable,
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
                                    return (
                                        <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
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
                        {table.getRowModel().rows.map(row => (
                            <Fragment key={row.id}>
                                <tr onClick={row.getToggleExpandedHandler()} className="border-b transition-colors hover:bg-muted/50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4 align-middle whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {isExpandable && row.getIsExpanded() && renderSubComponent && (
                                    <tr className="border-b">
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent({ row })}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}