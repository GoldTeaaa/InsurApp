import PolisNotFound from "@/app/dashboard/polis/[id]/edit/notFound";

export default async function EditPolis({ params }: { params: { id: string } }) {
    const id = await params.id;
    if (!id) return PolisNotFound();

    return (
        <div>
            <p>{id}</p>
        </div>
    )
}