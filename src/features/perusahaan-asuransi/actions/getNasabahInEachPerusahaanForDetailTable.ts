import {
  type ListOfNasabahInPerusahaanTableCardType,
  ListOfNasabahInPerusahaanTableCardSchema,
} from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";
import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type ReturnState = ActionReturnState<ListOfNasabahInPerusahaanTableCardType>;

type Props = {
  id_perusahaan_asuransi: string;
};

export default async function getNasabahInEachPerusahaanForDetailTable({
  id_perusahaan_asuransi,
}: Props): Promise<ReturnState> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("v_list_nasabah_pada_perusahaan")
    .select("*")
    .eq("id_perusahaan_asuransi", id_perusahaan_asuransi);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  console.log('list nasabah pada perusahaan: ', data, 'dengan id: ', id_perusahaan_asuransi);

  const parsedData = ListOfNasabahInPerusahaanTableCardSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: parsedData.error.message,
    };
  }

  return {
    success: true,
    message: "Success",
    data: parsedData.data,
  };
}
