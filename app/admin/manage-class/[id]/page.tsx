import { cookies } from "next/headers";
import { Class } from "../page";
import LiveClassClient from "./LiveClassClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: classId } = await params;

  // Get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("adminAccessToken")?.value;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  // Fetch class data with Bearer token
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-class/${classId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // always fetch fresh
    }
  );

  if (!res.ok) throw new Error("Failed to fetch class data");

  const data = await res.json();
  const liveClass: Class = data.liveClass;

  return (
    <div className="bg-yellow-900 min-h-screen mx-auto p-4">
      <LiveClassClient liveClass={liveClass} />
    </div>
  );
}
