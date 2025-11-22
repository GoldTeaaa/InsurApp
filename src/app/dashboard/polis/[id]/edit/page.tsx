import getPolisDetails from "@/features/polis/actions/get-polis-details";
import PolisNotFound from "@/app/dashboard/polis/[id]/edit/notFound";
import EditPolisForm from "@/features/polis/editPolis/EditPolisForm";

type Props = {
    params: { id: string };
};

export default async function EditPolisPage({ params }: Props) {
    const { id } = await params;
    const result = await getPolisDetails(id);
    // If the fetch was not successful or data is missing, show the not found page.
    if (!result.success || !result.data) return <PolisNotFound message={result.message}/>;

    return (
        <div className="">
            {/* <pre className="p-4">{JSON.stringify(result.data, null, 2)}</pre> */}
            <EditPolisForm data={result.data}/>
        </div>
    );
}