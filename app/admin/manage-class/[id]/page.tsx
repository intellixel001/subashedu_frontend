"use client";

import { useEffect, useState } from "react";
import { Class } from "../page";
import LiveClassClient from "./LiveClassClient";

interface PageProps {
  params: { id: string }; // plain object
}

export default function Page({ params }: PageProps) {
  const classId = params.id;

  const [liveClass, setLiveClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchClass() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-class/${classId}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Failed to fetch class data");

        const result = await response.json();
        setLiveClass(result.liveClass);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [classId]);

  if (loading) return <div>Loading class info...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!liveClass) return <div>No class found</div>;

  return (
    <div className="bg-yellow-900 min-h-screen mx-auto p-4">
      <LiveClassClient liveClass={liveClass} />
    </div>
  );
}
