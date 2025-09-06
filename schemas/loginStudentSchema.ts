import { z } from "zod";

export const loginStudentSchema = z.object({
  loginId: z
    .string()
    .nonempty("Registration No. or Email is required")
    .min(3, "Registration No. or Email must be at least 3 characters long"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

