// "use client";

// import React, { useState } from "react";

// export interface PDFFile {
//   _id: string;
//   url: string;
//   publicId: string;
// }

// export interface MaterialType {
//   _id: string;
//   title: string;
//   pdfs: PDFFile[]; // ✅ fixed type
//   forCourses: string[];
//   price: string | number;
//   accessControl: "purchased" | "free" | "restricted";
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface PDFViewerProps {
//   apiData: MaterialType;
//   materialId?: string;
// }

// const PDFViewer: React.FC<PDFViewerProps> = ({ apiData }) => {
//   // ✅ map pdfs to URLs
//   const [pdfUrls] = useState<string[]>(apiData.pdfs.map((p) => p.url));
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [scale, setScale] = useState(1);

//   const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
//   const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

//   if (!apiData) return <div>No material found</div>;

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
//       {pdfUrls.length > 0 && (
//         <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
//             <h2 className="text-lg font-bold text-gray-700">{apiData.title}</h2>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={zoomOut}
//                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
//               >
//                 −
//               </button>
//               <span className="text-gray-700">{Math.round(scale * 100)}%</span>
//               <button
//                 onClick={zoomIn}
//                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
//               >
//                 +
//               </button>
//             </div>
//           </div>

//           {/* PDF Frame */}
//           <div className="flex-1 bg-gray-100 flex items-center justify-center">
//             <iframe
//               src={pdfUrls[currentIndex]}
//               className="w-full h-[90vh] border-0 rounded-xl shadow-lg bg-white"
//               style={{
//                 transform: `scale(${scale})`,
//                 transformOrigin: "center top",
//               }}
//             />
//           </div>

//           {/* Pagination buttons */}
//           <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap justify-center gap-2">
//             {apiData.pdfs.map((pdf, i) => (
//               <button
//                 key={pdf._id}
//                 onClick={() => setCurrentIndex(i)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition ${
//                   currentIndex === i
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 File {i + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFViewer;
"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ✅ Correct worker setup for Next.js 15
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface MaterialType {
  _id: string;
  title: string;
  pdfs: PDFFile[]; // ✅ fixed type
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
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pdfUrl = apiData?.pdfs?.[currentIndex]?.url;

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  if (!apiData) return <div>No material found</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center">
      {pdfUrl && (
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
          <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 overflow-auto">
            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={currentPage} scale={scale} />
            </Document>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 px-4 py-3 border-t flex flex-wrap justify-between items-center gap-2">
            <div className="flex gap-2 items-center">
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

            {/* File Switcher */}
            <div className="flex flex-wrap gap-2">
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
      )}
    </div>
  );
};

export default PDFViewer;
