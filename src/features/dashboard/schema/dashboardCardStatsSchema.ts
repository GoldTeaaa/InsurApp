import z from "zod";

export const dashboardCardDataSchema = z.object({
    // total_semua_polis: z.number(),
    total_polis_aktif: z.number(),
    total_polis_tidak_aktif: z.number(),
    total_premi_bulan_ini: z.number(),
    total_premi_tahun_ini: z.number(),
    total_nasabah_baru_bulan_ini: z.number()
})

export type DashboardCardDataType = z.infer<typeof dashboardCardDataSchema>