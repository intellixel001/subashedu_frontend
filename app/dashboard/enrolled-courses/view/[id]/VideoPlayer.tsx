"use client";

interface Props {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: Props) {
  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
      <video controls className="w-full h-full">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  );
}
