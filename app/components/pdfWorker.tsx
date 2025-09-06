// app/components/pdfWorker.js
import { pdfjs } from 'react-pdf';

// Load worker from node_modules
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
