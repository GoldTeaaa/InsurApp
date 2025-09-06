import { div } from "framer-motion/client";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <p>Dashboard Polis</p>
            <Link
                href={"/dashboard/polis/create-polis"}
            >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Buat Polis
                </button>
            </Link>
        </div>
    );
}