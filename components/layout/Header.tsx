import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { parseCookies } from "nookies";
const Header = () => {
  const token = parseCookies()[ACCESS_TOKEN];
  console.log("TOKEN HEADER:", token);
  return (
    <>
      <header className="px-4 md:px-16 py-2 flex items-center justify-between bg-gradient-to-r from-[#d7e8ee] via-white to-[#e5f0f3]">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            priority
            width={80}
            height={80}
            className="h-14 md:h-20 w-auto"
          />
        </Link>
        {token && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Profile</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
    </>
  );
};

export default Header;
