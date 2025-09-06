"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";

const staffLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Credentials = z.infer<typeof staffLoginSchema>;

export default function StaffLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(staffLoginSchema),
  });

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = "/management";
    }
  }, [shouldRedirect]);

  const onSubmit = async (data: Credentials) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Login failed");

      toast.success("Login successful!");
      setShouldRedirect(true);
    } catch (err) {
      const message = err?.message || "Login failed";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-[#3478F6] py-5 px-6">
          <h2 className="text-xl font-semibold text-white text-center">Suvash Edu Management Portal</h2>
        </div>

        <div className="p-6 space-y-6">
          {serverError && (
            <div className="text-sm text-red-700 bg-red-100 border border-red-400 p-3 rounded-md">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-[#3478F6] focus:border-[#3478F6] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="user01@example.com"
                  {...register("email")}
                />
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-[#3478F6] focus:border-[#3478F6] ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3478F6] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#2866d3] transition disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 py-4">
          © {new Date().getFullYear()} Suvash Edu. All rights reserved.
        </div>
      </div>
    </div>
  );
}