"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { DropdownMenuItem } from "@/components/dropdown-menu";

type DeleteConfirmationMenuItemProps = {
  onConfirm: () => void;
  children: React.ReactNode;
  entityName?: string;
} & React.ComponentProps<typeof DropdownMenuItem>;

export default function DeleteConfirmationMenuItem({
  onConfirm,
  children,
  entityName = "item",
  ...props
}: DeleteConfirmationMenuItemProps) {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem {...props} onSelect={(e) => e.preventDefault()} onClick={() => setDialogOpen(true)}>
        {children}
      </DropdownMenuItem>
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {entityName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}