"use server";

import { RefinedViewPolisSchema, ViewPolisSchema } from "@/lib/polis/get-types";
import { createClient } from "~/utils/supabase/server";
import { ActionReturnState } from "@/lib/types";
import { z } from "zod";

type UpdatePolisData = z.infer<typeof ViewPolisSchema>;
type ReturnState = ActionReturnState<UpdatePolisData>;

export default async function updatePolis(
  formData: UpdatePolisData
): Promise<ReturnState> {
  const supabase = await createClient();
  const parsedData = RefinedViewPolisSchema.safeParse(formData);
  console.log("parsed Update Data: ", parsedData);

  if (!parsedData.success) {
    return {
      success: false,
      message: "Invalid data format.",
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  console.log("Updated Polis Data:", parsedData.data);
  const { data, error } = await supabase.rpc("update_polis_details", {
    payload: parsedData.data,
  });
  if (error) {
    return {
      success: false,
      message: "Failed to update polis details.",
    };
  }

  return { 
    success: true, 
    message: "Polis updated successfully."
  };
}
