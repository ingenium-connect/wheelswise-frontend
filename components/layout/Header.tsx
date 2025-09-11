import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <>
      <header className="px-4 md:px-16 py-6 flex justify-start items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="h-14 md:h-20 w-auto"
        />
      </header>
    </>
  );
};

export default Header;
