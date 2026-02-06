'use client';
import { Card } from "@/components/card";
import { PerusahaanFormType } from "@/lib/perusahaan_asuransi/types";
import { Building2, MapPin, Mail, Phone } from "lucide-react";
import { useState } from "react";
import DrawerEditPerusahaanAsuransi from "./DrawerEditPerusahaanAsuransi";
import DeleteDialog from "@/components/DeleteDialog";
import deletePerusahaanAsuransiAction from "../actions/deletePerusahaan";
import { useRouter } from "next/navigation"
import { toast } from "sonner";

interface InfoCardProps extends PerusahaanFormType {
    id: string;
}

export default function InfoCard({
    id,
    nama,
    email,
    alamat,
    kontak_1,
    kontak_2,
}: InfoCardProps) {

    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deletePerusahaanAsuransiAction(id);
            if (result.success) {
                router.refresh();
                toast.success(result.message);
                router.back();
            }
            else {
                toast.error(result.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const data = {
        nama,
        email,
        alamat,
        kontak_1,
        kontak_2,
    };


    return (
        <div>
            <Card className="w-full bg-white shadow-sm border-slate-200 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Left Section: Company Logo Avatar */}
                    <div className="shrink-0">
                        <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            {/* TODO: Replace with company logo */}
                            <Building2 className="h-10 w-10" />
                        </div>
                    </div>

                    {/* Center Section: Company Information */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                                {nama}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                            {alamat && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="truncate max-w-xs">{alamat}</span>
                                </div>
                            )}

                            {email && (
                                <div className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <a href={`mailto:${email}`} className="hover:text-blue-600 transition-colors">
                                        {email}
                                    </a>
                                </div>
                            )}

                            {kontak_1 && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{kontak_1}</span> {   kontak_2 && <span> / {kontak_2}</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Action Buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">

                        <DrawerEditPerusahaanAsuransi
                            id={id}
                            data={data}
                        />

                        <DeleteDialog
                            id={id}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}