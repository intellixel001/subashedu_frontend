"use client"

import DeveloperMessage from "@/components/DeveloperMessage";
import { StaffSidebarWrapper } from "../components/StaffSidebarWrapper";
import { StaffProvider } from "./context/StaffContext";


export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffProvider>
    <div className="min-h-screen w-full flex relative">
      {/* Sidebar */}
      <StaffSidebarWrapper />

      {/* Main content */}
      <main className="flex-1 px-2 py-4 md:px-4 md:py-6 lg:p-6 bg-gray-100 min-h-screen overflow-y-auto lg:ml-64">
        {children}
        <DeveloperMessage/>
      </main>
    </div>
    </StaffProvider>
  );
}
