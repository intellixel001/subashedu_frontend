"use client";

import React, { useState } from "react";

export interface MaterialType {
  _id: string;
  title: string;
  pdfs: string[]; // array of PDF URLs or file IDs
  forCourses: string[]; // array of course IDs this material belongs to
  price: string | number; // backend may send as string or number
  accessControl: "purchased" | "free" | "restricted"; // type of access
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number; // mongoose version key
}

interface PDFViewerProps {
  apiData: MaterialType; // typed material object
}

const PDFViewer: React.FC<PDFViewerProps> = ({ apiData }) => {
  const [pdfUrls, setPdfUrls] = useState<string[]>(apiData.pdfs || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (!apiData) return <div>No material found</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <div className="text-gray-600">Loading PDFs...</div>}

      {pdfUrls.length > 0 && (
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-bold text-gray-700">{apiData.title}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={zoomOut}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                −
              </button>
              <span className="text-gray-700">{Math.round(scale * 100)}%</span>
              <button
                onClick={zoomIn}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <iframe
              src={pdfUrls[currentIndex]}
              className="w-full h-[80vh] border-0 rounded-xl shadow-lg bg-white"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center top",
              }}
            />
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap justify-center gap-2">
            {pdfUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  currentIndex === i
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Page {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
