import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export interface ColumnDefinition<T> {
    header: string;
    accessor: (row: T) => React.ReactNode;
}

interface ExcelPreviewDialogProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
    title: string;
    data: T[];
    columns: ColumnDefinition<T>[];
}

export default function ExcelPreviewDialog<T>({
    isOpen,
    onClose,
    onDownload,
    data,
    title,
    columns
}: ExcelPreviewDialogProps<T>) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-auto border rounded-md">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.header} className="p-2">{col.header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                // It's better to have a unique ID on the row data if possible
                                <tr key={rowIndex} className="border-t">
                                    {columns.map((col) => (
                                        <td key={col.header} className="p-2">
                                            {col.accessor(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                    <Button onClick={onDownload}>Download Excel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}