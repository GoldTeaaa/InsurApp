import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signin, signup } from "./AuthActions";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormValues, authSchema, signinDefaultValues, signupDefaultValues } from "./types";
import FormTextField from "@/components/TextField";

type LoginFormProps = {
  mode?: "signin" | "signup";
};

export function AuthForm({
  mode = "signin",
}: LoginFormProps) {
  const [response, setResponse] = useState<{ error?: string | null; message?: string | null }>({});
  const defaultValues = mode === "signin" ? signinDefaultValues : signupDefaultValues;

  const methods = useForm<AuthFormValues>({
    mode: "all",
    resolver: zodResolver(authSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data: AuthFormValues) => {
    setResponse({});
    try {
      const res = await (data.mode === "signin"
        ? signin(data)
        : signup(data)
      );
      if (res?.error) {
        setResponse({ error: res.error });
      }else{
        setResponse({ message: res?.message });
      }
    } catch (error) {
      // The redirect function throws an error, so we need to catch it and ignore it.
      // See: https://nextjs.org/docs/app/api-reference/functions/redirect#how-redirect-works
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setResponse({ error: "An unexpected error occurred." });
    }
  };

  return (
    <Card className="w-full mx-auto max-w-md transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{mode === "signin" ? "Sign In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "signin" ? "Sign in to your account" : "Sign up for an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {response.message ? (
          <div className="text-center">
            <p className="text-sm text-green-600">{response.message}</p>
            <p className="mt-4 text-sm">
              Once verified, you can{" "}
              <Link href="/signin" className="underline">
                Sign In
              </Link>
              .
            </p>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              {mode === "signup" && (
                <FormTextField<AuthFormValues>
                  name="username"
                  label="User Name"
                  type="text"
                  placeholder="John Doe"
                />
              )}
              <FormTextField<AuthFormValues>
                name="mode"
                label="Mode"
                type="hidden"
              />
              <div className="grid gap-2">
                <FormTextField<AuthFormValues>
                  name="email"
                  label="Email"
                  type="text"
                  // placeholder="mulyadi@gmail.com"
                />
              </div>
              <div className="grid gap-2">
                <FormTextField<AuthFormValues>
                  name="password"
                  label="Password"
                  type="password"
                />
              </div>
              {response.error && (
                <p className="text-sm font-medium text-destructive">{response.error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {mode === "signin"
                  ? isSubmitting ? "Logging in..." : "Login"
                  : isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </FormProvider>
        )}

        <div className="mt-4 text-center text-sm">
          {!response.message && mode === "signin" ? (
            <div className="pb-4">
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
              <div>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          ) : !response.message && (
            <div>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="underline"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}