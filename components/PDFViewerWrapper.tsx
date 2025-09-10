"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/app/components/PDFViewer"), {
  ssr: false,
});

interface PDFViewerWrapperProps {
  materialId: string;
}

export default function PDFViewerWrapper({
  materialId,
}: PDFViewerWrapperProps) {
  return <PDFViewer materialId={materialId} />;
}
