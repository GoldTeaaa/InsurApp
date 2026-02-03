import { Card } from "@/components/card";
import { PerusahaanFormType } from "@/lib/perusahaan_asuransi/types";
import { Building2, MapPin, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface InfoCardProps extends PerusahaanFormType {
    id: string;
}

export default function InfoCard({
    id,
    nama,
    email,
    alamat,
    kontak_1,
    kontak_2
}: InfoCardProps) {
    return (
        <Card className="w-full bg-white shadow-sm border-slate-200 overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Left Section: Company Logo Avatar */}
                <div className="shrink-0">
                    <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
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
                                <span>{kontak_1}</span>
                            </div>
                        )}

                        {kontak_2 && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span>{kontak_2}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <Link href={`/dashboard/perusahaan-asuransi/${id}/edit`}>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                    </Link>
                    
                    <button className="flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-all shadow-sm">
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </Card>
    );
}