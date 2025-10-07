/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaExclamationTriangle,
  FaSpinner,
  FaStore,
} from "react-icons/fa";

// Define the Material type for TypeScript
interface Material {
  _id: string;
  title: string;
  price: number;
  description?: string;
}

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure environment variable is defined
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch student's materials
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${serverUrl}/api/student/get-student-materials`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch materials");
        }
        setMaterials(data.data || []);
      } catch (err) {
        setError(err.message || "Error fetching materials");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Retry fetch on error
  const retryFetch = () => {
    setError(null);
    setLoading(true);
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/student/get-student-materials`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch materials");
        }
        setMaterials(data.data || []);
      } catch (err) {
        setError(err.message || "Error fetching materials");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-5xl text-[#f7374f] mb-4" />
        <p className="text-lg font-medium text-gray-600">
          Loading materials...
        </p>
      </div>
    );
  }

  console.log(error);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl font-medium mb-2">Error loading materials</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={retryFetch}
          className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-questrial">
      <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-8 text-white rounded-t-2xl">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaBook className="text-4xl" />
            My Materials
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Explore your purchased or accessible learning materials
          </p>
        </div>

        <div className="p-8">
          {materials.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No materials found
              </h3>
              <p className="text-gray-500 mb-4">
                You haven&apos;t purchased or accessed any materials yet.
              </p>
              <Link
                href="/materials"
                className="inline-flex items-center px-5 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors"
              >
                <FaStore className="mr-2" />
                Browse Materials
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="relative h-32 bg-gray-100">
                    {/* Placeholder for thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <FaBook className="text-4xl" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#f7374f]/10 p-2 rounded-full text-[#f7374f]">
                        <FaBook className="text-lg" />
                      </div>
                      <h3 className="font-semibold text-lg truncate">
                        {material.title}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[#f7374f] font-medium text-sm">
                        Purchased
                      </span>
                      <Link
                        href={`/dashboard/materials/${material._id}`}
                        className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors text-sm font-medium"
                        aria-label={`View ${material.title} material`}
                      >
                        View Material
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
