"use client";

export default function RecordedClassPlayer({
  videoLink,
}: {
  videoLink?: string;
}) {
  if (!videoLink) {
    return <p className="text-red-500">No video available</p>;
  }

  // Handle YouTube embedding
  const embedUrl =
    videoLink.includes("youtube.com") || videoLink.includes("youtu.be")
      ? videoLink.replace("watch?v=", "embed/")
      : videoLink;

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
      <iframe
        src={embedUrl}
        title="Recorded Class"
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
