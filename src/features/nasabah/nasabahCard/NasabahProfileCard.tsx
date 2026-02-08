'use server';
import DeleteDialog from "@/components/DeleteDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NasabahEditDrawer from "./NasabahEditDrawer";
import { User } from "lucide-react";
import getNasabahDetails from "../actions/getNasabahDetails";

type Props = {
  id: string;
  name?: string;
  joinedAt?: string;
  handleDelete: (id: string) => void
}

export default async function NasabahProfileCard({
  id,
  name = "Nama Nasabah",
  joinedAt = "Bergabung sejak...",  
  handleDelete
}: Props) {

  // const initialUpdateData = await getNasabahDetails(id);  

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>{name}</CardTitle>
              <CardDescription>{joinedAt}</CardDescription>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <NasabahEditDrawer 
              id={id}
              // updateData={initialUpdateData.data}
            />
            <DeleteDialog
              id={id}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}