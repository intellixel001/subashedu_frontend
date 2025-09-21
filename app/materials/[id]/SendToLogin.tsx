"use client";

import { useEffect } from "react";

export default function SendToLogin() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);

  return null;
}
