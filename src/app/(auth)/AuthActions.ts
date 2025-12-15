"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { signinValues, signupSchema, signupValues } from "./types";

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
  const username = formData.username;
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: username,
      },
    },
  });

  if (error) {
    console.error('Signup Error: ', error);
    if (error.code === "user_already_exists") {
      return {
        error: "Email already exists",
      };
    }
    return {
      error: error.message,
    };
  }

  console.log("data: ", data);
  if (data.user && !data.session) {
    console.log("User signed up, but no session created yet.");
    console.log('data.user: ', data.user);
    console.log('data.session: ', data.session);
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
