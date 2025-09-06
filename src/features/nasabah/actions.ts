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
  console.log("FormData: ", formData);

  // Common fields
  const base = {
    nama: req(formData.get("nama")),
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
        // nama_perusahaan: req(formData.get("perusahaan.nama_perusahaan")),
        nama_perusahaan: req(formData.get("nama")),
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
        // nama_tertanggung: req(formData.get("pribadi.nama_tertanggung")),
        nama_tertanggung: req(formData.get("nama")),
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
  console.log("Parsed: ", parsed.data);

  // Map to RPC args
  const args = toNasabahCreateRpcArgs(parsed.data);
  console.log("Args: ", args);

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
  const { data, error } = await supabase.rpc("nasabah_pagination_v1", {
    p_q: q.trim(),
    p_page: page,
    p_page_size: ITEMS_PER_PAGE,
    p_sort: sort,
  });

  if (error) throw new Error(`nasabah_pagination_v1: ${error.message}`);

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
  // This should be optimized in the future where tipe validation
  // is checked in the Frontend and call the specific rpc
  // Current rpc return the whole fields which can slow down parsing
  const { data, error } = await supabase.rpc("nasabah_fill_update_form_v1", {
    p_id: id,
  });
  // console.log("data: ", data);

  const record = Array.isArray(data) ? data[0] : data;
  // console.log("record: ", record.nama_tertanggung);
  if (error) throw new Error(error.message);
  return record as NasabahDetail;
}

// ========================================== UPDATE ACTION ==========================================
// helper: '' -> null (so RPC sees "no change" via COALESCE)

// Helpers
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

const toNull = <T extends string | null | undefined>(v: T) =>
  v == null || v === "" ? null : v;

// Optional: if you want to be explicit, keep date as 'YYYY-MM-DD' string
const toPgDate = (s: string) => s;

/** Canonical display name for p_nama */
function computeDisplayName(v: NasabahFormData): string | null {
  if (v.tipe === "pribadi") {
    return toNull(v.pribadi.nama_tertanggung) ?? toNull(v.nama);
  }
  return toNull(v.perusahaan.nama_perusahaan) ?? toNull(v.nama);
}

export async function updateNasabahV1(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  // 0) Lock tipe by reading current record (defense-in-depth)
  const { data: existing, error: exErr } = await supabase
    .from("nasabah")
    .select("tipe")
    .eq("id", id)
    .single();

  if (exErr || !existing) {
    return {
      message: "Data tidak ditemukan.",
      errors: { id: ["Nasabah tidak ditemukan"] },
    };
  }

  // 1) Build a plain object from FormData -> shape to Zod structure
  const raw = Object.fromEntries(formData);
  const trimmed = trimEntries(raw);
  const shaped = inflateDotted(trimmed);
  // console.log("shaped: ", shaped);

  // 2) Validate (discriminated union: pribadi | perusahaan)
  const parsed = nasabahInputFormSchema.safeParse(shaped);
  console.log("parsed: ", parsed);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Periksa kembali input.",
    };
  }
  const v: NasabahFormData = parsed.data;

  // 2b) Guard: tipe must not change
  if (v.tipe !== existing.tipe) {
    return {
      message: "Tipe nasabah tidak dapat diubah.",
      errors: { tipe: ["Tipe terkunci dan tidak boleh diubah."] },
    };
  }

  // 3) Base fields
  const p_nama = computeDisplayName(v);
  const p_contact_1 = v.contact_1;
  const p_contact_2 = toNull(v.contact_2);
  const p_email = toNull(v.email);
  const p_alamat = toNull(v.alamat);

  // 4) Composite payloads for RPC (exactly one non-null)
  let p_pribadi: Record<string, unknown> | null = null;
  let p_perusahaan: Record<string, unknown> | null = null;

  if (v.tipe === "pribadi") {
    p_pribadi = {
      nik: v.pribadi.nik,
      nama_tertanggung: p_nama, // konsisten sebagai display name
      tempat_lahir: v.pribadi.tempat_lahir,
      tanggal_lahir: toPgDate(v.pribadi.tanggal_lahir),
      jenis_kelamin: v.pribadi.jenis_kelamin,
      alamat_ktp: toNull(v.pribadi.alamat_ktp),
      rt: toNull(v.pribadi.rt),
      rw: toNull(v.pribadi.rw),
      kelurahan_desa: toNull(v.pribadi.kelurahan_desa),
      kecamatan: toNull(v.pribadi.kecamatan),
      kota_kabupaten: toNull(v.pribadi.kota_kabupaten),
      provinsi: toNull(v.pribadi.provinsi),
      kode_pos: toNull(v.pribadi.kode_pos),
      agama: v.pribadi.agama ?? null,
      status_perkawinan: v.pribadi.status_perkawinan,
      pekerjaan: toNull(v.pribadi.pekerjaan),
      kewarganegaraan: v.pribadi.kewarganegaraan,
    };
  } else {
    p_perusahaan = {
      nama_perusahaan: p_nama,
      npwp_perusahaan: v.perusahaan.npwp_perusahaan,
      nama_pic: v.perusahaan.nama_pic,
      jabatan_pic: toNull(v.perusahaan.jabatan_pic),
      email_pic: v.perusahaan.email_pic ?? null,
    };
  }
  console.log("email: ", p_email);
  console.log("p_pribadi: ", p_pribadi);
  console.log("p_perusahaan: ", p_perusahaan);

  // 5) Call RPC (same-type update; tidak mengirim p_tipe)
  const { error } = await supabase.rpc("nasabah_update_same_type_v2", {
    p_id: id,
    p_nama,
    p_contact_1,
    p_contact_2,
    p_email,
    p_alamat,
    p_pribadi,
    p_perusahaan,
    // p_prev_updated_at: shaped.updated_at ?? null, // uncomment if you add optimistic concurrency
  });

  if (error) {
    return { message: "Gagal menyimpan." };
  }

  // 6) Revalidate & redirect
  revalidatePath("/dashboard/nasabah");
  redirect("/dashboard/nasabah");
}


