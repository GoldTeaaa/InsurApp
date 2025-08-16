"use server";

import { supabase } from "@/supabase";
import {
  nasabahInputFormSchema,
  type NasabahFormData,
  type FlattenedIssues,
} from "@/lib/nasabah/types";
import { toRpcArgs } from "@/lib/nasabah/mapper";

export type CreateNasabahState =
  | { ok: true; data: any }
  | { ok: false; error: string; issues?: FlattenedIssues };

function getJsonPayload(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string")
    return {
      ok: false,
      error: "Nasabah__Actions__Payload invalid",
    };

  try {
    const obj = JSON.parse(raw) as unknown;
    const parsed = nasabahInputFormSchema.safeParse(obj);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Nasabah__Actions__Parsed Invalid",
        issues: parsed.error.issues,
      };
    }
    return {
      ok: true,
      data: parsed.data,
    };
  } catch (e) {
    return {
      ok: false,
      error: "Nasabah__Actions__Payload invalid",
      issues: [],
    };
  }
}

export default async function insertNasabah(
  prevState: CreateNasabahState | null,
  formData: FormData
): Promise<CreateNasabahState> {
  const raw = formData.get("payload");
  if (typeof raw !== "string")
    return {
      ok: false,
      error: "Nasabah__Actions__Payload invalid",
    };

  let parsed = nasabahInputFormSchema.safeParse(JSON.parse(raw));

  if (!parsed.success) {
    return {
      ok: false,
      error: "Nasabah__Actions__Parsed Invalid",
      issues: parsed.error.flatten() as any,
    };
  }

  // adjust the parsed args with RPC args
  const args = toRpcArgs(parsed.data);

  // call the rpc function
  let { data, error } = await supabase.rpc("nasabah_create_v1", args);
  if (error) {
    console.error(error);
    return {
      ok: false,
      error: error.message,
    };
  } else {
    console.log(data);
    return {
      ok: true,
      data,
    };
  }
}
