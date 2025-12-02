import DateFilter from "./DateFilter";
import ExportOptions from "./ExportOptions";

type Props = {
    handlePDFPreview: () => void;
    handleExcelPreview: () => void;
}

export default function LaporanFilter({
    handlePDFPreview,
    handleExcelPreview
}: Props) {
    return (
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <DateFilter />
            <ExportOptions
                onPDFExport={handlePDFPreview}
                onExcelExport={handleExcelPreview}
            />
        </div>
    );
}