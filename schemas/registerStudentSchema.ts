import { z } from "zod";

export const registerStudentSchema = z
  .object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
    educationLevel: z.string().min(1, "Education Level is required"),
    institution: z.string().min(1, "Institution name is required"),
    sscYear: z.string().optional(),
    hscYear: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    guardianPhone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });