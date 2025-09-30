"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

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
    <div className="bg-white pt-[100px]">
      <div className="container mx-auto px-4 py-12 pb-[100px] font-questrial">
        {/* Bookshelf layout */}
        <div className="space-y-24">
          {Array.from({ length: Math.ceil(materials.length / 4) }).map(
            (_, shelfIndex) => (
              <div key={shelfIndex} className="relative">
                {/* Shelf shadow bar */}
                <div
                  style={{ boxShadow: "0 20px 50px 10px black" }}
                  className="absolute -bottom-5 left-0 right-0 h-10 bg-gray-300 rounded-b-lg rounded-t-sm"
                ></div>

                {/* Books row */}
                <div className="grid grid-cols-2 px-5 sm:grid-cols-3 md:grid-cols-4 gap-6 relative z-10">
                  {materials
                    .slice(shelfIndex * 4, shelfIndex * 4 + 4)
                    .map((material) => (
                      <Link
                        key={material._id}
                        href={`/materials/${material._id}`}
                        className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 flex flex-col items-center overflow-hidden"
                      >
                        {/* Cover image */}
                        <div className="w-full bg-gray-100 flex items-center justify-center h-48">
                          {material.image ? (
                            <img
                              src={material.image}
                              alt={material.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">
                              📘 No Cover
                            </span>
                          )}
                        </div>

                        {/* Title + Price */}
                        <div className="p-4 text-center">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {material.title}
                          </h3>
                          <p className="text-red-600 font-medium mt-1">
                            ৳ {material.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
