import { NasabahFormData } from "@/lib/nasabah/types";

/* ===== Mapper: Form -> RPC args (with TS-safe narrowing) ===== */
export function toNasabahCreateRpcArgs(input: NasabahFormData) {
  if (input.tipe === 'pribadi' && 'pribadi' in input) {
    const p = input.pribadi;
    return {
      p_tipe: 'pribadi' as const,
      p_contact_1: input.contact_1,
      p_contact_2: input.contact_2 ?? null,
      p_email: input.email ?? null,
      p_alamat: input.alamat ?? null,
      p_pribadi: {
        nik: p.nik,
        nama_tertanggung: p.nama_tertanggung,
        tempat_lahir: p.tempat_lahir,
        tanggal_lahir: p.tanggal_lahir,
        jenis_kelamin: p.jenis_kelamin,
        alamat_ktp: p.alamat_ktp ?? null,
        rt: p.rt ?? null,
        rw: p.rw ?? null,
        kelurahan_desa: p.kelurahan_desa ?? null,
        kecamatan: p.kecamatan ?? null,
        kota_kabupaten: p.kota_kabupaten ?? null,
        provinsi: p.provinsi ?? null,
        kode_pos: p.kode_pos ?? null,
        agama: p.agama ?? null,
        status_perkawinan: p.status_perkawinan ?? null,
        pekerjaan: p.pekerjaan ?? null,
        kewarganegaraan: p.kewarganegaraan ?? null,
      },
      p_perusahaan: null,
    };
  }

  if (input.tipe === 'perusahaan' && 'perusahaan' in input) {
    const c = input.perusahaan;
    return {
      p_tipe: 'perusahaan' as const,
      p_contact_1: input.contact_1,
      p_contact_2: input.contact_2 ?? null,
      p_email: input.email ?? null,
      p_alamat: input.alamat ?? null,
      p_pribadi: null,
      p_perusahaan: {
        nama_perusahaan: c.nama_perusahaan,
        npwp_perusahaan: c.npwp_perusahaan,
        nama_pic: c.nama_pic,
        jabatan_pic: c.jabatan_pic ?? null,
        email_pic: c.email_pic ?? null,
      },
    };
  }

  // Fallback (shouldn't happen if input is typed)
  throw new Error('Invalid tipe or payload');
}
