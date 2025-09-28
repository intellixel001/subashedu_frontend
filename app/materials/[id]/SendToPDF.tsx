"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SendToPDFProps {
  id: string;
}

export default function SendToPDF({ id }: SendToPDFProps) {
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.push(`/dashboard/materials/${id}`);
    }
  }, [id, router]);

  return null;
}
