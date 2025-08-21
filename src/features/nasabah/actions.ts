"use server";

import { supabase } from "@/lib/supabase";
import {
  nasabahInputFormSchema,
  type NasabahSort,
  type NasabahRow,
} from "@/lib/nasabah/types";
import { toNasabahCreateRpcArgs } from "@/lib/nasabah/mapper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NasabahFormData } from "@/lib/nasabah/types";

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  success?: boolean;
};

/** Helper: treat empty string as null for optional fields */
function opt(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

/** Helper: get required string; return raw (can be "") so Zod handles min() */
function req(v: FormDataEntryValue | null): string {
  return (v == null ? "" : String(v)).trim();
}

export default async function insertNasabah(
  _prev: State | null,
  formData: FormData
): Promise<State> {
  const tipe = String(formData.get("tipe") ?? "pribadi");

  // Common fields
  const base = {
    contact_1: req(formData.get("contact_1")),
    contact_2: opt(formData.get("contact_2")),
    email: opt(formData.get("email")),
    alamat: opt(formData.get("alamat")),
  };

  let raw: unknown;

  if (tipe === "perusahaan") {
    raw = {
      ...base,
      tipe: "perusahaan" as const,
      perusahaan: {
        nama_perusahaan: req(formData.get("perusahaan.nama_perusahaan")),
        npwp_perusahaan: req(formData.get("perusahaan.npwp_perusahaan")),
        nama_pic: req(formData.get("perusahaan.nama_pic")),
        jabatan_pic: opt(formData.get("perusahaan.jabatan_pic")),
        email_pic: opt(formData.get("perusahaan.email_pic")),
      },
      pribadi: undefined,
    };
  } else {
    // default to pribadi
    raw = {
      ...base,
      tipe: "pribadi" as const,
      pribadi: {
        nik: req(formData.get("pribadi.nik")),
        nama_tertanggung: req(formData.get("pribadi.nama_tertanggung")),
        tempat_lahir: req(formData.get("pribadi.tempat_lahir")),
        tanggal_lahir: req(formData.get("pribadi.tanggal_lahir")),
        jenis_kelamin: opt(formData.get("pribadi.jenis_kelamin")),
        alamat_ktp: opt(formData.get("pribadi.alamat_ktp")),
        rt: opt(formData.get("pribadi.rt")),
        rw: opt(formData.get("pribadi.rw")),
        kelurahan_desa: opt(formData.get("pribadi.kelurahan_desa")),
        kecamatan: opt(formData.get("pribadi.kecamatan")),
        kota_kabupaten: opt(formData.get("pribadi.kota_kabupaten")),
        provinsi: opt(formData.get("pribadi.provinsi")),
        kode_pos: opt(formData.get("pribadi.kode_pos")),
        agama: opt(formData.get("pribadi.agama")),
        status_perkawinan: opt(formData.get("pribadi.status_perkawinan")),
        pekerjaan: opt(formData.get("pribadi.pekerjaan")),
        kewarganegaraan: opt(formData.get("pribadi.kewarganegaraan")),
      },
      perusahaan: undefined,
    };
  }

  // Zod validate
  const parsed = nasabahInputFormSchema.safeParse(raw);
  if (!parsed.success) {
    const f = parsed.error.flatten();
    return {
      errors: f.fieldErrors as Record<string, string[]>,
      message: "Validasi gagal. Periksa input Anda.",
      success: false,
    };
  }

  // Map to RPC args
  const args = toNasabahCreateRpcArgs(parsed.data);

  // Call Supabase RPC
  const { data, error } = await supabase.rpc("nasabah_create_v1", args);
  if (error) {
    console.error(error);
    return {
      message: error.message || "Gagal menyimpan ke database.",
      success: false,
    };
  }

  // OK
  return {
    message: null,
    success: true,
  };
}

// ========================================== DASHBOARD VIEW ==========================================

const ITEMS_PER_PAGE = 5 as const;

export async function fetchNasabahPage({
  q = "",
  page = 1,
  sort = "created_asc",
}: {
  q?: string;
  page?: number;
  sort?: NasabahSort;
}) {
  const { data, error } = await supabase.rpc("nasabah_list_v1", {
    p_q: q.trim(),
    p_page: page,
    p_page_size: ITEMS_PER_PAGE,
    p_sort: sort,
  });

  if (error) throw new Error(`nasabah_list_v1: ${error.message}`);

  const rows = (data ?? []) as (NasabahRow & { total_count: number })[];
  const total = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

  return {
    rows: rows.map(({ total_count, ...r }) => r),
    total,
    page,
    pageSize: ITEMS_PER_PAGE,
    pageCount: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
  };
}

export type NasabahDetail = NasabahFormData & { updated_at: string | null };

export async function fetchNasabahById(
  id: string
): Promise<NasabahDetail | null> {
  const { data, error } = await supabase.rpc("nasabah_get_v1", {
    p_id: id,
  });
  if (error) throw new Error(error.message);
  return data as NasabahDetail;
}

// ========================================== UPDATE ACTION ==========================================
// helper: '' -> null (so RPC sees "no change" via COALESCE)

// Helpers
const toNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;
function trimEntries(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === "string" ? v.trim() : v,
    ])
  );
}

