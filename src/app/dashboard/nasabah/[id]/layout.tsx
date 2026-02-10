import BackButton from "@/components/BackButton";
import getNasabahDetails from "@/features/nasabah/actions/getNasabahDetails";
import NasabahDetail from "@/features/nasabah/nasabahCard/NasabahDetail";
import { NasabahFormType } from "@/lib/nasabah/type";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>,
    children: React.ReactNode
}

export default async function Layout({ params, children }: Props) {
    const { id } = await params;

    const detail = await getNasabahDetails(id);

    if (!detail.success) notFound();

    return (
        <div className="mx-auto w-full grid grid-cols-1 gap-4">
            <div className="p-4 space-y-4 ">
                <BackButton />

                <NasabahDetail
                    id={id}
                    initialData={detail.data as NasabahFormType}
                />

                {children}
            </div>
        </div>
    );
}