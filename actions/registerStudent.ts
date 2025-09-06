"use server";

import { registerStudentSchema } from "@/schemas/registerStudentSchema";

export async function registerStudent(formState, formData: FormData) {
  const parsedData = registerStudentSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    educationLevel: formData.get("educationLevel"),
    institution: formData.get("institution"),
    sscYear: formData.get("sscYear") || "",
    hscYear: formData.get("hscYear") || "",
    fatherName: formData.get("fatherName") || "",
    motherName: formData.get("motherName") || "",
    guardianPhone: formData.get("guardianPhone") || "",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedData.success) {
    console.log("Zod validation errors:", parsedData.error.errors);
    return { success: false, errors: parsedData.error.errors, message: "" };
  }

  const data = parsedData.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    console.log("Backend response status:", response.status);
    let result;
    try {
      result = await response.json();
      console.log("Backend response body:", result);
    } catch (error) {
      console.error("Failed to parse response JSON:", error);
      const responseText = await response.text();
      console.log("Raw response text:", responseText.slice(0, 200)); // Log first 200 chars
      if (response.status === 409) {
        // Infer duplicate email error
        return {
          success: false,
          message: "User already exists with this email",
          errors: [{ path: ["email"], message: "Email is already registered" }],
        };
      }
      return {
        success: false,
        message: "Invalid response from server. Please try again.",
        errors: [],
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
        errors: result.errors || [],
      };
    }

    return {
      success: true,
      message: result.message || "Registration successful",
      errors: [],
    };
  } catch (error) {
    console.error("Network or server error:", error.message);
    return {
      success: false,
      message: "Failed to connect to the server. Please try again later.",
      errors: [],
    };
  }
}