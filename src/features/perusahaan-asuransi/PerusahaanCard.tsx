'use client';
import { useEffect, useState } from "react";
import fetchPerusahaanCard from "./actions/fetchPerusahaanCard";
import { PerusahaanCardType } from "@/lib/perusahaan_asuransi/types/perusahaan-card-data";

export default function PerusahaanCard(){
    const [cardData, setCardData] = useState<PerusahaanCardType>();

    useEffect(() => {
        const fetchCardData = async () => {
            const data = await fetchPerusahaanCard();

            if(data.success === false) return;

            setCardData(data.data);
            console.log("data: ", data);
        }

        fetchCardData();
    }, []);
    
    return(
        <div>
            {JSON.stringify(cardData)}
        </div>
    )
}