export async function updateNasabahV2(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  // 0) Lock tipe by reading current record (defense-in-depth)
  const { data: existing, error: exErr } = await supabase
    .from("nasabah")
    .select("tipe")
    .eq("id", id)
    .single();

  if (exErr || !existing) {
    return {
      message: "Data tidak ditemukan.",
      errors: { id: ["Nasabah tidak ditemukan"] },
    };
  }

  // 1) Build a plain object from FormData -> shape to Zod structure
  const raw = Object.fromEntries(formData);
  const trimmed = trimEntries(raw);
  const shaped = inflateDotted(trimmed);
  // console.log("shaped: ", shaped);

  // 2) Validate (discriminated union: pribadi | perusahaan)
  const parsed = nasabahInputFormSchema.safeParse(shaped);
  console.log("parsed: ", parsed);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Kemungkinan Types salah, Periksa kembali input!",
    };
  }
  const v: NasabahFormData = parsed.data;

  // 2b) Guard: tipe must not change
  if (v.tipe !== existing.tipe) {
    return {
      message: "Tipe nasabah tidak dapat diubah.",
      errors: { tipe: ["Tipe terkunci dan tidak boleh diubah."] },
    };
  }

  // 1) base patch (parent)
  const p_base_patch: Record<string, any> = {};
  const setIfDefined = (obj: any, key: string, val: any) => {
    if (val !== undefined) obj[key] = val; // include even if null (to clear)
  };

  setIfDefined(p_base_patch, "nama", toNull(computeDisplayName(v)));
  setIfDefined(p_base_patch, "contact_1", toNull(v.contact_1));
  setIfDefined(p_base_patch, "contact_2", toNull(v.contact_2));
  setIfDefined(p_base_patch, "email", toNull(v.email));
  setIfDefined(p_base_patch, "alamat", toNull(v.alamat));

  // 2) child patch (exactly one)
  let p_pribadi_patch: Record<string, any> | null = null;
  let p_perusahaan_patch: Record<string, any> | null = null;

  if (v.tipe === "pribadi") {
    const pr = v.pribadi;
    p_pribadi_patch = {};
    setIfDefined(p_pribadi_patch, "nik", toNull(pr.nik));
    setIfDefined(
      p_pribadi_patch,
      "nama_tertanggung",
      toNull(computeDisplayName(v))
    );
    setIfDefined(p_pribadi_patch, "tempat_lahir", toNull(pr.tempat_lahir));
    setIfDefined(p_pribadi_patch, "tanggal_lahir", toNull(pr.tanggal_lahir));
    setIfDefined(p_pribadi_patch, "jenis_kelamin", pr.jenis_kelamin ?? null);
    setIfDefined(p_pribadi_patch, "alamat_ktp", toNull(pr.alamat_ktp));
    setIfDefined(p_pribadi_patch, "rt", toNull(pr.rt));
    setIfDefined(p_pribadi_patch, "rw", toNull(pr.rw));
    setIfDefined(p_pribadi_patch, "kelurahan_desa", toNull(pr.kelurahan_desa));
    setIfDefined(p_pribadi_patch, "kecamatan", toNull(pr.kecamatan));
    setIfDefined(p_pribadi_patch, "kota_kabupaten", toNull(pr.kota_kabupaten));
    setIfDefined(p_pribadi_patch, "provinsi", toNull(pr.provinsi));
    setIfDefined(p_pribadi_patch, "kode_pos", toNull(pr.kode_pos));
    setIfDefined(p_pribadi_patch, "agama", pr.agama ?? null);
    setIfDefined(
      p_pribadi_patch,
      "status_perkawinan",
      pr.status_perkawinan ?? null
    );
    setIfDefined(p_pribadi_patch, "pekerjaan", toNull(pr.pekerjaan));
    setIfDefined(
      p_pribadi_patch,
      "kewarganegaraan",
      pr.kewarganegaraan ?? null
    );
  } else {
    const pe = v.perusahaan;
    p_perusahaan_patch = {};
    setIfDefined(
      p_perusahaan_patch,
      "nama_perusahaan",
      toNull(computeDisplayName(v))
    );
    setIfDefined(
      p_perusahaan_patch,
      "npwp_perusahaan",
      toNull(pe.npwp_perusahaan)
    );
    setIfDefined(p_perusahaan_patch, "nama_pic", toNull(pe.nama_pic));
    setIfDefined(p_perusahaan_patch, "jabatan_pic", toNull(pe.jabatan_pic));
    setIfDefined(p_perusahaan_patch, "email_pic", pe.email_pic ?? null);
  }

  // 3) call v3 RPC
  const { error } = await supabase.rpc("nasabah_update_same_type_v3", {
    p_id: id,
    p_base_patch,
    p_pribadi_patch,
    p_perusahaan_patch,
  });

  if (error) {
    return {
      message: "Gagal menyimpan.",
      errors: { rpc: [error.message] },
    };
  }

  // 6) Revalidate & redirect
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
