"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCESS_TOKEN } from "@/utilities/constants";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  HeadphonesIcon,
  UserCircle2,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

export default function HeaderAuth() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      try {
        const cookies = document.cookie.split("; ").map((c) => c.trim());
        const found = cookies.find((c) => c.startsWith(`${ACCESS_TOKEN}=`));
        setHasToken(Boolean(found && found.split("=")[1]));
      } catch {
        setHasToken(false);
      }
    };

    check();

    // Re-check when the page becomes visible (e.g. after login redirect)
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Avoid flicker — render nothing until we know
  if (hasToken === null) return null;

  if (hasToken) {
    return (
      <>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard?tab=profile"
                className="flex items-center gap-2 w-full cursor-pointer font-medium text-[#1e3a5f]"
              >
                <UserCircle2 className="w-4 h-4 text-primary" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/support"
                className="flex items-center gap-2 w-full cursor-pointer text-sm"
              >
                <HeadphonesIcon className="w-4 h-4 text-primary" />
                Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
    >
      Log in
    </Link>
  );
}
