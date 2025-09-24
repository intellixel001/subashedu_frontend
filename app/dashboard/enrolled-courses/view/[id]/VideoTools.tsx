"use client";

interface Content {
  name: string;
  type?: string;
  description?: string;
  link?: string;
}

interface Props {
  content: Content;
}

export default function VideoTools({ content }: Props) {
  return (
    <div
      className="p-4 rounded-2xl shadow-lg flex flex-col gap-4
      bg-gradient-to-r from-gray-800 to-gray-700 transition-all duration-300"
    >
      {/* Content Info */}
      <div>
        <h3 className="text-white font-semibold text-lg">{content.name}</h3>
        <p className="text-sm text-gray-300">{content.type}</p>
        <p className="text-xs text-gray-400">
          <div
            dangerouslySetInnerHTML={{ __html: content.description || "" }}
          />
        </p>
      </div>
    </div>
  );
}
