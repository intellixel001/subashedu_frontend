"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaLock, FaUser } from "react-icons/fa";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Credentials = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Credentials>({
    resolver: zodResolver(adminLoginSchema),
  });

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = "/admin";
    }
  }, [shouldRedirect]);

  const onSubmit = async (data: Credentials) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] animate-gradientBG">
      <div className="w-full max-w-md bg-[var(--card)] rounded-[var(--radius)] shadow-md border border-[var(--border)] overflow-hidden animate-fade-in">
        <div className="bg-[var(--myred)] py-5 px-6">
          <h2 className="text-xl font-semibold text-[var(--primary-foreground)] text-center text-shine">
            Suvash Edu Admin Portal
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {serverError && (
            <div className="text-sm text-[var(--destructive)] bg-[var(--destructive)/10] border border-[var(--destructive)] p-3 rounded-[var(--radius-sm)]">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-1 text-[var(--foreground)]"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-sm)] focus:ring-[var(--ring)] focus:border-[var(--myred)] text-[var(--foreground)] bg-[var(--card)] ${
                    errors.email
                      ? "border-[var(--destructive)]"
                      : "border-[var(--border)]"
                  }`}
                  placeholder="admin@example.com"
                  {...register("email")}
                />
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              </div>
              {errors.email && (
                <p className="text-sm text-[var(--destructive)] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-1 text-[var(--foreground)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className={`w-full pl-10 pr-3 py-2 border rounded-[var(--radius-sm)] focus:ring-[var(--ring)] focus:border-[var(--myred)] text-[var(--foreground)] bg-[var(--card)] ${
                    errors.password
                      ? "border-[var(--destructive)]"
                      : "border-[var(--border)]"
                  }`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              </div>
              {errors.password && (
                <p className="text-sm text-[var(--destructive)] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--myred)] text-[var(--primary-foreground)] py-2 px-4 rounded-[var(--radius-sm)] text-sm font-medium hover:bg-[var(--myred-secondary)] transition disabled:opacity-70 animate-pulse"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)] py-4">
          © {new Date().getFullYear()} Suvash Edu. All rights reserved.
        </div>
      </div>
    </div>
  );
}
