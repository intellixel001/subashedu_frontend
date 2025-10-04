"use client";

import { ChangeEvent, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Section5 from "./Section5";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState<string>("");

  const hasSearched = query.trim().length > 0;

  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="flex container mx-auto flex-col min-h-screen overflow-y-auto animate-slideDown relative">
        {/* Always visible close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/80 hover:bg-red-600 transition-colors z-50"
        >
          <FaTimes size={20} className="text-white" />
        </button>

        {/* Search input area */}
        <div
          className={`flex justify-center transition-all duration-500 ${
            hasSearched ? "p-4 mt-14" : "flex-1 my-[100px] items-center"
          }`}
        >
          <div className="w-full max-w-2xl bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl flex items-center">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="🔍 Search for courses, classes, materials..."
              className="w-full bg-transparent px-5 py-4 text-lg text-gray-100 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Default suggestions (before search) */}
        {!hasSearched && (
          <div className="flex-1 p-6 space-y-6 text-gray-300">
            <h3 className="text-xl font-semibold text-white">Discover</h3>
            <Section5 />
          </div>
        )}

        {/* Search results */}
        {hasSearched && (
          <div className="flex-1 p-6 space-y-4">
            <p className="text-gray-400 text-sm italic mb-2">
              Showing results for{" "}
              <span className="font-semibold text-white">{query}</span>
            </p>

            {/* Example result cards */}
            <div className="bg-gray-800/80 backdrop-blur-md p-5 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-700 transition">
              Example search result for <strong>{query}</strong>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-5 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-700 transition">
              Another result related to <strong>{query}</strong>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-md p-5 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-700 transition">
              More search results matching <strong>{query}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
