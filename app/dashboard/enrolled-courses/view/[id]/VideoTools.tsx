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
      {/* Action Buttons */}
      {/* <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105 hover:shadow-lg transition-transform duration-200">
          Take Notes
        </button>
        {content.link && (
          <a
            href={content.link}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 hover:shadow-lg transition-transform duration-200 text-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        )}
      </div> */}
      {/* Content Info */}
      <div>
        <h3 className="text-white font-semibold text-lg">{content.name}</h3>
        <p className="text-sm text-gray-300">{content.type}</p>
        <p className="text-xs text-gray-400">{content.description}</p>
      </div>
    </div>
  );
}
