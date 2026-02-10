import DeleteDialog from "@/components/DeleteDialog";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NasabahEditDrawer from "./NasabahEditDrawer";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { NasabahFormType } from "@/lib/nasabah/type";
import CopyableValue from "@/components/CopyableField";

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

  const { nama, contact_1, contact_2, tipe, email } = data;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg">{nama}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                <span className="font-light capitalize text-foreground">Tipe: {tipe}</span>
                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1">
                  <span>Kontak 1:</span>
                  <CopyableValue value={contact_1} />
                </div>

                <span>Kontak 2:</span>
                <section>
                  {contact_2 ? (
                    <div className="flex items-center gap-1">
                      <CopyableValue value={contact_2} />
                    </div>
                  ) : <span className="font-bold">-</span>}
                </section>
                <Separator orientation="vertical" className="h-4" />

                <section className="flex items-center gap-1">
                  <span className="flex items-center">Email: </span>
                  <CopyableValue value={email} />
                </section>
              </div>
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