import SelectSearchField from "@/components/SelectSearchField";
import { Polis } from "@/lib/polis/create-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { useEffect, useState } from "react";
import getListNasabah from "@/features/polis/actions/get-nasabah-list";
import type { ListNasabahType, NasabahDetailsType } from "@/lib/polis/step1";
import { useFormContext, useWatch } from "react-hook-form";
import getNasabahCardDetails from "@/features/polis/actions/get-nasabah-card";
import {
    CakeIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { SelectField } from "@/components/SelectField";

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <div className="text-sm">
                <p className="font-medium text-gray-500">{label}</p>
                <p className="text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function NasabahCard({ details }: { details: NasabahDetailsType }) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>{details.nama}</CardTitle>
                <CardDescription>Tipe Nasabah: {details.tipe}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <DetailItem icon={MapPinIcon} label="Alamat" value={details.alamat} />
                <DetailItem icon={PhoneIcon} label="Kontak" value={details.contact_1} />
                {details.pribadi && (
                    <DetailItem icon={CakeIcon} label="Tanggal Lahir" value={new Date(details.pribadi.tanggal_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
                )}
                {details.perusahaan && (
                    <DetailItem icon={UserIcon} label="Nama PIC" value={details.perusahaan.nama_pic} />
                )}
            </CardContent>
        </Card>
    );
}

export default function Step1() {
    const [nasabahList, setNasabahList] = useState<ListNasabahType[]>([]);
    const [nasabahDetails, setNasabahDetails] = useState<NasabahDetailsType | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const {
        control,
    } = useFormContext<Polis>();

    //List for nasabah SelectSearchField
    useEffect(() => {
        async function fetchNasabahList() {
            const list = await getListNasabah();
            setNasabahList(list);
        }
        fetchNasabahList();
    }, []);

    const selectedNasabahId = useWatch({
        control,
        name: 'id_nasabah',
        defaultValue: ''
    })

    useEffect(() => {
        async function fetchNasabahDetails() {
            if (selectedNasabahId) {
                setLoadingDetails(true);
                const result = await getNasabahCardDetails(selectedNasabahId);
                if (result.success) {
                    setNotFound(false);
                    setNasabahDetails(result.data ?? null);
                } else {
                    setNasabahDetails(null);
                    setNotFound(true);
                }
                setLoadingDetails(false);
            } else {
                setNasabahDetails(null);
            }
        }

        fetchNasabahDetails();
    }, [selectedNasabahId]);

    return (
        <section className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Pilih Nasabah</h2>
            <div>
                <div>
                    <SelectSearchField<Polis>
                        name='id_nasabah'
                        label='Nasabah'
                        options={nasabahList}
                    />
                </div>
                <div>
                    {loadingDetails && <p className="mt-6 text-sm text-gray-500">Loading details...</p>}
                    {nasabahDetails && !notFound && <NasabahCard details={nasabahDetails} />}
                    {notFound && (
                        <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
                            <p className="font-medium">Detail nasabah tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
            <SelectField<Polis>
                name='bisnis'
                label="Bisnis"
                options={["kendaraan", "health"]}
            />
        </section>
    );
}