"use client";

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { StaffSidebar } from "./StaffSidebar";

export function StaffSidebarWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {/* Sidebar */}
      <StaffSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-[0.40] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        className="fixed bottom-4 right-4 z-50 lg:hidden text-gray-800"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars size={24} />
      </button>
    </>
  );
}
