"use client";

import React, { useEffect, useState } from "react";

interface PDFViewerProps {
  materialId: string;
}

const PDFBookViewer: React.FC<PDFViewerProps> = ({ materialId }) => {
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchPDFs = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_URL}/api/stream-material/${materialId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Error fetching PDFs");

        setPdfUrls(data.urls || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error loading PDFs");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPDFs();
  }, [materialId, API_URL]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
      {/* Error / Loading */}
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && <div className="text-gray-600">Loading PDFs...</div>}

      {pdfUrls.length > 0 && (
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-bold text-gray-700">
              📖 Study Material
            </h2>
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

          {/* PDF Viewer */}
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

          {/* Bottom Page Selector */}
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

export default PDFBookViewer;
