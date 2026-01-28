"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { FormProvider, Resolver, useForm, useWatch, FieldErrors, Path } from "react-hook-form";
import { Button } from "@/components/button";
import { motion } from 'framer-motion'
import { kendaraanSchema, healthSchema, lifeSchema, marineSchema, propertySchema, Polis, PolisSchema } from "@/lib/polis/create-types";
import { getDefaultValues } from "@/lib/polis/defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/lib/utils/useDebounce";
import ErrorToast from "@/features/polis/polisForm/ErrorToast";
import createPolis from "@/features/polis/actions/createPolis";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { steps } from "./PolisStep";

const LOCAL_STORAGE_KEY = 'polisFormData';

const getBisnisDetailsDefaultValue = (bisnis : string) => {
    switch(bisnis){
        case 'kendaraan':
            return {
                bisnis: 'kendaraan',
                plat_nomor: '',
                jenis_kendaraan: 'mobil',
                merk: '',
                model: '',
                tahun: undefined
            };
        case 'health':
            return { bisnis: 'health' };
        case 'life':
            return { bisnis: 'life' };
        case 'marine':
            return { bisnis: 'marine' };
        case 'property':
            return { bisnis: 'property' };
        default:
            return {bisnis}
    }
}

export default function MainPolisForm() {
    const router = useRouter();
    const [previousStep, setPreviousStep] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [toastErrors, setToastErrors] = useState<FieldErrors<Polis> | null>(null);
    const [fieldToModify, setFieldToModify] = useState<(Path<Polis>)[]>(steps[currentStep].fields || []);
    const [isInitialized, setIsInitialized] = useState(false);

    const delta = currentStep - previousStep;

    const methods = useForm<Polis>({
        mode: 'all',
        resolver: zodResolver(PolisSchema) as Resolver<Polis>,
        defaultValues: getDefaultValues('non-coas'),
    });

    const {
        control,
        setValue,
        getValues,
        formState: { isSubmitting, errors },
        trigger,
        reset
    } = methods

    const watchedValues = useWatch({ control });
    const debouncedWatchedValues = useDebounce(watchedValues, 500);

    // LOCAL STORAGE STARTS HERE

    // Load data from localStorage on mount (Client side only)
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                reset(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to parse form data from localStorage", error);
        } finally {
            setIsInitialized(true);
        }
    }, [reset]);

    // Save to localStorage only when the debounced values change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(debouncedWatchedValues));
        }
        // We exclude isInitialized from deps to prevent saving stale defaults when the flag flips
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedWatchedValues]);

    // VALIDATIONS STARTS HERE

    const [jenisCoas, bisnis] = useWatch({
        control,
        name: ["jenis_coas", "bisnis"],
    })

    useEffect(() => {
        if (bisnis) {
            const currentDetails = getValues('bisnis_details');
            if (currentDetails?.bisnis !== bisnis) {
                setValue('bisnis_details', getBisnisDetailsDefaultValue(bisnis) as Polis['bisnis_details']);
            }
        }
    }, [bisnis, setValue, getValues]);

    useEffect(() => {
        // Check if the current shares structure already matches the selected jenisCoas
        // This prevents overwriting data loaded from localStorage with defaults
        const currentShares = getValues('shares');
        const isCoas = jenisCoas === 'coas';
        const isArray = Array.isArray(currentShares);

        // If the structure matches the type, assume it's correct (either loaded from storage or already set)
        if (isCoas === isArray) return;

        const newDefaultValues = getDefaultValues(jenisCoas);
        setValue('shares', newDefaultValues.shares);
    }, [jenisCoas, setValue, getValues]);

    useEffect(() => {
        const fieldsForCurrentStep = steps[currentStep].fields ? [...steps[currentStep].fields] : [];
        // const fieldsForCurrentStep = steps[currentStep].fields ?? [];

        if (currentStep === 0) {
            if (bisnis === 'kendaraan') {
                fieldsForCurrentStep.push('bisnis_details');
            }
            // If 'bisnis' is not 'kendaraan', we do nothing, and the original fields are used.
        }
        setFieldToModify(fieldsForCurrentStep);
    }, [bisnis, currentStep]); // This effect now correctly manages the fields to be validated.

    const next = async () => {
        const output = await trigger(fieldToModify, { shouldFocus: true })
        console.log("output: ", output)

        if (!output) {
            setToastErrors(errors);
            return;
        }

        if (currentStep < steps.length - 1) {
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

    const goTo = (stepIndex: number) => {
        setPreviousStep(currentStep);
        setCurrentStep(stepIndex);
    }

    const submit = async (data: Polis) => {
        const res = await createPolis(data);
        console.log("Submit FORM");

        if (res.success) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            toast.success('Polis Berhasil Ditambahkan')
            router.push('/dashboard/polis');
        } else {
            toast.error(res.message);
        }
    }

    const onError = (errors: FieldErrors<Polis>) => {
        setToastErrors(errors);
    }

    return (
        <FormProvider {...methods} >
            <ErrorToast
                errors={toastErrors}
                onClose={() => setToastErrors(null)}
            />
            <div className="flex gap-4">
                <Link href={'/dashboard/polis'} className="flex items-center">
                    <ArrowLeftIcon className="w-5" />
                </Link>
                <h1 className="text-2xl font-bold">Tambah Polis</h1>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
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
                <form onSubmit={methods.handleSubmit(submit, onError)} className="max-w-4xl mx-auto space-y-6 p-4">
                    <motion.div
                        key={currentStep} // Add key to ensure motion triggers on step change
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {steps[currentStep].component}
                        {currentStep === steps.length - 1 && (
                            <div className="mt-8 flex justify-end">
                                <Button
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
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
                            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2'
                        >
                            <p className="text-2xl">BACK</p>
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
                            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2'
                        >
                            <p className="text-2xl">NEXT</p>
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
            </div>
        </FormProvider>
    );
}