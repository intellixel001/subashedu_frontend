"use client";

import React, { useRef, useState } from "react";

interface ThumbnailUploaderProps {
  label?: string;
  previewUrl?: string | null;
  onFileChange: (fileUrl: string | null) => void; // send URL to parent
  onRemove?: () => void;
}

export default function ThumbnailUploader({
  label = "Image",
  previewUrl,
  onFileChange,
  onRemove,
}: ThumbnailUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    const match = document.cookie.match(/adminAccessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // If previous image exists, send as query param
      const url = previewUrl
        ? `/api/admin/upload-image?prev=${encodeURIComponent(previewUrl)}`
        : "/api/admin/upload-image";

      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        credentials: "include", // only once
      });

      const data = await res.json();
      if (data.url) {
        // Send uploaded URL to parent
        onFileChange(data.url);
      } else {
        alert(data.message || "Error uploading thumbnail");
        onFileChange(null);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      onFileChange(null);
    } finally {
      setLoading(false);
    }

    // reset input so same file can be uploaded again if needed
    e.target.value = "";
  };

  const handleRemove = () => {
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
        {label}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <div className="w-24 h-16 rounded-md overflow-hidden border border-border dark:border-border">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              width={96}
              height={64}
              className="w-full h-full object-cover glow"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground dark:bg-muted dark:text-muted-foreground">
              {loading ? "Uploading..." : "No thumbnail"}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={triggerFileInput}
          className="px-3 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
        >
          {previewUrl ? (loading ? "Uploading..." : "Change") : "Upload"}
        </button>

        {previewUrl && !loading && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
