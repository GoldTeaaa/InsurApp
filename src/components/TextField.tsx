import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    must?: boolean;
    type?: "text" | "number" | "hidden" | "password" | "hidden";
    placeholder?: string;
    step?: string;
    min?: string;
    max?: string;
    readOnly?: boolean;
    disabled?: boolean;
    value?: string;
    precision?: number;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormTextField<T extends FieldValues>({
    name, label, placeholder, type, step, readOnly, disabled, value, must, precision,...props
}: Props<T>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <div className="grid gap-2">
                        <Label htmlFor={name}>
                            {type === "hidden" ? "" : label}{must && <span className="text-red-600">*</span>}
                        </Label>

                        {readOnly && <p className="text-blue-600 text-sm mt-1">Tidak bisa diubah</p>}
                        <Input
                            {...field}
                            {...props}
                            value={field.value ?? (value ?? "")}
                            onChange={(e) => {
                                //Wrap to number for 
                                if (type === 'number') {
                                    field.onChange(Number(e.target.value));
                                } else {
                                    field.onChange(e.target.value);
                                }
                            }}
                            aria-invalid={!!error}
                            type={type}
                            step={step}
                            min={props.min}
                            max={props.max}
                            readOnly={readOnly}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={[
                                "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none",
                                "focus:border-blue-600 focus:ring-1 focus:ring-blue-600",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                            ].join(" ")}
                            {...props}
                        />
                        {error && <p className="text-red-600">{error.message}</p>}
                    </div>
                </div>
            )}
        />
    )
}