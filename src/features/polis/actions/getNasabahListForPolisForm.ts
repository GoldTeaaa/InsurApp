"use server";
import { ListNasabah, type ListNasabahType } from "@/lib/polis/step1";
import { createClient } from "~/utils/supabase/server";

export default async function getListNasabah(): Promise<ListNasabahType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nasabah")
    .select("id, nama")
    .order("nama")
    .limit(100)
    .is("deleted_at", null);

  if (error) throw new Error(error.message);

  const parsedData = ListNasabah.array().safeParse(data);
  
  return parsedData.success ? parsedData.data : [];
}
