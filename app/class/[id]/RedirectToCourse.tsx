"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToCourse({ id }: { id?: string }) {
  const router = useRouter();

  useEffect(() => {
    // Optional: redirect to course page after 3 seconds
    if (id) {
      const timer = setTimeout(() => {
        router.push(`/course/${id}/enrollment`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-900 rounded-xl shadow-md text-white space-y-4">
      <h2 className="text-2xl font-bold">Access Restricted</h2>
      <p className="text-gray-300 text-lg">
        You need to purchase this course to join the class.
      </p>
      <p className="text-yellow-400">Redirecting you to the course page...</p>
    </div>
  );
}
