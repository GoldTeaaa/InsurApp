export default async function page({ searchParams }: { searchParams: Promise<{ id: string }> }) {

    const { id } = await searchParams;

    return(
        <h1>{id}</h1>
    )
}