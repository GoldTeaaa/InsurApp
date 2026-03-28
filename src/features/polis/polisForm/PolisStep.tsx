import { Polis } from "@/features/polis/schema/create-types"
import { JSX } from "react"
import { Path } from "react-hook-form"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import ReviewPolis from "./ReviewPolis"

interface StepsProps {
    id: string,
    name: string,
    component: JSX.Element,
    fields?: (Path<Polis>)[]
}

export const steps: StepsProps[] = [
    {
        id: 'Step 1',
        name: 'Data Nasabah',
        component: <Step1 />,
        fields: ['id_nasabah', 'bisnis']
    },
    {
        id: 'Step 2',
        name: 'Detail Polis',
        component: <Step2 />,
        fields: ['nomor_polis', 'total_premi', 'periode_mulai', 'periode_akhir', 'jenis_coas', 'total_sum_insured', 'nilai_rate', 'jenis_rate']
    },
    {
        id: 'Step 3',
        name: 'Premi & Share',
        component: <Step3 />,
        fields: ['shares']
    },
    {
        id: 'Step 4',
        name: 'Review & Submit',
        component: <ReviewPolis />
    }
]