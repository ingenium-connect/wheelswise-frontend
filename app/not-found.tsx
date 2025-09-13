import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Return to Home
          </Link>
          <Link
            href="/about-us"
            className="text-sm font-semibold text-gray-900"
          >
            About Us<span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 pt-6">
        <div className="relative w-16 h-16 opacity-60">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="h-14 md:h-20 w-auto"
          />
        </div>
      </div>
    </main>
  );
};
