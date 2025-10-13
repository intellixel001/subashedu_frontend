"use client";

import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import ElectricCard from "./ElectricCard";

interface Material {
  _id: string;
  title: string;
  price: string;
  image?: string;
  createdAt: string;
}

export default function Materials() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/get-materials`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data.success)
          throw new Error(data.message || "Failed to fetch materials");

        setMaterials(data.materials || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching materials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [serverUrl]);

  if (loading) {
    // Skeleton loader
    return (
      <div className="flex flex-wrap justify-center gap-6 p-12">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="w-40 h-64 bg-gray-700 animate-pulse rounded-lg shadow-md"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <FaExclamationTriangle className="text-5xl mb-4 animate-pulse" />
        <p className="text-xl font-semibold mb-2">Error loading materials</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <p className="text-2xl font-semibold mb-2">No Materials Available</p>
        <p className="text-sm">Please check back later for new resources.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#E8EAED]">
      <div className="container mx-auto px-4 py-12 pb-[100px] font-questrial">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center">
          {materials.map((material) => (
            <ElectricCard
              key={material._id}
              title={material.title}
              price={material.price}
              image={material.image}
              link={`/materials/${material._id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
