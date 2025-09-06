import { cookies } from "next/headers";

export async function getCurrentStudent() {
{
  const cookiesInstance = await cookies();
  const accessToken = cookiesInstance.get("accessToken");
  const accessTokenValue =
    accessToken && typeof accessToken !== "string" ? accessToken.value : "";

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessTokenValue}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current student");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching current student:", error);
    return null;
  }
}
}