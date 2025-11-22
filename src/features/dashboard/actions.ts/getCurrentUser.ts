"use server";
import { ActionReturnState } from "@/lib/types";
import { createClient } from "~/utils/supabase/server";

type CurrentUser = {
  email?: string;
  display_name?: string;
};

type ReturnState = ActionReturnState<CurrentUser>;

export default async function getCurrentUser(): Promise<ReturnState> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message || "User not found or not authenticated.",
    };
  }

  return {
    success: true,
    message: "Successfully retrieved user.",
    data: {
      email: data.user.email,
      display_name: data.user.user_metadata?.display_name,
    },
  };
}
