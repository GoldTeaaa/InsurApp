    import { Card, CardContent } from "@/components/card";
    import getNasabahInEachPerusahaanForDetailTable from "../actions/getNasabahInEachPerusahaanForDetailTable";
    import { listNasabahInPerusahaanColumns } from "./ListNasabahInPerusahaancolumns";
    import UniversalTable from "@/components/UniversalTable";

    type Props = {
        id_perusahaan_asuransi: string
    }

    export default async function ListNasabahInPerusahaanAsuransiTable({
        id_perusahaan_asuransi
    }:Props) {

        const rawNasabahListData = await getNasabahInEachPerusahaanForDetailTable({id_perusahaan_asuransi});

        if (!rawNasabahListData.success) {
            throw new Error(rawNasabahListData.message);
        }

        const nasabahListData = rawNasabahListData.data ?? [];

        return (
            <Card>
                <CardContent className="p-0">
                    <UniversalTable
                        data={nasabahListData}
                        columns={listNasabahInPerusahaanColumns}
                        noResultText="Tidak ada nasabah pada perusahaan ini"
                    />
                </CardContent>
            </Card>
        )
    }