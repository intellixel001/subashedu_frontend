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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-r-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-myred-secondary">
              সুবাস এডু
            </h1>
            <p className="mt-2 text-gray-600">আপনার মানসম্মত শিক্ষার গেটওয়ে</p>
          </div>

          {/* Form Card */}
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
                    } focus:outline-none focus:ring-2 focus:ring-myred-secondary focus:border-myred-secondary transition`}
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
                    } focus:outline-none focus:ring-2 focus:ring-myred-secondary focus:border-myred-secondary transition`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={pending}
                className="w-full py-2 px-4 bg-myred-secondary hover:bg-myred text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {pending ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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

        {/* Right Side: Image / Illustration */}
        <div className="w-full lg:w-1/2 relative hidden lg:block">
          <img
            src="https://media.gettyimages.com/id/530956742/photo/amman-jordan-teaching-at-the-school-bilayer-al-quds-amman-there-jordanian-and-syrian-children.jpg?s=612x612&w=0&k=20&c=1grTyqcVzv6-yPhgJxgkQxMCy5VCIvZq8YrEi7UJ4r0="
            alt="Learning Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/90"></div>
        </div>
      </div>
    </div>
  );
}
