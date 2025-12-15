import getPolisDetails from "@/features/polis/actions/getPolisFormDetails";
import PolisNotFound from "@/app/dashboard/polis/[id]/edit/notFound";
import EditPolisForm from "@/features/polis/editPolis/EditPolisForm";

export default async function EditPolisPage({ params }: {params : Promise<{id: string}>}) {
    const { id } = await params;
    const result = await getPolisDetails(id);
    // If the fetch was not successful or data is missing, show the not found page.
    if (!result.success || !result.data) return <PolisNotFound message={result.message}/>;

    return (
        <div className="">
            <EditPolisForm data={result.data}/>
        </div>
    );
}