import z from "zod";

export const ListPerusahaan = z.object({
    id: z.string().uuid(),
    value: z.string()
});

export type ListPerusahaanType = z.infer<typeof ListPerusahaan>;
