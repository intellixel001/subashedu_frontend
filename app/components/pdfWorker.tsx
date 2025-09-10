import { pdfjs } from "react-pdf";

// Use the local worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.js";
