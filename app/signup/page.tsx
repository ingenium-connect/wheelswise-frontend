import Signup from "@/components/auth/SignUp";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const primary = "#397397";

  return (
    <>
      <div>
        <div className="w-full sticky top-0 z-50 text-white text-lg font-semibold text-center py-4 shadow-md bg-[#397397]">
          Step x: Create an account with us
        </div>

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
