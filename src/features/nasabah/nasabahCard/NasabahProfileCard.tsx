import DeleteDialog from "@/components/DeleteDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NasabahEditDrawer from "./NasabahEditDrawer";
import { User } from "lucide-react";
import { NasabahFormType } from "@/lib/nasabah/type";

type Props = {
  id: string;
  data: NasabahFormType;
  handleDelete: (id: string) => void
}

export default function NasabahProfileCard({
  id,
  data,
  handleDelete
}: Props) {

  const { nama } = data;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>{nama}</CardTitle>
              <CardDescription>Bergabung pada tanggal...</CardDescription>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <NasabahEditDrawer
              id={id}
              updateData={data}
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