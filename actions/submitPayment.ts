"use server";

import { paymentSchema } from "@/schemas/paymentSchema";
import { cookies } from "next/headers";

export async function submitPayment(formState, formData) {
  const parsedData = paymentSchema.safeParse({
    paymentMethod: formData.get("paymentMethod"),
    mobileNumber: formData.get("mobileNumber"),
    transactionId: formData.get("transactionId"),
    amount: Number(formData.get("amount")),
    terms: formData.get("terms") === "on",
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
  });

  if (!parsedData.success) {
    return {
      success: false,
      message: "Please correct the errors in the form",
      errors: parsedData.error.errors,
    };
  }

  try {
    const data = parsedData.data;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "You must be logged in to submit a payment",
        errors: [],
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/payment-submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "An error occurred while processing your payment",
        errors: [],
      };
    }

    return {
      success: true,
      message: result.message || "Payment submitted successfully",
      errors: [],
    };
  } catch (error) {
    console.error("Submission Error:", error);
    return {
      success: false,
      message: "An error occurred while processing your payment",
      errors: [],
    };
  }
}