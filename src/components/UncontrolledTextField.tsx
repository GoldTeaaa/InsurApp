import React from "react";

type Props = {
    label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function UncontrolledTextField({ label, id, ...props }: Props) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                {...props}
                className={[
                    "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none",
                    "focus:border-blue-600 focus:ring-1 focus:ring-blue-600",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
            />
            {/* Note: This component does not display validation errors from react-hook-form */}
        </div>
    );
}

