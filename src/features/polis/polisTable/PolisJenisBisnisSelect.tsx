import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { jenis_bisnis } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";

type Props = {
    value: string;
    onChange: (value: string) => void;
}

export default function PolisJenisBisnisSelect({
    value,
    onChange
}: Props) {
    return (
        <Select
            value={value || undefined}
            onValueChange={(value) => {
                onChange(value);
                console.log("selected value for jenis_bisnis: ", value);
            }}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jenis Bisnis" />
            </SelectTrigger>
            <SelectContent>
                {
                    jenis_bisnis.map((bisnis) => (
                        <SelectItem key={bisnis} value={bisnis}>
                            {bisnis}
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    );
}