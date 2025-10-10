// src/components/FormErrors.tsx (new file)
import { useFormContext } from "react-hook-form";

function ErrorList({ errors }: { errors: object }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {Object.entries(errors).map(([key, error]) => {
        if (!error) return null;

        // Handle nested errors (like in 'shares' array)
        if (error.message) {
          return (
            <li key={key}>
              <span className="font-semibold">{key}:</span> {error.message}
            </li>
          );
        }

        // Recurse for nested objects/arrays
        if (typeof error === 'object') {
          return (
            <li key={key}>
              <span className="font-semibold">{key}:</span>
              <ErrorList errors={error} />
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}


export default function FormErrors() {
  const { formState: { errors } } = useFormContext();

  if (Object.keys(errors).length === 0) {
    return null;
  }

  // The 'root' error is for superRefine issues without a specific path
  const rootError = errors.root?.message;

  return (
    <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
      <h3 className="mb-2 font-bold">Form Errors</h3>
      {rootError && <p className="mb-2">{rootError}</p>}
      <ErrorList errors={errors} />
    </div>
  );
}
