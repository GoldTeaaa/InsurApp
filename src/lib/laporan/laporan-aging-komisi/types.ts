import { z } from 'zod';
import { AGING_RANGE } from '@/lib/types';

export const AgingKomisiSearchParamsSchema = z.object({
	search: z.string().optional(),
	page: z.coerce.number().int().positive().optional(),
	size: z.coerce.number().int().positive().optional(),
	date_from: z.string().optional().transform(val => val || null),
	date_to: z.string().optional().transform(val => val || null),
});

export type AgingKomisiSearchParams = z.input<typeof AgingKomisiSearchParamsSchema>;

export const LaporanAgingKomisiItemSchema = z.object({
	polis_id: z.string(),
	nomor_polis: z.string(),
	nama_tertanggung: z.string(),
	jenis_bisnis: z.string(),
	share: z.number(),
	amount_paid: z.number(),
	amount_due: z.number(),
	aging_bracket: z.enum(AGING_RANGE),
	nomor_kwitansi: z.string().nullable(),
	komisi_gross: z.number(),
	pph: z.number(),
	komisi_net: z.number(),
	periode_mulai: z.string().nullable(),
	periode_akhir: z.string().nullable(),
	nama_perusahaan_asuransi: z.string(),
	jenis_coas: z.string().nullable(),
	detail_komisi_status: z.string()
});

export const LaporanAgingKomisiSchema = z.array(LaporanAgingKomisiItemSchema);
export const LaporanAgingKomisiRPCPayloadSchema = z.object({
	rows: LaporanAgingKomisiSchema,
	total_count: z.number()
})

export type LaporanAgingKomisiItem = z.infer<typeof LaporanAgingKomisiItemSchema>;
export type LaporanAgingKomisiRows = z.infer<typeof LaporanAgingKomisiSchema>;
export type LaporanAgingKomisiRPCPayload = z.infer<typeof LaporanAgingKomisiRPCPayloadSchema>;