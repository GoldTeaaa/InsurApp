'use client';
import SelectSearchField from "@/components/SelectSearchField";
import { Polis } from "@/features/polis/schema/create-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { useEffect, useState } from "react";
import getListNasabah from "@/features/polis/actions/getNasabahListForPolisForm";
import type { ListNasabahType, NasabahDetailsType } from "@/features/polis/schema/step1";
import { useFormContext, useWatch } from "react-hook-form";
import getNasabahCardDetails from "@/features/polis/actions/getNasabahForPolisCard";
import {
    CakeIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { SelectField } from "@/components/SelectField";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import KendaraanSelectOrCreate from "../kendaraan/KendaraanSelectOrCreate";
import KendaraanForm from "../kendaraan/KendaraanForm";

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

    const [selectedNasabahId, bisnis] = useWatch({
        control,
        name: ['id_nasabah', 'bisnis'],
    });

    useEffect(() => {
        async function fetchNasabahDetails() {
            if (selectedNasabahId) {
                setLoadingDetails(true);
                const result = await getNasabahCardDetails(selectedNasabahId);
                console.log("nasabah details", result);
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
                        must={true}
                    />
                </div>
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">Nasabah tidak ditemukan?</p>
                                <p className="text-gray-500">Buat data nasabah baru untuk melanjutkan.</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/nasabah/tambah-nasabah"
                            className="group flex items-center gap-2 rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                        >
                            <PlusIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            Tambah Nasabah
                        </Link>
                    </div>
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
                must={true}
            />
            {bisnis === "kendaraan" && (
                <div className="border-t border-gray-200 pt-6">
                    {/* <KendaraanSelectOrCreate /> */}
                    <KendaraanForm />
                </div>
            )}
        </section>
    );
}