'use client';
import { useEffect, useState } from "react";
import KendaraanForm from "./KendaraanForm";
import SelectSearchField from "@/components/SelectSearchField";
import { PlusIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/button";
import getKendaraanList from "../actions/getKendaraanList";
import { KendaraanListType } from "@/lib/kendaraan/types";
import { useFormContext, useWatch } from "react-hook-form";
import { Polis } from "@/features/polis/schema/create-types";

export default function KendaraanSelectOrCreate() {

    const [tambahKendaraan, setTambahKendaraan] = useState<boolean>(false);
    const [kendaraanList, setKendaraanList] = useState<KendaraanListType>([]);

    const {
        control
    } = useFormContext<Polis>();

    useEffect(() => {
        const fetchKendaraaanList = async () => {
            const data = await getKendaraanList();
            if (!data.success) {
                setKendaraanList([]);
                console.error(data.message);
            }
            else {
                console.log(data.data);
                setKendaraanList(data.data ?? []);
            }
        }

        fetchKendaraaanList();
    }, [])

    // const kendaraanId = useWatch({
    //     control,
    //     name: ['']
    // });

    return (
        <div>
            <SelectSearchField
                name="kendaraan"
                label="Kendaraan"
                options={kendaraanList.map((kendaraan) => (
                    {
                        id: kendaraan.kendaraan_id,
                        value: kendaraan.plat_nomor
                    }
                ))}
            />

            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">Kendaraan tidak ditemukan?</p>
                            <p className="text-gray-500">Tambah Kendaraan</p>
                        </div>
                    </div>
                    <Button
                        className="group flex items-center gap-2 rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                        onClick={() => {
                            if (tambahKendaraan) {
                                setTambahKendaraan(false);
                            } else {
                                setTambahKendaraan(true);
                            }
                        }}
                    >
                        <PlusIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Tambah Kendaraan
                    </Button>
                </div>
            </div>

            {tambahKendaraan && <KendaraanForm />}
        </div>
    )
}