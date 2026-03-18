"use client";

import { destroyCookie } from "nookies";
import { ACCESS_TOKEN, EMAIL, NAME, REFRESH_TOKEN, USER_ID } from "@/utilities/constants";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear all client-readable cookies
    [ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, NAME, EMAIL].forEach((key) =>
      destroyCookie(null, key, { path: "/" }),
    );

    // Wipe all persisted state — stores, session data, everything
    try { localStorage.clear(); } catch (_) {}
    try { sessionStorage.clear(); } catch (_) {}

    // Navigate to logout route — clears httpOnly cookies and redirects to /login
    window.location.href = "/api/logout";
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-left text-sm text-red-600 cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
