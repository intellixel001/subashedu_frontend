"use client";

import { useEffect } from "react";

export function DisableDevTools() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: Event) => e.preventDefault();

    // Disable common DevTools shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === "F12") e.preventDefault();

      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key?.toUpperCase() || "")
      ) {
        e.preventDefault();
      }

      // Block Ctrl+U (view source)
      if (e.ctrlKey && e.key?.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    // Block context menu & copy/cut
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("copy", (e) => e.preventDefault());
    document.addEventListener("cut", (e) => e.preventDefault());

    // Optional: Detect DevTools opening (basic detection)
    const devToolsDetector = () => {
      const threshold = 160; // Approximate size difference when DevTools open
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        document.body.style.filter = "blur(5px)";
        alert("Developer tools are disabled on this site.");
      }
    };

    const interval = setInterval(devToolsDetector, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(interval);
    };
  }, []);

  return null;
}
