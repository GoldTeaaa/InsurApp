'use client';
import NasabahPersonalDetailCard from "./NasabahPersonalDetailCard";
import NasabahMainTableCard from "./NasabahMainTableCard";
import NasabahProfileCard from "./NasabahProfileCard";
import NasabahStatCard from "./NasabahStatCard";
import { deleteNasabahAction } from "../actions/deleteNasabah";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
    id: string
}

export default function NasabahDetail({
    id
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
        <div className="mx-auto w-[60%] grid grid-cols-1 gap-4">
            <NasabahProfileCard 
                id={id}
                handleDelete={handleDelete}
            />
            <div className="grid grid-cols-[6fr_4fr] gap-4">
                <NasabahStatCard />
                
                <NasabahPersonalDetailCard />
            </div>
            <NasabahMainTableCard />
        </div>
    );
}