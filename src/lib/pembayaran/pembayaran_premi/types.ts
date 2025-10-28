import { add } from "date-fns";
import z from "zod";

enum status {
  paid = "paid",
  unpaid = "unpaid",
  partially_paid = "partially_paid",
}

export type PembayaranPremiProps = {
  search?: string;
  page?: number;
  size?: number;
  status?: string;
};

export type PembayaranTableRow = {
  id: string;
  nomor_polis: string;
  nama_tertanggung: string;
  asuransi_penanggung: string;
  tanggal_input: string;
  amount: number;
  total_paid: number;
  remaining: number;
  status: string;
  total_count: number;
};

export type PremiHistoryRow = {
  detail_premi_id: string;
  pembayaran_id: string;
  nomor_polis: string;
  amount_paid: number;
  tanggal_bayar: string;
  cara_bayar: string;
  rekening_bank: string;
  ref_no: string;
};

// ====================== ADD PEMBAYARAN PREMI SCHEMA ================

export const cara_bayar = ["cash", "transfer", "virtual account"] as const;

export const addPembayaranPremiPayloadSchema = z.object({
  detail_premi_id: z.string().uuid(),
  tanggal_bayar: z.coerce.date(),
  amount_paid: z.coerce.number().min(1, "Nominal wajib diisi"),
  cara_bayar: z.enum(cara_bayar),
  ref_no: z.string().min(1, "Ref No wajib diisi"),
  rekening_bank: z.string().nullable().optional(),
});

export const addPembayaranPremiFormSchema =
  addPembayaranPremiPayloadSchema.omit({
    detail_premi_id: true,
  });

export type AddPembayaranPremiPayload = z.infer<
  typeof addPembayaranPremiPayloadSchema
>;
export type AddPembayaranPremiForm = z.infer<
  typeof addPembayaranPremiFormSchema
>;

export const defaultAddPembayaranPremiForm: AddPembayaranPremiForm = {
  tanggal_bayar: new Date(),
  amount_paid: 0,
  cara_bayar: "cash",
  ref_no: "",
  rekening_bank: null,
};


// ======================== UPDATE PEMBAYARAN PREMI SCHEMA ================

export const updatePembayaranFormSchema = addPembayaranPremiFormSchema;

export const updatePembayaranPremiPayloadSchema = updatePembayaranFormSchema.extend({
  pembayaran_id: z.string().uuid(),
})

export type UpdatePembayaranPremiPayload = z.infer<typeof updatePembayaranPremiPayloadSchema>;