"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/button";
import { useActionState, useEffect } from "react";
import deletePembayaranPremi from "../actions/deletePembayaranPremi";

type Props = {
    deletePembayaranPremiId: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    onDeleteSuccess: () => void
}

export default function DeletePembayaranPremiAlertDialog({ deletePembayaranPremiId, isOpen, onOpenChange, onDeleteSuccess }: Props) {
    const [state, formAction, isPending] = useActionState(
        deletePembayaranPremi.bind(null, deletePembayaranPremiId),
        {
            success: false,
            message: ""
        }
    );

    useEffect(() => {
        if (state.success) {
            onDeleteSuccess();
        }
    }, [state.success, onDeleteSuccess]);

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <form action={formAction}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this payment record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            <span className="text-white">{isPending ? "Deleting..." : "Delete"}</span>
                        </Button>
                    </AlertDialogFooter>
                    {state.message && !state.success && (
                        <p className="mt-2 text-sm text-red-600 text-right">
                            {state.message}
                        </p>
                    )}
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}