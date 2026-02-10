'use client';
import NasabahPersonalDetailCard from "./NasabahPersonalDetailCard";
import NasabahProfileCard from "./NasabahProfileCard";
import NasabahStatCard from "./NasabahStatCard";
import { deleteNasabahAction } from "../actions/deleteNasabah";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NasabahFormType } from "@/lib/nasabah/type";

type Props = {
    id: string;
    initialData: NasabahFormType;
}

export default function NasabahDetail({
    id,
    initialData
}: Props) {

    const router = useRouter();

    // const handleEdit = (id: string) => {
    //     try{

    //     }
    // }

    async function handleDelete(id: string){
        try{
            const result = await deleteNasabahAction(id);
            if(result.success){
              router.refresh();
              toast.success(result.message);
            }
          }catch(e){
            console.error(e);
          }
    }

    return (
        <div className="mx-auto grid grid-cols-1 gap-4">
            <NasabahProfileCard 
                id={id}
                data={initialData}
                handleDelete={handleDelete}
            />
            <div className="grid grid-cols-[6fr_4fr] gap-4">
                <NasabahStatCard />
                
                <NasabahPersonalDetailCard
                    data = {initialData}
                />
            </div>
        </div>
    );
}