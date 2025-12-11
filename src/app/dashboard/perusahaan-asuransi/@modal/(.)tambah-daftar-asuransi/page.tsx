// import CreatePerusahaanForm from "@/features/perusahaan-asuransi/create-form";
import PerusahaanAsuransiForm from "@/features/perusahaan-asuransi/PerusahaanAsuransiForm";
import RouteModal from "@/components/RouteModal";

export default function Page() {
    return (
        <RouteModal
            title="Tambah Perusahaan Asuransi"
            className="sm:max-w-[900px]"
        >
            <PerusahaanAsuransiForm mode="create" />
        </RouteModal>
    );
}