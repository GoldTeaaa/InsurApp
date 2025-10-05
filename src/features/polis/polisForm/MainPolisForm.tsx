"use client"
import { useEffect, useState, useMemo, useRef } from "react";
import { FormProvider, Resolver, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/button";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { motion } from 'framer-motion'
import ReviewPolis from "./ReviewPolis";
import { getDefaultValues, Polis, PolisSchema } from "@/lib/polis/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "./useDebounce";
import FormErrors from "@/components/FormErrors";
import CoasPolisAction from "../actions/coas-polis-action";

const LOCAL_STORAGE_KEY = 'polisFormData';

const steps = [
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

const useIsFirstRender = () => {
    const isFirst = useRef(true);
    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}

export default function MainPolisForm() {
    const [previousStep, setPreviousStep] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const delta = currentStep - previousStep

    const getInitialValues = () => {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : getDefaultValues("non-coas");
        } catch (error) {
            console.error("Failed to parse form data from localStorage", error);
            return getDefaultValues("non-coas");
        }
    };

    const methods = useForm<Polis>({
        mode: 'all',
        resolver: zodResolver(PolisSchema) as Resolver<Polis>,
        defaultValues: getInitialValues(),
    });

    const {
        control,
        setValue,
        formState: { isSubmitting },
        trigger
    } = methods

    const watchedValues = useWatch({ control });
    const debouncedWatchedValues = useDebounce(watchedValues, 500);

    // Save to localStorage only when the debounced values change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(debouncedWatchedValues));
    }, [debouncedWatchedValues]);

    const jenisCoas = useWatch({
        control,
        name: "jenis_coas",
    })

    const isFirstRender = useIsFirstRender();

    useEffect(() => {
        // Prevent this from running on initial load to keep localStorage values
        // if (isFirstRender) return;

        const newDefaultValues = getDefaultValues(jenisCoas);

        // Use setValue to update a field array. This is the recommended approach
        // to avoid type conflicts that can occur with reset().
        // We set shouldValidate to true so changing the dropdown re-validates the shares.
        setValue('shares', newDefaultValues.shares);

    }, [jenisCoas, setValue, isFirstRender]);

    type FieldName = keyof Polis;

    const next = async () => {
        const field = steps[currentStep].fields;
        if (!field) {
            // For steps without validation, like the final review
            if (currentStep < steps.length - 1) {
                setPreviousStep(currentStep);
                setCurrentStep(step => step + 1);
            }
            return;
        }

        const output = await trigger(field as FieldName[], { shouldFocus: true })
        console.log("output: ", output)

        if (!output) return

        if (currentStep < steps.length - 1) {
            // if (currentStep === steps.length - 2) {
            //     await handleSubmit(processForm)()
            // }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }

    const submit = async (data: Polis) => {
        console.log("Form Data Submitted: ", data);
        const res = await CoasPolisAction(data);
        if(res.success){
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }else{
            alert(res.message);
        }
        // Clear localStorage after successful submission
    }

    const goTo = (stepIndex: number) => {
        setPreviousStep(currentStep);
        setCurrentStep(stepIndex);
    }

    return (
        <FormProvider {...methods} >
            <nav aria-label='Progress'>
                <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                    {steps.map((step, index) => (
                        <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <button
                                    type="button"
                                    className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 text-left transition-colors hover:border-sky-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                    onClick={() => goTo(index)}
                                >
                                    <span className='text-sm font-medium text-sky-600 transition-colors'>{step.id}</span>
                                    <span className='text-sm font-medium'>{step.name}</span>
                                </button>
                            ) : (
                                <div
                                    className={`flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${currentStep === index ? 'border-sky-600' : 'border-gray-200'
                                        }`}
                                    aria-current={currentStep === index ? 'step' : undefined}
                                >
                                    <span className={`text-sm font-medium ${currentStep === index ? 'text-sky-600' : 'text-gray-500'}`}>{step.id}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            <form onSubmit={methods.handleSubmit(submit)} className="max-w-4xl mx-auto space-y-6 p-4">
                <motion.div
                    key={currentStep} // Add key to ensure motion triggers on step change
                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {steps[currentStep].component}
                    {currentStep === steps.length - 1 && (
                        <div className="mt-8 flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">Submitting...</span>
                                ) : 'Submit Polis'}
                            </Button>
                        </div>
                    )}
                </motion.div>
            </form>
            <div className='mt-8 pt-5'>
                <div className='flex justify-between'>
                    <button
                        type='button'
                        onClick={prev}
                        disabled={currentStep === 0}
                        className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 19.5L8.25 12l7.5-7.5'
                            />
                        </svg>
                    </button>
                    <button
                        type='button'
                        onClick={next}
                        disabled={currentStep === steps.length - 1}
                        className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='h-6 w-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M8.25 4.5l7.5 7.5-7.5 7.5'
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="mt-4"> {/* HELPER UI, REMOVE WHEN FINISH*/}
                <FormErrors />
            </div>
        </FormProvider>
    );
}