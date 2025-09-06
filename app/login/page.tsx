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
    <div className="min-h-screen flex items-center justify-center pt-30 pb-4 px-4 bg-[var(--background)] animate-gradientBG">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--myred)] text-shine">Suvash Edu</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Your gateway to quality education
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--card)] rounded-[var(--radius)] shadow-md overflow-hidden border border-[var(--border)] transition-all hover:shadow-lg hover:glow animate-fade-in">
          {/* Card Header */}
          <div className="bg-[var(--myred)] py-4 px-6">
            <h2 className="text-xl font-semibold text-[var(--primary-foreground)] text-center text-shine">
              Student Login
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-5">
            {/* Display general error message */}
            {state?.message && (
              <div
                className={`p-3 rounded-[var(--radius-sm)] text-sm ${
                  state.success
                    ? "bg-[var(--chart-1)]/10 text-[var(--chart-1)]"
                    : "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                } border border-[var(--destructive)]`}
              >
                {state.message}
              </div>
            )}

            <form action={action} className="space-y-5">
              {/* Username/Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="loginId"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Registration No. or Email
                </label>
                <div className="relative rounded-[var(--radius-sm)] shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="flex space-x-1">
                      <FaIdCard className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    required
                    className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                      state.errors?.some((e) => e.path.includes("loginId"))
                        ? "border-[var(--destructive)]"
                        : "border-[var(--border)]"
                    } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)] transition-all`}
                    placeholder="Enter registration no. or email"
                  />
                </div>
                {state.errors
                  ?.filter((error) => error.path.includes("loginId"))
                  .map((error, index) => (
                    <p key={index} className="text-sm text-[var(--destructive)] mt-1">
                      {error.message}
                    </p>
                  ))}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  Password
                </label>
                <div className="relative rounded-[var(--radius-sm)] shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`focus:ring-[var(--ring)] focus:border-[var(--myred)] block w-full pl-10 pr-3 py-2 border text-[var(--foreground)] bg-[var(--card)] ${
                      state.errors?.some((e) => e.path.includes("password"))
                        ? "border-[var(--destructive)]"
                        : "border-[var(--border)]"
                    } rounded-[var(--radius-sm)] placeholder-[var(--muted-foreground)] transition-all`}
                    placeholder="Enter your password"
                  />
                </div>
                {state.errors
                  ?.filter((error) => error.path.includes("password"))
                  .map((error, index) => (
                    <p key={index} className="text-sm text-[var(--destructive)] mt-1">
                      {error.message}
                    </p>
                  ))}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-[var(--myred)] focus:ring-[var(--ring)] border-[var(--border)] rounded-[var(--radius-sm)]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-[var(--muted-foreground)]"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[var(--myred)] hover:text-[var(--myred-secondary)] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[var(--radius-sm)] shadow-sm text-sm font-medium text-[var(--primary-foreground)] bg-[var(--myred)] hover:bg-[var(--myred-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
              >
                {pending ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
                  New to Suvash Edu?
                </span>
              </div>
            </div>

            {/* Register Button */}
            <Link
              href="/register"
              className="w-full flex justify-center py-2 px-4 border border-[var(--border)] rounded-[var(--radius-sm)] shadow-sm text-sm font-medium text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ring)] transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Suvash Edu. All rights reserved.
        </div>
      </div>
    </div>
  );
}