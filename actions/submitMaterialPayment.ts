/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export async function submitMaterialPayment(prevState: any, formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const materialId = formData.get("materialId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const mobileNumber = formData.get("mobileNumber") as string;
  const transactionId = formData.get("transactionId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const termsAccepted = formData.get("terms") === "on";

  // Basic validation
  const errors: { path: string[]; message: string }[] = [];
  if (!studentId) errors.push({ path: ["studentId"], message: "Student ID is required" });
  if (!materialId) errors.push({ path: ["materialId"], message: "Material ID is required" });
  if (!paymentMethod) errors.push({ path: ["paymentMethod"], message: "Payment method is required" });
  if (!mobileNumber || !/^\d{11}$/.test(mobileNumber)) {
    errors.push({ path: ["mobileNumber"], message: "Valid mobile number is required" });
  }
  if (!transactionId) errors.push({ path: ["transactionId"], message: "Transaction ID is required" });
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push({ path: ["amount"], message: "Valid amount is required" });
  }
  if (!termsAccepted) errors.push({ path: ["terms"], message: "You must accept the terms" });

  if (errors.length > 0) {
    return { success: false, message: "Please fix the errors below", errors };
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/submit-material-payment-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: accessToken ? `accessToken=${accessToken}` : "",
        },
        body: JSON.stringify({
          studentId,
          materialId,
          paymentMethod,
          mobileNumber,
          transactionId,
          amount,
          termsAccepted,
        }),
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit payment",
        errors: [],
      };
    }

    return {
      success: true,
      message: "Payment submitted successfully. Awaiting verification.",
      errors: [],
    };
  } catch (error) {
    console.error("Error submitting material payment:", error);
    return {
      success: false,
      message: "An error occurred while submitting payment",
      errors: [],
    };
  }
}