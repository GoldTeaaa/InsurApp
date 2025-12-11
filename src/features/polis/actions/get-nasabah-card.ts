"use server";
import { nasabahDetailsSchema, NasabahDetailsType } from "@/lib/polis/step1";
import { supabase } from "~/utils/supabase/client";
import { ActionReturnState } from "@/lib/types";
import z from "zod";

const id = z.string().uuid();
type Id = z.infer<typeof id>;

type ReturnState = ActionReturnState<NasabahDetailsType>;

export default async function getNasabahCardDetails(
  id: Id
): Promise<ReturnState> {
  const { data, error } = await supabase.rpc("polis_card_view_pribadi", {
    p_id: id,
  });
  if (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch nasabah details." };
  }

  const parsedData = nasabahDetailsSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Zod validation failed:", parsedData.error.flatten());
    return { success: false, message: "Invalid data structure from API." };
  }

  return { success: true, message: "Success", data: parsedData.data };
}