// Turn dotted keys (e.g. 'pribadi.nik') into nested objects.
function inflateDotted(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const parts = k.split(".");
    let cur = out;
    while (parts.length > 1) {
      const p = parts.shift()!;
      cur[p] = cur[p] ?? {};
      cur = cur[p];
    }
    cur[parts[0]] = v;
  }
  return out;
}

/**
 * Server action: updateNasabah
 * Mirrors your clean invoice example but targets your RPC and union schema.
 */
export async function updateNasabah(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  // 1) Build a plain object from FormData
  const raw = Object.fromEntries(formData);
  const trimmed = trimEntries(raw);
  const shaped = inflateDotted(trimmed); // now keys match Zod structure

  // 2) Validate (discriminated union: pribadi | perusahaan)
  const parsed = nasabahInputFormSchema.safeParse(shaped);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Periksa kembali input.",
    };
  }
  const v: NasabahFormData = parsed.data;

  // 3) Base fields
  const p_contact_1 = v.contact_1;
  const p_contact_2 = toNull(v.contact_2);
  const p_email = toNull(v.email);
  const p_alamat = toNull(v.alamat);

  // 4) Composite payloads for RPC
  const p_pribadi =
    v.tipe === "pribadi"
      ? {
          nik: v.pribadi.nik,
          nama_tertanggung: v.pribadi.nama_tertanggung,
          tempat_lahir: v.pribadi.tempat_lahir,
          tanggal_lahir: v.pribadi.tanggal_lahir,
          jenis_kelamin: v.pribadi.jenis_kelamin,
          alamat_ktp: toNull(v.pribadi.alamat_ktp),
          rt: toNull(v.pribadi.rt),
          rw: toNull(v.pribadi.rw),
          kelurahan_desa: toNull(v.pribadi.kelurahan_desa),
          kecamatan: toNull(v.pribadi.kecamatan),
          kota_kabupaten: toNull(v.pribadi.kota_kabupaten),
          provinsi: toNull(v.pribadi.provinsi),
          kode_pos: toNull(v.pribadi.kode_pos),
          agama: v.pribadi.agama,
          status_perkawinan: v.pribadi.status_perkawinan,
          pekerjaan: toNull(v.pribadi.pekerjaan),
          kewarganegaraan: v.pribadi.kewarganegaraan,
        }
      : null;

  const p_perusahaan =
    v.tipe === "perusahaan"
      ? {
          nama_perusahaan: v.perusahaan.nama_perusahaan,
          npwp_perusahaan: v.perusahaan.npwp_perusahaan,
          nama_pic: v.perusahaan.nama_pic,
          jabatan_pic: toNull(v.perusahaan.jabatan_pic),
          email_pic: toNull(v.perusahaan.email_pic),
        }
      : null;

  // 5) Call RPC
  const { data, error } = await supabase.rpc("nasabah_update_v1", {
    p_id: id,
    p_tipe: v.tipe,
    p_contact_1,
    p_contact_2,
    p_email,
    p_alamat,
    p_pribadi,
    p_perusahaan,
    // p_prev_updated_at: shaped.updated_at ?? null, // optional optimistic concurrency
  });

  if (error) {
    return { message: error.message };
  }else{
    console.log("Update Success:",data);
  }

  // 6) Revalidate and redirect similar to your reference
  revalidatePath("/dashboard/nasabah");
  redirect("/dashboard/nasabah");
}

// ========================================== DELETE ACTION ==========================================
export async function deleteNasabahAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
  const { error } = await supabase.rpc("nasabah_delete_v1", { p_id: id });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/nasabah"); // adjust to your route
}
