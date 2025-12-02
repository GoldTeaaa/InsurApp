"use server"
import { ActionReturnState } from "@/lib/types";
import { supabase } from "~/utils/supabase/client";
import { PolisSchema, type Polis } from "@/lib/polis/create-types";

type ReturnState = ActionReturnState<Polis>;

export default async function createPolis(formData: Polis): Promise<ReturnState> {
  const parsedData = PolisSchema.safeParse(formData);
  if (!parsedData.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  const args = parsedData.data;
  console.log('args: ', args);
  console.log('args SHARES: ', args.shares);

  if(formData.jenis_coas === 'non-coas'){
    const { data, error } = await supabase.rpc('create_non_coas_polis', {
      payload: args
    })
    if(error) console.error(error)
    else console.log(data)
  }else if(formData.jenis_coas === 'coas'){
    const { data, error } = await supabase.rpc('create_coas_polis', {
      payload: args
    })
    if(error) console.error(error)
    else console.log(data)
  }


  return {
    success: true,
    message: "Success",
    data: formData,
  };
}
