"use client";

import { destroyCookie } from "nookies";
import { ACCESS_TOKEN, EMAIL, NAME, USER_ID } from "@/utilities/constants";
import { LogOut } from "lucide-react";

export default function LogoutButton() {

  const handleLogout = () => {
    // Clear client-side cookies
    [ACCESS_TOKEN, USER_ID, NAME, EMAIL].forEach((key) =>
      destroyCookie(null, key, { path: "/" }),
    );

    // Clear all persisted Zustand store data from localStorage
    [
      "motor-insurance-details",
      "vehicle-info-store",
      "personal-details-store",
      "user-profile-store",
    ].forEach((key) => localStorage.removeItem(key));

    // Navigate to logout route — it clears the httpOnly cookie and redirects to /login
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
