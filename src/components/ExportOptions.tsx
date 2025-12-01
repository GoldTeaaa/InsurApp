'use client';
import { Download } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
    onPDFExport: () => void;
    onExcelExport: () => void;
}

export default function ExportOptions({
    onPDFExport,
    onExcelExport
}: Props) {

    return (
        <div className="flex gap-2">
            <Button variant="destructive" onClick={onPDFExport}>
                <Download className="w-4 h-4 mr-2" />
                PDF
            </Button>
            <Button className="bg-green-700 hover:bg-green-800" onClick={onExcelExport}>
                <Download className="w-4 h-4 mr-2 " />
                Excel
            </Button>
        </div>
    );
}