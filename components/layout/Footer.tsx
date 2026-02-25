"use client";

import React from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import Link from "next/link";
import { Phone, Mail, MapPin, Shield } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-auto">
      {/* Main content */}
      <div className="px-6 md:px-16 pt-12 pb-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Shield className="w-4 h-4 text-[#8bbfd8]" />
              </div>
              <span className="font-bold text-lg tracking-tight">MedGen</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Kenya&apos;s digital motor insurance platform. Fast, transparent,
              and fully regulated by the IRA.
            </p>
            <div className="flex gap-3">
              {[
                {
                  href: "https://facebook.com",
                  icon: <FaFacebookF size={15} />,
                },
                { href: "https://twitter.com", icon: <FaXTwitter size={15} /> },
                {
                  href: "https://instagram.com",
                  icon: <FaInstagram size={15} />,
                },
                {
                  href: "https://linkedin.com",
                  icon: <FaLinkedinIn size={15} />,
                },
              ].map(({ href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-[#397397] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/50 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "FAQs", href: "/faqs" },
                { label: "Support", href: "/support" },
                { label: "Privacy Policy", href: "/terms" },
                { label: "Disclaimer", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/50 mb-4">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Comprehensive Cover", href: "/cover-type" },
                { label: "Third Party Only (TPO)", href: "/cover-type" },
                { label: "Private Motor", href: "/cover-type" },
                { label: "Commercial Motor", href: "/cover-type" },
                { label: "PSV Insurance", href: "/cover-type" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white/50 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:+254717227690"
                  className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 mt-0.5 text-[#8bbfd8]" />
                  +254 717 227 690
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@medgeninsurance.com"
                  className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#8bbfd8]" />
                  support@medgeninsurance.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#8bbfd8]" />
                <span>
                  Ushirika Road, Karen
                  <br />
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-16 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>
            &copy; {new Date().getFullYear()} MedGen Insurance Agency. All
            rights reserved.
          </span>
          <span>
            Powered by{" "}
            <a
              href="https://ingeniumct.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              Ingenium
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
