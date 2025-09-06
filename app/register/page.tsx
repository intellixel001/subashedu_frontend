"use client";

import { registerStudent } from "@/actions/registerStudent";
import Link from "next/link";
import { useActionState } from "react";
import {
  FaEnvelope,
  FaGraduationCap,
  FaLock,
  FaSchool,
  FaUser,
} from "react-icons/fa";

export default function RegistrationPage() {
  const [state, action, pending] = useActionState(registerStudent, {
    errors: [],
    success: false,
    message: "",
  });

  // Helper function to get error message for a field
  const getError = (fieldName: string) => {
    if (!state?.errors) return null;
    return state.errors.find((error) => error.path?.includes(fieldName))
      ?.message;
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-[var(--background)] animate-gradientBG">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--myred)] text-shine">Suvash Edu</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">Create your student account</p>
        </div>

        {/* Success Message */}
        {state?.success && (
          <div className="mb-6 p-4 bg-[var(--chart-1)]/10 border border-[var(--chart-1)] text-[var(--chart-1)] rounded-[var(--radius)]">
            {state.message}
          </div>
        )}

        {/* General Error Message (only shown if no field-level errors) */}
        {!state?.success && state?.message && state?.errors.length === 0 && (
          <div className="mb-6 p-4 bg-[var(--destructive)]/10 border border-[var(--destructive)] text-[var(--destructive)] rounded-[var(--radius)]">
            {state.message} (Server issue, please try again or contact support)
          </div>
        )}

        {/* Registration Card */}
        <div className="bg-[var(--card)] rounded-[var(--radius)] shadow-md overflow-hidden border border-[var(--border)] animate-fade-in hover:glow">
          {/* Card Header */}
          <div className="bg-[var(--myred)] py-4 px-6">
            <h2 className="text-xl font-semibold text-[var(--primary-foreground)] text-center text-shine">
              Student Registration
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <form
              action={action}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Hidden Inputs for Removed Fields */}
              <input type="hidden" name="sscYear" value="" />
              <input type="hidden" name="hscYear" value="" />
              <input type="hidden" name="fatherName" value="" />
              <input type="hidden" name="motherName" value="" />
              <input type="hidden" name="guardianPhone" value="" />

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--foreground)] flex items-center">
                  <FaUser className="mr-2 text-[var(--myred)]" />
                  Personal Information
                </h3>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    Full Name*
                  </label>
                  <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                        getError("fullName")
                          ? "border-[var(--destructive)]"
                          : "border-[var(--border)]"
                      } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                      placeholder="Your full name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                  {getError("fullName") && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {getError("fullName")}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    Email*
                  </label>
                  <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                        getError("email") ? "border-[var(--destructive)]" : "border-[var(--border)]"
                      } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                      placeholder="your@email.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                  {getError("email") && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {getError("email")}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    Phone Number*
                  </label>
                  <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <span className="text-[var(--muted-foreground)] px-3">+88</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[0-9]{11}"
                      className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-16 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                        getError("phone") ? "border-[var(--destructive)]" : "border-[var(--border)]"
                      } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {getError("phone") && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {getError("phone")}
                    </p>
                  )}
                </div>
              </div>

              {/* Educational Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--foreground)] flex items-center">
                  <FaGraduationCap className="mr-2 text-[var(--myred)]" />
                  Educational Information
                </h3>

                {/* Education Level */}
                <div>
                  <label
                    htmlFor="educationLevel"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    Education Level*
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    required
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border text-[var(--foreground)] bg-[var(--card)] ${
                      getError("educationLevel")
                        ? "border-[var(--destructive)]"
                        : "border-[var(--border)]"
                    } focus:outline-none focus:ring-[var(--ring)] focus:border-[var(--myred)] rounded-[var(--radius-sm)]`}
                  >
                    <option value="">Select your level</option>
                    <option value="class 9">Class 9</option>
                    <option value="class 10">Class 10</option>
                    <option value="class 11">Class 11</option>
                    <option value="class 12">Class 12</option>
                    <option value="admission">Admission Preparation</option>
                    <option value="job preparation">Job Preparation</option>
                  </select>
                  {getError("educationLevel") && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {getError("educationLevel")}
                    </p>
                  )}
                </div>

                {/* School/College */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-sm font-medium text-[var(--foreground)]"
                  >
                    School/College Name*
                  </label>
                  <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                    <input
                      id="institution"
                      name="institution"
                      type="text"
                      required
                      className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                        getError("institution")
                          ? "border-[var(--destructive)]"
                          : "border-[var(--border)]"
                      } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                      placeholder="Institution name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSchool className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                  {getError("institution") && (
                    <p className="mt-1 text-sm text-[var(--destructive)]">
                      {getError("institution")}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium text-[var(--foreground)] flex items-center">
                  <FaLock className="mr-2 text-[var(--myred)]" />
                  Account Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[var(--foreground)]"
                    >
                      Password*
                    </label>
                    <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                          getError("password")
                            ? "border-[var(--destructive)]"
                            : "border-[var(--border)]"
                        } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                        placeholder="Create password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </div>
                    {getError("password") && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">
                        {getError("password")}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-[var(--foreground)]"
                    >
                      Confirm Password*
                    </label>
                    <div className="mt-1 relative rounded-[var(--radius-sm)] shadow-sm">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                          getError("confirmPassword")
                            ? "border-[var(--destructive)]"
                            : "border-[var(--border)]"
                        } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)]`}
                        placeholder="Confirm password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </div>
                    {getError("confirmPassword") && (
                      <p className="mt-1 text-sm text-[var(--destructive)]">
                        {getError("confirmPassword")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[var(--radius-sm)] shadow-sm text-sm font-medium text-[var(--primary-foreground)] bg-[var(--myred)] hover:bg-[var(--myred-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                >
                  {pending ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-[var(--muted-foreground)]">Already have an account? </span>
              <Link
                href="/login"
                className="font-medium text-[var(--myred)] hover:text-[var(--myred-secondary)]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Debug Info (uncomment for troubleshooting) */}
        {/* {state?.message && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>Debug Info:</p>
            <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        )} */}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Suvash Edu. All rights reserved.
        </div>
      </div>
    </div>
  );
}