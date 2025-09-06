"use client";

import { useEffect } from "react";

export function DisableDevTools() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Disable common DevTools shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    // Block context menu
    document.addEventListener("contextmenu", handleContextMenu);
    // Block keyboard shortcuts
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("copy", (e) => e.preventDefault());
    document.addEventListener("cut", (e) => e.preventDefault());

    // Optional: Detect DevTools opening (less reliable, but can deter casual users)
    const devToolsDetector = () => {
      const threshold = 160; // Approximate width/height difference when DevTools is open
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        // You can redirect, show an alert, or take other actions
        // For example, blur the screen
        document.body.style.filter = "blur(5px)";
        alert("Developer tools are disabled on this site.");
      }
    };

    // Check periodically for DevTools
    const interval = setInterval(devToolsDetector, 1000);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(interval);
    };
  }, []);

  return null; // This component doesn't render anything
}
