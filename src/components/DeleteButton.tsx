"use client";
import { useRef, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

type DeleteButtonProps = {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (formData: FormData) => Promise<any>;
    entityName?: string;
};

export function DeleteButton({ 
    id, 
    action, 
    entityName = "item" 
}: DeleteButtonProps) {
    const formRef = useRef<HTMLFormElement | null>(null);
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* note method="post" and no onSubmit that blocks submission */}
            <form ref={formRef} action={action}>
                <input type="hidden" name="id" value={id} />

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="rounded-md border p-2 border-red-600 hover:bg-gray-100"
                >
                    <span className="sr-only">Delete</span>
                    <TrashIcon className="w-5" color="red" />
                </button>
            </form>

            {open && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

                    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                        <h2 className="text-lg font-semibold">Confirm delete</h2>
                        <p className="mt-2 text-sm">Are you sure you want to delete this {entityName}? </p>
                        <p>This action cannot be undone.</p>

                        <div className="mt-4 flex gap-3 justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-md border px-3 py-2 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    formRef.current?.requestSubmit();
                                    setOpen(false);
                                }}
                                className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                autoFocus
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
