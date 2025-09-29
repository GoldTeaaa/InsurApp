import SelectSearchField from "@/components/Select-Search-Field";
import { Polis } from "@/lib/polis/types";
import { useEffect } from "react";
import getListNasabah from "../polis/actions/get_nasabah_list";
import type { ListNasabahType, NasabahDetailsType } from "@/lib/polis/step-one";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import getNasabahCardDetails from "../polis/actions/get-nasabah-card";

function NasabahCard({ details }: { details: NasabahDetailsType }) {
    if (!details) return (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">Details Not Found...</h3>
        </div>
    );

    return (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">{details.nama}</h3>
            <p className="text-sm text-gray-600">Tipe Nasabah: {details.tipe}</p>
            <p className="text-sm text-gray-600">Alamat : {details.alamat}</p>
            <p className="text-sm text-gray-600">Contact 1: {details.contact_1}</p>
            {details.pribadi && <p className="text-sm text-gray-600">
                Tanggal Lahir: {new Date(details.pribadi.tanggal_lahir).toLocaleDateString()}
            </p>}
            {details.perusahaan && <p className="text-sm text-gray-600">
                Nama PIC: {details.perusahaan.nama_pic}
            </p>}
        </div>
    );
}

export default function Step1() {
    const [nasabahList, setNasabahList] = useState<ListNasabahType[]>([]);
    const [nasabahDetails, setNasabahDetails] = useState<NasabahDetailsType | null>(null);
    const [notFound, setNotFound] = useState(false);

    const {
        watch
    } = useFormContext();

    //List for nasabah SelectSearchField
    useEffect(() => {
        async function fetchNasabahList() {
            const list = await getListNasabah();
            setNasabahList(list);
        }
        fetchNasabahList();
    }, []);

    const selectedNasabahId = watch('id_nasabah');

    useEffect(() => {
        async function fetchNasabahDetails() {
            if (selectedNasabahId) {
                const result = await getNasabahCardDetails(selectedNasabahId);
                if (result.success) {
                    setNotFound(false);
                    setNasabahDetails(result.data ?? null);
                } else {
                    setNasabahDetails(null);
                    setNotFound(true);
                }
                console.log("id nasabah", selectedNasabahId);
                console.log("details: ", result);
                console.log("nasabah details: ", nasabahDetails);
            } else {
                setNasabahDetails(null);
            }
        }

        fetchNasabahDetails();
    }, [selectedNasabahId]);

    return (
        <div>
            <div>
                <SelectSearchField<Polis>
                    name='id_nasabah'
                    label='Nasabah'
                    options={nasabahList}
                />
            </div>
            {nasabahDetails && <NasabahCard details={nasabahDetails} />}
            {notFound && (
                <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50 text-red-500">
                    <h3 className="text-lg font-semibold">Details Not Found...</h3>
                </div>
            )}
        </div>
    );
}