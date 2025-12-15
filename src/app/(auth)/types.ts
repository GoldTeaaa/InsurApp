import { z } from "zod";

export const signinSchema = z.object({
    mode: z.literal("signin"),
    email: z.string().email({
        message: "Email tidak valid"
    }),
    password: z.string().min(6, "Password minimal 6 karakter")
}) 

export const signupSchema = z.object({
    mode: z.literal("signup"),
    username: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email({
        message: "Email tidak valid"
    }),
    password: z.string().min(6, "Password minimal 6 karakter")
})

export const authSchema = z.discriminatedUnion("mode", [signinSchema, signupSchema])

export type signinValues = z.infer<typeof signinSchema>
export type signupValues = z.infer<typeof signupSchema>
export type AuthFormValues = z.infer<typeof authSchema>

export const signinDefaultValues = {
    mode: "signin" as const,
    email: "",
    password: ""
}

export const signupDefaultValues = {
    mode: "signup" as const,
    username: "",
    email: "",
    password: ""
}