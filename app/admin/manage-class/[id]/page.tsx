import { cookies } from "next/headers";
import { Class } from "../page";
import LiveClassClient from "./LiveClassClient";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const classId = await params.id;

  // Get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("adminAccessToken")?.value;

  console.log(token);
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
