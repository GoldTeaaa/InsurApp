import Search from "@/components/Search";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import PolisJenisBisnisSelect from "./PolisJenisBisnisSelect";
import Toggle from "@/components/Toggle";
import { jenis_coas } from "@/lib/types";

export default function PolisFilterBox(){

    return(
        <div className="flex flex-col md:flex-row items-end gap-4 rounded-lg border bg-white p-4 shadow-sm w-full">
            {/* Search Bar - 50% width */}
            <div className="w-full md:w-1/2">
                <Search search="" placeholder="Cari..." />
            </div>
            
            {/* Date Picker - 25% width */}
            <div className="w-full md:w-1/4">
                <DatePickerWithRange name="Tanggal Dibuat" />
            </div>
            
            {/* Select and Toggle - remaining 25% width */}
            <div className="flex w-full md:w-1/4 flex-row items-center gap-4">
                <div className="flex-1">
                    <PolisJenisBisnisSelect />
                </div>
                <div className="flex-shrink-0">
                    <Toggle value={jenis_coas} />
                </div>
            </div>
        </div>
    )
}