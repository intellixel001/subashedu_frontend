"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTimes } from "react-icons/fa";
import { Class, ClassFormData } from "../admin/manage-class/page";

interface Instructor {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
  courseFor: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCreating: boolean;
  error?: string | null;
  currentClass?: Class;
  formData: ClassFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent, formData: ClassFormData) => void;
  courses?: Course[];
  instructors?: Instructor[];
  subjects?: string[];
}

export function ClassModal({
  isOpen,
  onClose,
  isCreating,
  error,
  currentClass,
  formData,
  handleInputChange,
  handleSubmit,
  courses = [],
  instructors = [],
  subjects = [],
}: ClassModalProps) {
  const CLASS_TYPES = [
    { label: "Class Courses (9-12)", value: "class" },
    { label: "Admission Courses", value: "admission" },
    { label: "Job Preparation Courses", value: "job" },
  ];

  const BILLING_TYPES = [
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
  ];

  const CLASS_OPTIONS = [
    { label: "Recorded", value: "recorded" },
    { label: "Live", value: "live" },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) return alert("Title is required");
    if (!formData.image) return alert("image is required");
    if (!formData.subject) return alert("Subject is required");
    if (!formData.instructorId) return alert("Instructor is required");
    if (!formData.courseId) return alert("Course is required");
    if (!formData.courseType) return alert("Course type is required");
    if (!formData.billingType) return alert("Billing type is required");
    if (!formData.type) return alert("Class type is required");

    if (formData.type === "recorded" && !formData.videoLink?.trim())
      return alert("Video link is required for recorded class");

    if (formData.type === "live") {
      if (!formData.videoLink?.trim())
        return alert("Live link is required for live class");
      if (!formData.startTime)
        return alert("Start time is required for live class");
    }

    handleSubmit(e, formData);
  };

  console.log(formData);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-[.35]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {currentClass
                    ? formData.type === "live"
                      ? "Edit Live Class"
                      : "Edit Recorded Class"
                    : formData.type === "live"
                    ? "Create Live Class"
                    : "Create Recorded Class"}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isCreating}
                  >
                    <FaTimes />
                  </button>
                </Dialog.Title>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Instructor
                    </label>
                    <select
                      name="instructorId"
                      value={formData.instructorId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select instructor</option>
                      {instructors.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title} ({course.courseFor})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course Type
                    </label>
                    <select
                      name="courseType"
                      value={formData.courseType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select type</option>
                      {CLASS_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Billing Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Billing Type
                    </label>
                    <select
                      name="billingType"
                      value={formData.billingType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      {BILLING_TYPES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Class Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video / Live Link */}
                  {formData.type === "recorded" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Video Link
                      </label>
                      <input
                        type="url"
                        name="videoLink"
                        value={formData.videoLink || ""}
                        onChange={handleInputChange}
                        placeholder="https://your-video-link.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                        required
                        disabled={isCreating}
                      />
                    </div>
                  )}

                  {formData.type === "live" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Live Link (Google Meet/Zoom)
                      </label>
                      <input
                        type="url"
                        name="videoLink"
                        value={formData.videoLink || ""}
                        onChange={handleInputChange}
                        placeholder="https://meet.google.com/xyz"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                        required
                        disabled={isCreating}
                      />
                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                        required
                        disabled={isCreating}
                      />
                    </div>
                  )}

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image || ""}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-myred px-4 py-2 text-sm font-medium text-white hover:bg-myred-dark focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreating}
                    >
                      {isCreating
                        ? "Creating..."
                        : currentClass
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
