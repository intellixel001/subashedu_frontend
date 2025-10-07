"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ✅ Use fast, globally cached worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const pdfUrl = apiData?.pdfs?.[currentIndex]?.url;

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (!pdfUrl) return <div>No PDF found</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
      <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
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

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-gray-500">Loading PDF...</div>}
            options={{
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="mb-4 flex justify-center"
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={<div className="text-gray-400">Loading page...</div>}
                />
              </div>
            ))}
          </Document>
        </div>

        {/* File Switcher */}
        <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap justify-center gap-2">
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
    </div>
  );
};

export default PDFViewer;
