import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
      <header className="px-4 md:px-16 py-2 flex justify-start items-center bg-gradient-to-r from-[#d7e8ee] via-white to-[#e5f0f3]">
        <Link href="/">
        
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="h-14 md:h-20 w-auto"
          />
          </Link>
      </header>
    </>
  );
};

export default Header;
