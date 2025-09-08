"use client";
import DeveloperMessage from "@/components/DeveloperMessage";
import { AdminDashboardProvider } from "@/context/adminDashboardContext";
import { AdminSidebarWrapper } from "../components/AdminSidebarWrapper";
import { AdminProvider } from "./context/AdminContext";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen w-full flex relative">
        {/* Sidebar */}
        <AdminSidebarWrapper />

        {/* Main content */}
        <AdminDashboardProvider>
          <main className="flex-1 px-2 py-4 md:px-4 md:py-6 lg:p-6 bg-gray-100 min-h-screen overflow-y-auto lg:ml-64">
            {children}
            <DeveloperMessage />
          </main>
        </AdminDashboardProvider>
      </div>
    </AdminProvider>
  );
}
