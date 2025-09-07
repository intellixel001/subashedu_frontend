/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker using a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  materialId: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ materialId }) => {
  const router = useRouter();
  const [file, setFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string>("");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // PDF.js options for cMaps and standard fonts
  const options = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  // Fetch PDF
  const fetchPDF = useCallback(() => {
    setIsLoading(true);
    setError("");
    fetch(`${API_URL}/api/stream-material/${materialId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized: Please log in");
        }
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Fetch error response:", errorText);
          throw new Error(
            `Failed to fetch PDF: ${res.status} ${res.statusText}`
          );
        }
        return res.blob();
      })
      .then((blob) => {
        setFile(blob);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch PDF error:", err);
        setError(`Failed to load PDF: ${err.message}`);
        setIsLoading(false);
      });
  }, [materialId, router]);

  useEffect(() => {
    fetchPDF();
    return () => {
      setFile(null);
    };
  }, [fetchPDF]);

  // Handle document load
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    pageRefs.current = new Array(numPages).fill(null);
  };

  // Toggle full-screen
  const toggleFullScreen = async () => {
    if (!containerRef.current) return;

    if (!isFullScreen) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error("Failed to enter full-screen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullScreen(false);
      } catch (err) {
        console.error("Failed to exit full-screen:", err);
      }
    }
  };

  // Handle full-screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  // Navigate to page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setCurrentPage(page);
      const pageElement = pageRefs.current[page - 1];
      if (pageElement && containerRef.current) {
        const offset =
          pageElement.offsetTop -
          containerRef.current.offsetTop -
          (toolbarRef.current?.offsetHeight || 0);
        containerRef.current.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  };

  // Handle page input
  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      goToPage(value);
    }
  };

  // Handle scroll to update current page
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !pageRefs.current.length) return;

    const scrollTop = containerRef.current.scrollTop + 100; // Offset for better accuracy
    let newPage = currentPage;

    for (let i = 0; i < pageRefs.current.length; i++) {
      const pageEl = pageRefs.current[i];
      if (pageEl) {
        const { offsetTop, offsetHeight } = pageEl;
        if (scrollTop >= offsetTop && scrollTop < offsetTop + offsetHeight) {
          newPage = i + 1;
          break;
        }
      }
    }

    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      if (inputRef.current) {
        inputRef.current.value = newPage.toString();
      }
    }
  }, [currentPage, numPages]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4 sm:py-6 justify-center">
      {error && (
        <div className="text-red-500 p-4 bg-white rounded-lg shadow-md max-w-2xl w-full text-center">
          <p>{error}</p>
          <button
            onClick={fetchPDF}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Retry
          </button>
        </div>
      )}
      {isLoading && !error && (
        <div className="p-4 text-gray-600 bg-white rounded-lg shadow-md max-w-2xl w-full text-center text-sm sm:text-base">
          <svg
            className="animate-spin h-5 w-5 mx-auto text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>Loading PDF...</p>
        </div>
      )}
      {file && !isLoading && !error && (
        <div
          ref={containerRef}
          className={`w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-x-hidden ${
            isFullScreen ? "fixed inset-0 z-50 h-screen" : "mt-16 sm:mt-20"
          } flex flex-col`}
        >
          <div
            ref={toolbarRef}
            className={`flex flex-col p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 ${
              isFullScreen ? "fixed w-full max-w-4xl" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                PDF Viewer
              </h2>
              <button
                onClick={toggleFullScreen}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md text-sm sm:text-base"
                title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
              >
                {isFullScreen ? "Exit Full Screen" : "Full Screen"}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                title="Previous Page"
              >
                ←
              </button>
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max={numPages || 1}
                  defaultValue={currentPage}
                  onChange={handlePageInput}
                  className="w-12 sm:w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <span className="text-gray-600 text-sm sm:text-base">
                  / {numPages}
                </span>
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === numPages}
                className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                title="Next Page"
              >
                →
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={zoomOut}
                  className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all text-sm sm:text-base"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="text-gray-600 text-sm sm:text-base">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all text-sm sm:text-base"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ${
              isFullScreen
                ? "h-[calc(100vh-8rem)] sm:h-[calc(100vh-9rem)]"
                : "max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-16rem)]"
            }`}
          >
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                setError(`Error loading PDF: ${error.message}`)
              }
              options={options}
              className="flex flex-col items-center p-2 sm:p-4 w-full"
            >
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    ref={(el) => {
                      pageRefs.current[index] = el;
                    }}
                    className="mb-4 sm:mb-6 w-full max-w-full"
                  >
                    <div className="relative w-full max-w-full overflow-hidden">
                      <Page
                        pageNumber={index + 1}
                        scale={scale}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                        className="shadow-lg border flex justify-center border-gray-200 rounded-md w-full"
                        width={
                          window.innerWidth < 640
                            ? window.innerWidth - 16
                            : undefined
                        }
                      />
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                      Page {index + 1} of {numPages}
                    </p>
                  </div>
                ))}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
