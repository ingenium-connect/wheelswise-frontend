'use client';

import React from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#397397] text-white py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">

        {/* Column 1 */}
        <div>
          <h3 className="font-semibold text-base mb-2">Company</h3>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/faqs" className="hover:underline">FAQs</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-base mb-2">Contact</h3>
          <p>Call us: <a href="tel:+254717227690" className="hover:underline">+254 717 227 690</a></p>
          <p>Email: <a href="mailto:inquiries@ingeniumct.com" className="hover:underline">inquiries@ingeniumct.com</a></p>
          <p>Ushirika Road, Karen<br />Nairobi, Kenya</p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-base mb-2">Follow Us</h3>
          <div className="flex gap-4 mt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FaXTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs mt-6 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} Wheelswise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 