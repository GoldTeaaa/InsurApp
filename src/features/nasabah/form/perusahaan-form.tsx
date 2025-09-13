import { NasabahForm } from "@/lib/nasabah/type";
import { useFormContext } from "react-hook-form";

export default function PerusahaanForm() {

    const { control } = useFormContext<NasabahForm>();

    return (
        <div>
            <h1>Perusahaan Form</h1>
        </div>
    )
}