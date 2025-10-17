"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ✅ Correct worker setup for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface MaterialType {
  _id: string;
  title: string;
  pdfs: PDFFile[];
  forCourses: string[];
  price: string | number;
  accessControl: "purchased" | "free" | "restricted";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PDFFile {
  _id: string;
  url: string;
  publicId: string;
}

interface PDFViewerProps {
  apiData: MaterialType;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ apiData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const pdfUrl = apiData?.pdfs?.[currentIndex]?.url;

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1); // reset page when switching files
  };

  // Disable right-click globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (!apiData) return <div>No material found</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center select-none">
      {pdfUrl && (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
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

          {/* PDF Viewer - one page at a time */}
          <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 overflow-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="text-gray-500">Loading PDF...</div>}
            >
              <Page
                key={`page_${currentPage}`}
                pageNumber={currentPage}
                scale={scale}
                loading={<div>Loading page {currentPage}...</div>}
                className="mb-4"
              />
            </Document>

            {/* Page navigation */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {numPages || "?"}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    numPages ? Math.min(p + 1, numPages) : p
                  )
                }
                disabled={!numPages || currentPage >= (numPages || 0)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* File Switcher */}
          <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap gap-2 justify-center">
            {apiData.pdfs?.map((pdf, i) => (
              <button
                key={pdf._id}
                onClick={() => setCurrentIndex(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  currentIndex === i
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                File {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
