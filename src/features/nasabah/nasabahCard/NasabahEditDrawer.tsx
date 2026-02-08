'use client';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
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
} : Props) {

    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500">
                    <PlusIcon />
                    Edit
                </Button>
            </DrawerTrigger>

            <DrawerOverlay className="bg-black/50 backdrop-blur" />

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit Nasabah</DrawerTitle>
                </DrawerHeader>

                <NasabahForm
                    mode='update'
                    id={id}
                    initialData={initialData}
                />


            </DrawerContent>
        </Drawer>
    );
}