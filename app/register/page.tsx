"use client";

import { registerStudent } from "@/actions/registerStudent";
import Link from "next/link";
import { useActionState } from "react";
import { FaEnvelope, FaLock, FaSchool, FaUser } from "react-icons/fa";

export default function RegistrationPage() {
  const [state, action, pending] = useActionState(registerStudent, {
    errors: [],
    success: false,
    message: "",
  });

  const getError = (fieldName: string) => {
    if (!state?.errors) return null;
    return state.errors.find((error) => error.path?.includes(fieldName))
      ?.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7] sm:px-6 lg:px-12">
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center hover:scale-15px">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FCA00A]">
            সুভাস এডু
          </h1>
          <p className="mt-2 text-black-600">আপনার একাউন্ট এখানে তৈরি করুন</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
          {state?.message && (
            <div
              className={`p-3 rounded-md text-sm mb-4 ${
                state.success
                  ? "bg-green-100 text-green-600 border border-green-300"
                  : "bg-red-100 text-red-600 border border-red-300"
              }`}
            >
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                পূর্ণ নাম*
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser />
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="আপনার নাম লিখুন"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    getError("fullName") ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
              {getError("fullName") && (
                <p className="mt-1 text-sm text-red-500">
                  {getError("fullName")}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                ইমেইল*
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="আপনার ইমেইল লিখুন"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    getError("email") ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
              {getError("email") && (
                <p className="mt-1 text-sm text-red-500">{getError("email")}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                ফোন নম্বর*
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  +88
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{11}"
                  placeholder="01XXXXXXXXX"
                  className={`w-full pl-16 pr-3 py-2 rounded-lg border ${
                    getError("phone") ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
              {getError("phone") && (
                <p className="mt-1 text-sm text-red-500">{getError("phone")}</p>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label
                htmlFor="educationLevel"
                className="block text-sm font-medium text-gray-700"
              >
                শিক্ষাগত বিষয়*
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                required
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border text-gray-700 bg-white ${
                  getError("educationLevel")
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] rounded-lg`}
              >
                <option value="">আপনার বিষয় নির্বাচন করুন</option>
                <option value="class 9">ক্লাস ৯</option>
                <option value="class 10">ক্লাস ১০</option>
                <option value="class 11">ক্লাস ১১</option>
                <option value="class 12">ক্লাস ১২</option>
                <option value="admission">ভর্তি প্রস্তুতি</option>
                <option value="job preparation">চাকরির প্রস্তুতি</option>
              </select>
              {getError("educationLevel") && (
                <p className="mt-1 text-sm text-red-500">
                  {getError("educationLevel")}
                </p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700"
              >
                বিশ্ববিদ্যালয়/কলেজ/স্কুল*
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSchool />
                </span>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  required
                  placeholder="বিশ্ববিদ্যালয়/কলেজ/স্কুলের নাম লিখুন"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    getError("institution")
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
              {getError("institution") && (
                <p className="mt-1 text-sm text-red-500">
                  {getError("institution")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  পাসওয়ার্ড*
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড তৈরি করুন"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      getError("password")
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                  />
                </div>
                {getError("password") && (
                  <p className="mt-1 text-sm text-red-500">
                    {getError("password")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  পাসওয়ার্ড নিশ্চিত করুন*
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      getError("confirmPassword")
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                  />
                </div>
                {getError("confirmPassword") && (
                  <p className="mt-1 text-sm text-red-500">
                    {getError("confirmPassword")}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-[#FCA00A] text-black font-semibold rounded-lg hover:bg-[#9f6404] transition disabled:opacity-50"
            >
              {pending ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট সম্পন্ন করুন"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            ইতিমধ্যেই একাউন্ট আছে?{" "}
            <Link
              href="/login"
              className="text-[#FCA00A] hover:text-[#c37b06] font-medium"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
