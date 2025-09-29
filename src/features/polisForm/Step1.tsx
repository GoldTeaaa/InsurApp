import SelectSearchField from "@/components/Select-Search-Field";
import { Polis } from "@/lib/polis/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { useEffect, useState } from "react";
import getListNasabah from "../polis/actions/get_nasabah_list";
import type { ListNasabahType, NasabahDetailsType } from "@/lib/polis/step-one";
import { useFormContext } from "react-hook-form";
import getNasabahCardDetails from "../polis/actions/get-nasabah-card";

function NasabahCard({ details }: { details: NasabahDetailsType }) {
    if (!details) return (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">Details Not Found...</h3>
        </div>
    );

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>{details.nama}</CardTitle>
                <CardDescription>Tipe Nasabah: {details.tipe}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><span className="font-medium text-gray-600">Alamat:</span> {details.alamat}</p>
                <p><span className="font-medium text-gray-600">Kontak:</span> {details.contact_1}</p>
                {details.pribadi && <p>
                    <span className="font-medium text-gray-600">Tanggal Lahir:</span> {new Date(details.pribadi.tanggal_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>}
                {details.perusahaan && <p>
                    <span className="font-medium text-gray-600">Nama PIC:</span> {details.perusahaan.nama_pic}
                </p>}
            </CardContent>
        </Card>
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
            } else {
                setNasabahDetails(null);
            }
        }

        fetchNasabahDetails();
    }, [selectedNasabahId]);

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Pilih Nasabah</h2>
            <div>
                <SelectSearchField<Polis>
                    name='id_nasabah'
                    label='Nasabah'
                    options={nasabahList}
                />
            </div>
            {nasabahDetails && !notFound && <NasabahCard details={nasabahDetails} />}
            {notFound && (
                <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
                    <p className="font-medium">Detail nasabah tidak ditemukan.</p>
                </div>
            )}
        </section>
    );
}