import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Phone } from "lucide-react";
import HeaderAuth from "./HeaderAuth";

const HELPLINE_DISPLAY = "0717 227 690 / 0735 620 339";
const HELPLINE_TEL = "+254717227690";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Support", href: "/support" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e3a5f]/10 bg-[#1e3a5f] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt="Wheelswise"
            priority
            width={80}
            height={80}
            className="h-40 md:h-40 w-auto"
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
          <a
            href={`tel:${HELPLINE_TEL}`}
            aria-label={`Call helpline ${HELPLINE_DISPLAY}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">
              Helpline: {HELPLINE_DISPLAY}
            </span>
          </a>
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
