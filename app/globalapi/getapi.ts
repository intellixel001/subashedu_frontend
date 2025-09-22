"use server";
import { cookies } from "next/headers";

export const getPublicSingleCourse = async (courseId: string | number) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-single-course/${courseId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch course");
    }

    const json = await res.json();

    return json.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSingleMetarials = async (id: string | number) => {
  try {
    const cookieStore = await cookies(); // ✅ this is server-safe
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.error("No access token found in cookies");
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-mysingle-material/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error(
        "Failed to fetch material:",
        res.status,
        res.statusText,
        errorData
      );
      return null;
    }

    const json = await res.json();
    return json.data;
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    else console.error("Unexpected error", error);
    return null;
  }
};
