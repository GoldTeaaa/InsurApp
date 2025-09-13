import { NasabahForm } from "@/lib/nasabah/type";
import { useFormContext } from "react-hook-form";

export default function PribadiForm() {

    const {
        control
    } = useFormContext<NasabahForm>();

    return (
        <div>
            <h1>Pribadi Form</h1>
        </div>
    )
}