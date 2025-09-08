"use client";

import { useAdminDashboard } from "@/context/adminDashboardContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface FreeClass {
  _id: string;
  title: string;
  subject: string;
  videoLink: string;
  instructor: string;
  classFor: string;
  createdAt: string;
  updatedAt: string;
}

interface FreeClassFormData {
  title: string;
  subject: string;
  instructor: string;
  classFor: string;
  videoLink: string;
}

interface FreeClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FreeClassFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (
    e: React.FormEvent,
    sanitizedFormData: FreeClassFormData
  ) => void;
  isCreating: boolean;
  error: string | null;
  currentFreeClass: FreeClass | null;
}

export function FreeClassModal({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  isCreating,
  error,
  currentFreeClass,
}: FreeClassModalProps) {
  const { staff, addStaff } = useAdminDashboard();

  useEffect(() => {
    async function getStaffs() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-staffs`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        addStaff(result.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
      }
    }
    if (!staff?.length && staff?.length === 0) {
      getStaffs();
    }
  }, [staff]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoLink) {
      alert("Please provide a video link");
      return;
    }

    // Sanitize form data
    const sanitizedFormData: FreeClassFormData = {
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      instructor: formData.instructor.trim(),
      classFor: formData.classFor,
      videoLink: formData.videoLink.trim(),
    };

    handleSubmit(e, sanitizedFormData);
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
                  {currentFreeClass ? "Edit Free Class" : "Create Free Class"}
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

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  {/* Instructor */}
                  <div>
                    <label
                      htmlFor="instructor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instructor
                    </label>
                    <select
                      name="instructor"
                      id="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select an instructor</option>
                      {staff.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.fullName} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class For */}
                  <div>
                    <label
                      htmlFor="classFor"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Class For
                    </label>
                    <select
                      name="classFor"
                      id="classFor"
                      value={formData.classFor}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isCreating}
                    >
                      <option value="">Select a class type</option>
                      <option value="hsc">HSC</option>
                      <option value="ssc">SSC</option>
                      <option value="job">Job preparation</option>
                      <option value="admission">Admission</option>
                    </select>
                  </div>

                  {/* Video Link */}
                  <div>
                    <label
                      htmlFor="videoLink"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Video Link (YouTube)
                    </label>
                    <input
                      type="url"
                      name="videoLink"
                      id="videoLink"
                      value={formData.videoLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-myred focus:ring-myred sm:text-sm disabled:bg-gray-100"
                      placeholder="https://youtube.com/video"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
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
                      ) : currentFreeClass ? (
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
