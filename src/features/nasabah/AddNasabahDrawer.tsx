'use client';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import NasabahForm from "./form/NasabahForm";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function AddNasabahDrawer() {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const formId = "add-nasabah-form";

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                <Button
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block font-bold">Tambah Nasabah</span>{' '}
                    <PlusIcon className="h-5 md:ml-4" />
                </Button>
            </DrawerTrigger>

            <DrawerOverlay className="bg-black/50 backdrop-blur" />

            <DrawerContent
                className=" 
                    fixeds
                    inset-y-0
                    right-0
                    left-auto
                    w-[420px]
                    max-w-[30vw]
                    flex flex-col
                "
            >
                <DrawerHeader>
                    <DrawerTitle className="text-xl">Add Nasabah</DrawerTitle>
                    <Separator className="my-4" />
                </DrawerHeader>
                <div className="px-4 scrollbar overflow-y-auto flex-1">
                    <NasabahForm
                        mode="create"
                        formId={formId}
                        hideButtons={true}
                        onSuccess={() => {
                            setOpen(false);
                            router.refresh();
                        }}
                    />
                </div>

                <DrawerFooter>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-end gap-2">
                        <DrawerClose asChild>
                            <Button>Cancel</Button>
                        </DrawerClose>
                        <Button
                            type="submit"
                            form={formId}>
                            Save
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}