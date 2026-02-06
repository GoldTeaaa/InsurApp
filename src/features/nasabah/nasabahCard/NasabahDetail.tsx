import NasabahPersonalDetailCard from "./NasabahPersonalDetailCard";
import NasabahMainTableCard from "./NasabahMainTableCard";
import NasabahProfileCard from "./NasabahProfileCard";
import NasabahStatCard from "./NasabahStatCard";

export default function NasabahMainCard() {
    return (
        <div className="grid grid-cols-1 gap-4">
            <NasabahProfileCard />
            <div className="grid grid-cols-[6fr_4fr] gap-4">
                <NasabahStatCard />
                
                <NasabahPersonalDetailCard />
            </div>
            <NasabahMainTableCard />
        </div>
    );
}