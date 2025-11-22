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
import deletePembayaranKomisi from "@/features/pembayaran/pembayaranKomisi/actions/deletePembayaranKomisi";

type Props = {
    deletePembayaranKomisiId: string,
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
    onDeleteSuccess: () => void
}

export default function DeleteKomisiAlertDialog({ deletePembayaranKomisiId, isOpen, onOpenChange, onDeleteSuccess }: Props) {
    const [state, formAction, isPending] = useActionState(
        deletePembayaranKomisi.bind(null, deletePembayaranKomisiId),
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
                        <AlertDialogTitle>Are you absolutely sure to delete {deletePembayaranKomisiId}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-red-600 focus:bg-red-600 hover:bg-red-600"
                        >
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