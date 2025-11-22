"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { signinValues, signupValues } from "./types";
import { form } from "framer-motion/client";

type ActionState = {
  error?: string | null;
  message?: string | null;
} | null;

export async function signin(formData: signinValues): Promise<ActionState> {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: "Email atau password salah",
    };
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: signupValues): Promise<ActionState> {
  const supabase = await createClient();
  const email = formData.email;
  const password = formData.password;
  const username = formData.display_name;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `/`,
      data: {
        display_name: username,
      },
    },
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (data.user && !data.session) {
    return {
      message:
        "Please check your email to verify your account and complete the signup process.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
