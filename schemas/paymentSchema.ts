// schemas/paymentSchema.ts
import { z } from "zod";

export const paymentSchema = z.object({
  paymentMethod: z.enum(["bkash", "nagad"], {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
  mobileNumber: z
    .string()
    .length(11, { message: "Mobile number must be exactly 11 digits" })
    .regex(/^01[3-9]\d{8}$/, {
      message: "Mobile number must start with 01 and be 11 digits",
    }),
  transactionId: z
    .string()
    .min(8, { message: "Transaction ID must be at least 8 characters long" }),
  amount: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(1, { message: "Amount must be at least 1 BDT" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
  //other details
  studentId: z.string().min(4, { message: "Valid Student ID required" }),
  courseId: z.string().min(4, { message: "Valid Course ID required" }),
});
