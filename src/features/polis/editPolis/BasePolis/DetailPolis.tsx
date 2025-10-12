'use client';
import SelectSearchField from "@/components/SelectSearchField";
import TextField from "@/components/TextField";
import { Polis } from "@/lib/polis/create-types";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ListNasabahType } from "@/lib/polis/step1";
import getListNasabah from "@/features/polis/actions/get-nasabah-list";
import PremiCalculationGroup from "../../polisForm/PremiCalculationGroup";
import DateField from "@/components/DateField";
import { SelectField } from "@/components/SelectField";

export default function DetailPolis() {
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [nasabahList, setNasabahList] = useState<ListNasabahType[]>([]);

    const {
        control,
    } = useFormContext<Polis>();

    const [selectedNasabahId, jenis_coas, nomor_polis] = useWatch({
        control,
        name: ['id_nasabah', 'jenis_coas', 'nomor_polis'],
    })

    useEffect(() => {
        async function fetchNasabahList() {
            const list = await getListNasabah();
            setNasabahList(list);
        }
        fetchNasabahList();
    }, []);

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">
                Polis {nomor_polis}
            </h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                    <TextField<Polis>
                        name="nomor_polis"
                        label="Nomor Polis"
                    />
                    <SelectSearchField<Polis>
                        name='id_nasabah'
                        label='Nasabah'
                        options={nasabahList}
                    />
                    <TextField<Polis>
                        name="jenis_coas"
                        label="Jenis Coas"
                        disabled
                    />
                    <SelectField<Polis>
                        name='bisnis'
                        label="Bisnis"
                        options={["kendaraan", "health"]}
                    />
                    <div className="space-y-4 rounded-md border border-gray-200 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Periode Polis</h3>
                        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
                            <DateField<Polis>
                                name='periode_mulai'
                                label="Tanggal Mulai"
                            />
                            <DateField<Polis>
                                name='periode_akhir'
                                label="Tanggal Akhir"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <PremiCalculationGroup />
                </div>
            </div>
        </div>
    );
}