import Footer from "@/components/Footer";
import LandingMain from "@/components/LandingMain";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#d7e8ee] via-white to-white">
        {/* Header */}
        <header className="px-4 md:px-16 py-6 flex justify-start items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="h-14 md:h-20 w-auto"
          />
        </header>
        <LandingMain />;
        <Footer />
      </div>
    </>
  );
}
