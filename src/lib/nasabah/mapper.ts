import { NasabahFormData } from "@/lib/nasabah/types";

export function toRpcArgs(f: NasabahFormData) {
  if (f.tipe === "pribadi") {
    return {
      p_tipe: "pribadi",
      p_nomor_telfon: f.nomor_telfon ?? null,
      p_email: f.email || null,
      p_alamat: f.alamat || null,
      p_pribadi: {
        nama_lengkap: f.pribadi.nama_lengkap,
        no_ktp: f.pribadi.no_ktp,
        tanggal_lahir: f.pribadi.tanggal_lahir || null,
      },
      p_perusahaan: null,
    };
  } else {
    return {
      p_tipe: "perusahaan",
      p_nomor_telfon: f.nomor_telfon ?? null,
      p_email: f.email || null,
      p_alamat: f.alamat || null,
      p_pribadi: null,
      p_perusahaan: {
        nama_perusahaan: f.perusahaan!.nama_perusahaan,
        pic_nama: f.perusahaan!.pic_nama,
        no_ktp_pic: f.perusahaan!.no_ktp_pic || null,
      },
    };
  }
}
