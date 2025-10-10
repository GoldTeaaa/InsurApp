"use server";
import { ListNasabah, type ListNasabahType } from "@/lib/polis/step1";
import { supabase } from "@/lib/supabase";

export default async function getListNasabah(): Promise<ListNasabahType[]> {
  const { data, error } = await supabase
    .from("nasabah")
    .select("id, value:nama")
    //   .ilike("full_name", `%${searchTerm}%`)
    .order("nama")
    .limit(100);

  if (error) throw new Error(error.message);

  const parsedData = ListNasabah.array().safeParse(data);
  
  return parsedData.success ? parsedData.data : [];
}
