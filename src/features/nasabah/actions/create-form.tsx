import { NasabahForm } from "@/lib/nasabah/type";
import { ActionReturnState } from "@/lib/types";

type ReturnState = ActionReturnState<NasabahForm>;

export function createNasabahAction(formData: NasabahForm): Promise<ReturnState> {
    console.log("formData: ", formData);
    alert("success");

    return Promise.resolve({
        success: true,
        message: `Berhasil menyimpan nasabah ${formData.nama}`,
    });
}

// nasabah_create_perusahaan_v1
// nasabah_create_pribadi_v1
