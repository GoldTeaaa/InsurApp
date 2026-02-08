'use client';
import { Button } from "@/components/button";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteProps = {
    id: string,
    handleDelete: (id: string) => void
}

export default function DeleteDialog({
    id,
    handleDelete
}: DeleteProps) {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </DialogTrigger>

            <DialogOverlay
                className="backdrop-blur-sm fixed inset-0 z-50 bg-black/50 "
            />

            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
                <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
                    Are you sure?
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                    This action cannot be undone. This will permanently delete the record.
                </DialogDescription>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleDelete(id);
                            setOpen(false);
                        }}
                        className="bg-red-100 hover:bg-red-200 text-red-900"
                    >
                        Confirm Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
