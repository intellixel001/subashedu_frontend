"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Dynamically import to avoid SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Use the local worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.js";

interface PDFViewerProps {
  materialId: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ materialId }) => {
  const [file, setFile] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchPDF = useCallback(() => {
    setIsLoading(true);
    setError("");

    axios
      .get(`${API_URL}/api/stream-material/${materialId}`, {
        withCredentials: true,
        responseType: "arraybuffer",
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        setFile(blob);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      });
  }, [materialId, API_URL]);

  useEffect(() => {
    fetchPDF();
  }, [fetchPDF]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4">
      {error && <div className="text-red-500">{error}</div>}

      {isLoading && <div>Loading PDF...</div>}

      {file && (
        <div className="w-full max-w-4xl bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">PDF Viewer</h2>
            <div className="flex gap-2 items-center">
              <button
                onClick={zoomOut}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                −
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button
                onClick={zoomIn}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) =>
              setError(`Failed to load PDF: ${err.message}`)
            }
          >
            {Array.from({ length: numPages }, (_, index) => (
              <Page
                key={index + 1}
                pageNumber={index + 1}
                scale={scale}
                renderAnnotationLayer
                renderTextLayer
                className="mb-4 shadow"
              />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
