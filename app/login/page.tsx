"use client";

import { loginStudent } from "@/actions/loginStudent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { FaIdCard, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginStudent, {
    errors: [],
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7] px-4 sm:px-6 lg:px-12">
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center ">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FCA00A]">
            সুভাস এডু
          </h1>
          <p className="mt-2 text-black-600">লগইন সম্পন্ন করুন </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200 ">
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

          <form action={action} className="space-y-5">
            {/* Registration No / Email */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-gray-700"
              >
                রেজিস্ট্রেশন নম্বর অথবা ইমেইল
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaIdCard />
                </span>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  required
                  placeholder="আপনার রেজিস্ট্রেশন নম্বর বা ইমেইল লিখুন"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    state.errors?.some((e) => e.path.includes("loginId"))
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                পাসওয়ার্ড
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
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    state.errors?.some((e) => e.path.includes("password"))
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#f9f9f9] focus:border-[#f9f9f9] transition`}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2 px-4 bg-[#FCA00A] hover:bg-[#9f6404] text-black rounded-lg font-semibold transition disabled:opacity-50"
            >
              {pending ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
            <Link
              href="/forgot-password"
              className="hover:text-myred-secondary transition"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
            <Link
              href="/register"
              className="hover:text-myred-secondary transition"
            >
              নতুন একাউন্ট তৈরি করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
