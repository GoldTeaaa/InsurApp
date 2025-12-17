"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type GeneralErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
};

export default function GeneralError({
  error,
  reset,
  title = "Something went wrong!",
}: GeneralErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {/* <p className="text-red-500 mb-6">{error.message}</p> */}
      <Button onClick={handleReset}>
        Try again
      </Button>
    </div>
  );
}