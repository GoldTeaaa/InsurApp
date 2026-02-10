import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CopyableValue({ value }: { value?: string | null }) {
    const [isCopied, setIsCopied] = useState(false);

    if (!value) return <span className="text-muted-foreground">—</span>;

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        toast.success("Berhasil disalin");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 group">
            <span>{value}</span>
            <button
                onClick={handleCopy}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                type="button"
                aria-label="Salin"
            >
                {isCopied ? (
                    <Check className="h-3 w-3 text-green-600" />
                ) : (
                    <Copy className="h-3 w-3" />
                )}
            </button>
        </div>
    );
}