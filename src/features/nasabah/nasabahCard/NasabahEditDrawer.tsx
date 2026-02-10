'use client';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import NasabahForm from "../form/NasabahForm";
import { NasabahFormType } from "@/lib/nasabah/type";

type Props = {
    id: string
    updateData: NasabahFormType
}

export default function NasabahEditDrawer({
    id,
    updateData: initialData
}: Props) {

    const [open, setOpen] = useState(false);

    const formId = "edit-nasabah-form";

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500">
                    <PlusIcon />
                    Edit
                </Button>
            </DrawerTrigger>

            <DrawerOverlay className="bg-black/50 backdrop-blur" />

            <DrawerContent className="overflow-y-auto fixed inset-y-0 right-0 w-[420px] max-w-[30vw]">
                <DrawerHeader>
                    <DrawerTitle>Edit Nasabah</DrawerTitle>
                </DrawerHeader>

                <NasabahForm
                    mode='update'
                    id={id}
                    initialData={initialData}
                    formId={formId}
                    hideButtons={true}
                    onSuccess={
                        () => setOpen(false)
                    }
                />

                <DrawerFooter>
                    <div className="flex justify-end gap-2">
                        <DrawerClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DrawerClose>
                        <Button type="submit" form={formId} className="">
                            Save
                        </Button>
                    </div>
                </DrawerFooter>


            </DrawerContent>

        </Drawer>
    );
}