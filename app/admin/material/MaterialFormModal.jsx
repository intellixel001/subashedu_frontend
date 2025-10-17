"use client";

import ThumbnailUploader from "@/app/components/ThumbnailUploader";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const MaterialFormModal = ({
  isOpen,
  isEditing,
  formData,
  selectedCourses,
  courses,
  onClose,
  onSubmit,
  onChange,
  onFileChange,
  onCourseSelect,
  onRemoveCourse,
  setFormData,
}) => {
  if (!isOpen) return null;

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (formData && formData.image && typeof formData.image === "string") {
      setThumbnailPreview(formData.image);
    }
  }, [formData?.image]);

  // API-based upload for thumbnail

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setThumbnailPreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 text-white flex items-center justify-center z-50">
      <div className="bg-[var(--card)] rounded-2xl shadow-lg w-full max-w-2xl p-6 relative max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {isEditing ? "Update Material" : "Create New Material"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg bg-[var(--card)]"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price || ""}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg bg-[var(--card)]"
              required
            />
          </div>

          {/* Access Control */}
          <div>
            <label className="block mb-2">Access Control</label>
            <select
              name="accessControl"
              value={formData.accessControl || "restricted"}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg bg-[var(--card)]"
            >
              <option value="purchased">Paid</option>
              <option value="free">Free</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* Courses */}
          <div>
            <label className="block mb-2">Courses</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCourses?.map((id) => {
                const course = courses.find((c) => c._id === id);
                return (
                  <span
                    key={id}
                    className="px-3 py-1 bg-[var(--myred-secondary)]/20 text-[var(--myred)] rounded-full flex items-center"
                  >
                    {course?.title || "Unknown"}
                    <button
                      type="button"
                      onClick={() => onRemoveCourse(id)}
                      className="ml-2 text-sm"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <select
              onChange={(e) => onCourseSelect(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-[var(--card)]"
            >
              <option value="">Select a course...</option>
              {courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* PDFs */}
          <div>
            <label className="block mb-2">Upload PDFs</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="w-full px-4 py-2 border rounded-lg bg-[var(--card)]"
            />
            {formData.pdfs?.length > 0 && (
              <ul className="mt-2 text-sm">
                {formData.pdfs.map((file, index) => (
                  <li key={index} className="flex justify-between">
                    {typeof file === "string" ? file : file.name}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          pdfs: prev.pdfs.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Thumbnail Uploader */}
          <ThumbnailUploader
            label="Material Thumbnail"
            previewUrl={thumbnailPreview}
            onFileChange={(file) => {
              setFormData((prev) => ({ ...prev, image: file }));
              if (file) {
                setThumbnailPreview(file);
              } else {
                setThumbnailPreview(null);
              }
            }}
            onRemove={() => {
              setFormData((prev) => ({ ...prev, image: "" }));
              setThumbnailPreview(null);
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--myred)] text-white rounded-lg hover:bg-[var(--myred-secondary)] flex items-center justify-center gap-2"
          >
            <FaCheckCircle />
            {isEditing ? "Update Material" : "Create Material"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaterialFormModal;
