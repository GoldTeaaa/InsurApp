import z from "zod";

export const polisCardStatSchema = z.object({
    total_polis: z.number(),
    total_polis_aktif: z.number(),
    total_polis_tidak_aktif: z.number(),
})

export type PolisCardStatType = z.infer<typeof polisCardStatSchema>