import React from "react";
import { Input } from "@/components/ui/input"

type Props = {
    label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function UncontrolledTextField({ label, id, ...props }: Props) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <Input
                id={id}
                {...props}
            />
            {/* Note: This component does not display validation errors from react-hook-form as it's "uncontrolled" in that aspect. */}
        </div>
    );
}
