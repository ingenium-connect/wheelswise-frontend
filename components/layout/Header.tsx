import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { cookies } from "next/headers";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  HeadphonesIcon,
  UserCircle2,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Support", href: "/support" },
];

export default async function Header() {
  const cookiesData = await cookies();
  const token = cookiesData.get(ACCESS_TOKEN)?.value;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e3a5f]/10 bg-[#1e3a5f] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            priority
            width={80}
            height={80}
            className="h-20 md:h-36 w-auto brightness-0 invert"
          />
        </Link>

        {/* Centre nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {token ? (
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
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
