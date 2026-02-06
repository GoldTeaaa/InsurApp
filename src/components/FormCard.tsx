import { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
};

export default function FormCard({ title, description, children, className = "" }: Props) {
    return (
        // {/* <div className={`rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`}> */}
        <div className={`${className}`}>
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <div className="p-6 pt-0">{children}</div>
        </div>
    );
}