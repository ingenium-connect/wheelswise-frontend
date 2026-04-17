"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Clear all persisted state — stores, session data, everything
    try {
      localStorage.clear();
    } catch (_) {}
    try {
      sessionStorage.clear();
    } catch (_) {}

    // Signal logout to other tabs
    try {
      localStorage.setItem("auth_event", "logout");
      setTimeout(() => localStorage.removeItem("auth_event"), 100);
    } catch (_) {}

    // Call logout from auth context (clears httpOnly cookies via API)
    await logout();
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
