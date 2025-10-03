"use client";

import { useEffect, useState } from "react";
import { Class } from "../page";
import LiveClassClient from "./LiveClassClient";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const classId = params?.id;
  const [liveClass, setLiveClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchClass() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-class/${classId}`,
          {
            method: "GET",
            credentials: "include", // include cookies if auth needed
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch class data");
        }

        const result = await response.json();
        console.log(result);
        setLiveClass(result.liveClass); // result should have liveClass field
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
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
