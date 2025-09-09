"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface UserPreferenceModalProps {
  isOpen: boolean;
}

export function UserPreferenceModal({ isOpen }: UserPreferenceModalProps) {
  const [open, setOpen] = useState(isOpen);
  const [position, setPosition] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) {
      setError("Please select a position");
      return;
    }
    if (position === "student" && !studentLevel) {
      setError("Please select a level (SSC or HSC)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/preferences`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            position,
            level: position === "student" ? studentLevel : null,
          }),
        }
      );

      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to save preferences");

      // ✅ Close modal after success
      setOpen(false);
    } catch (err: unknown) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => setOpen(false)}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all">
                {/* Header */}
                <Dialog.Title
                  as="h3"
                  className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex justify-between items-center"
                >
                  <span>
                    🎉 Welcome to <span className="text-myred">SuvashEdu</span>
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    <FaTimes size={18} />
                  </button>
                </Dialog.Title>

                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Let’s personalize your experience. Please select your role
                  below.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Position */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={position}
                      onChange={(e) => {
                        setPosition(e.target.value);
                        setStudentLevel(""); // reset if changed
                      }}
                      className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-myred focus:border-myred sm:text-sm px-3 py-2"
                      disabled={loading}
                      required
                    >
                      <option value="">Select position</option>
                      <option value="student">Student</option>
                      <option value="admission">Admission Preparation</option>
                      <option value="job">Job Preparation</option>
                    </select>
                  </div>

                  {/* Student Level */}
                  {position === "student" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Level
                      </label>
                      <select
                        value={studentLevel}
                        onChange={(e) => setStudentLevel(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-myred focus:border-myred sm:text-sm px-3 py-2"
                        disabled={loading}
                        required
                      >
                        <option value="">Select level</option>
                        <option value="ssc">SSC</option>
                        <option value="hsc">HSC</option>
                      </select>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-myred text-white font-semibold hover:bg-myred-dark transition disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Done"}
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
