import Signup from "@/components/auth/SignUp";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <div>
        <nav className="fixed top-0 left-0 right-0 bg-[#397397] text-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 md:px-16 h-16">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            Create an account with us
          </h1>
          <div className="w-24" />
        </div>
      </nav>

        {/* Form Content */}
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="WheelsWise Logo"
                width={112}
                height={112}
                className="h-24 md:h-28 w-auto object-contain"
              />
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-priamry mb-2">
              Create Account With Us
            </h2>
            <Signup />
            {/* Login Link */}
            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                className="text-primary font-medium cursor-pointer hover:underline"
                href="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
