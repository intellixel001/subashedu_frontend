"use client";
import React, { useEffect, useState } from "react";
import { Content } from "./ContentItem";

interface ContentFormProps {
  content?: Content;
  onSuccess: (content: Content) => void;
}

export default function ContentForm({ content, onSuccess }: ContentFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Content["type"]>("video");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [requiredForNext, setRequiredForNext] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if (content) {
      setName(content.name);
      setType(content.type);
      setLink(content.link);
      setDescription(content.description);
      setRequiredForNext(content.requiredForNext || false);
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSuccess({
      name,
      type,
      link,
      description,
      requiredForNext,
      ...(content?._id && { _id: content._id }), // pass _id only if editing
    });

    // reset form only when adding new content
    if (!content) {
      setName("");
      setType("video");
      setLink("");
      setDescription("");
      setRequiredForNext(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-gray-50 p-4 rounded-lg shadow"
    >
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Content Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Lecture 1: Basics"
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Type */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Content Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Content["type"])}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="quiz">Quiz</option>
          <option value="note">Note</option>
          <option value="link">External Link</option>
        </select>
      </div>

      {/* Link */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Content Link / File URL
        </label>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain what this content is about..."
          rows={3}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
          required
        />
      </div>

      {/* Required Toggle */}
      <div className="flex items-center gap-2">
        <input
          id="required"
          type="checkbox"
          checked={requiredForNext}
          onChange={(e) => setRequiredForNext(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="required" className="text-sm text-gray-700">
          Required for next lesson
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          {content ? "Update Content" : "Add Content"}
        </button>
      </div>
    </form>
  );
}
