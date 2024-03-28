import z from "zod";


export const SignInFormSchema = z.object({
    email: z.string().email().min(1, "Email is required").min(5, "Email is invalid"),
    password: z.string().min(1, "Password is too short").min(5, "Password is required"),
})

export type SignInFormSchema = z.infer<typeof SignInFormSchema>;