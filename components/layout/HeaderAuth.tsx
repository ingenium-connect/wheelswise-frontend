"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  HeadphonesIcon,
  UserCircle2,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HeaderAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Avoid flicker — render nothing until we know
  if (isLoading) return null;

  if (isAuthenticated) {
    return (
      <>
        <button
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

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
              <button
                onClick={() => {
                  router.push("/dashboard?tab=profile");
                  router.refresh();
                }}
                className="flex items-center gap-2 w-full cursor-pointer font-medium text-[#1e3a5f]"
              >
                <UserCircle2 className="w-4 h-4 text-primary" />
                My Account
              </button>
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
