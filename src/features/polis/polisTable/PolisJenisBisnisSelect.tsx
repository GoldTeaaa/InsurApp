import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { jenis_bisnis } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";

export default function PolisJenisBisnisSelect() {
    return (
        <Select>
            <SelectTrigger className="w-full">        
                <SelectValue placeholder="Pilih Jenis Bisnis"/>
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