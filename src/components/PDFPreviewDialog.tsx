'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
    pdfDataUrl: string;
    title: string;
};

export default function  PDFPreviewDialog({ isOpen, onClose, onDownload, pdfDataUrl, title }: Props) {
    if(!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[90vw] w-[90vw] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                    <div className="flex-grow border rounded-md">
                        <iframe
                            src={pdfDataUrl}
                            className="w-full h-full"
                            title={title}
                        />
                    </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={onDownload}>Download PDF</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}