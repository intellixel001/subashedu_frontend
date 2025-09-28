"use client";

import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

interface Material {
  _id: string;
  title: string;
  price: string;
  image?: string; // Optional thumbnail
  createdAt: string;
}

export default async function Materials() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  let materials: Material[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(`${serverUrl}/api/get-materials`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!data.success)
      throw new Error(data.message || "Failed to fetch materials");

    materials = data.materials || [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Error fetching materials";
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
                  style={{
                    boxShadow: "0 20px 50px 10px black",
                  }}
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
                        <div className="w-full bg-gray-100 flex items-center justify-center">
                          {material.image ? (
                            <img
                              src={material.image}
                              alt={material.title}
                              className="w-full h-[200px] object-cover"
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
