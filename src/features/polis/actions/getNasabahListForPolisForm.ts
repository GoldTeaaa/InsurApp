"use server";
import { ListNasabah, type ListNasabahType } from "@/lib/polis/step1";
import { createClient } from "~/utils/supabase/server";

export default async function getListNasabah(): Promise<ListNasabahType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nasabah")
    .select("id, nama")
    //   .ilike("full_name", `%${searchTerm}%`)
    .order("nama")
    .limit(100);

  if (error) throw new Error(error.message);

  const parsedData = ListNasabah.array().safeParse(data);
  
  return parsedData.success ? parsedData.data : [];
}
