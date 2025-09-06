"use server";

import { loginStudentSchema } from "@/schemas/loginStudentSchema";
import { cookies } from "next/headers";

export async function loginStudent(formState, formData: FormData) {
  const parsedData = loginStudentSchema.safeParse({
    loginId: formData.get("loginId"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on" ? true : false,
  });

  if (!parsedData.success) {
    return {
      success: false,
      errors: parsedData.error.errors,
      message: "Validation failed. Please check your input.",
    };
  }

  const data = parsedData.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || "Login failed. Please try again.",
        errors: result?.errors || [],
      };
    }

    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      const cookiesArray = setCookie.split(", ");
      const cookiesInstance = await cookies();
      cookiesArray.forEach((cookie) => {
        const [cookieName, ...cookieValueParts] = cookie.split("=");
        const cookieValue = cookieValueParts.join("=").split(";")[0];
        cookiesInstance.set(cookieName, cookieValue, {
          path: "/",
          httpOnly: true,
          secure: true,
        });
      });
    }

    return {
      success: true,
      message: result?.message || "Login successful.",
      user: result.data,
    };
  } catch (error) {
    console.error("Login failed", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      errors: [],
    };
  }
}
