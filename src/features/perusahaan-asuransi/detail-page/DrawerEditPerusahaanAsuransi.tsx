'use client';
import { Button } from "@/components/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Pencil } from "lucide-react";
import PerusahaanAsuransiForm from "../PerusahaanAsuransiForm";
import { PerusahaanFormType } from "@/lib/perusahaan_asuransi/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function DrawerEditPerusahaanAsuransi({
    id,
    data
}: {
    id: string,
    data: PerusahaanFormType
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <div>
            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="sm:max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>Edit {data.nama}</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4">
                        <PerusahaanAsuransiForm
                            mode="update"
                            id={id}
                            prefillData={data}
                            formId="edit-perusahaan-form"
                            hideButtons={true}
                            onSuccess={() => {
                                setOpen(false);
                                router.refresh();
                            }}
                            className="mt-0"
                        />
                    </div>
                    <DrawerFooter>
                        <Separator className="my-4"/>
                        <div className="flex justify-end gap-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <Button type="submit" form="edit-perusahaan-form">Simpan</Button>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}