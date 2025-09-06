"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";

export function ClassModal({
  isOpen,
  onClose,
  isLiveModal,
  formData,
  handleInputChange,
  handleSubmit,
  courses = [],
  isCreating,
  error,
  currentClass,
  subjects = [],
}) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoError, setVideoError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validTypes.includes(file.type)) {
        setVideoError("Please upload a valid video file (MP4, WebM, or OGG)");
        setVideoFile(null);
      } else if (file.size > 100 * 1024 * 1024) {
        setVideoError("Video file size must be less than 100MB");
        setVideoFile(null);
      } else {
        setVideoError(null);
        setVideoFile(file);
      }
    } else {
      setVideoError(null);
      setVideoFile(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isLiveModal && !videoFile && !formData.videoLink) {
      setVideoError("Please upload a video file or provide a video link");
      return;
    }

    const sanitizedFormData = {
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      instructor: formData.instructor.trim(),
      courseId: formData.courseId,
      videoLink: formData.videoLink?.trim() || "",
    };

    handleSubmit(e, videoFile, sanitizedFormData);
  };

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
                    ? isLiveModal
                      ? "Edit Live Class"
                      : "Edit Recorded Class"
                    : isLiveModal
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
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <select
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select a subject</option>
                      {subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No subjects available
                        </option>
                      )}
                   ecosystems </select>
                  </div>

                  <div>
                    <label
                      htmlFor="instructor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instructor
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      id="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="courseId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Course
                    </label>
                    <select
                      name="courseId"
                      id="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select a course</option>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.title} ({course.courseFor})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No courses available
                        </option>
                      )}
                    </select>
                  </div>

                  {isLiveModal ? (
                    <div>
                      <label
                        htmlFor="videoLink"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video Link (mandatory)
                      </label>
                      <input
                        type="url"
                        name="videoLink"
                        id="videoLink"
                        value={formData.videoLink || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                        placeholder="https://youtube.com/video (unlisted)"
                        disabled={isCreating}
                      />
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="video"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video File
                      </label>
                      <input
                        type="file"
                        name="video"
                        id="video"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-myred file:text-white hover:file:bg-myred-dark disabled:bg-gray-100"
                        disabled={isCreating}
                        required={!currentClass && !formData.videoLink}
                      />
                      {videoError && (
                        <p className="mt-1 text-sm text-red-600">
                          {videoError}
                        </p>
                      )}
                      {formData.videoLink && (
                        <p className="mt-1 text-sm text-gray-500">
                          Current video: {formData.videoLink}
                        </p>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onClose}
                      disabled={isCreating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-myred px-4 py-2 text-sm font-medium text-white hover:bg-myred-dark focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : currentClass ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
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