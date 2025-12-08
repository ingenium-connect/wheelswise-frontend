"use client";

import { Button } from "@/components/ui/button";
import { FlagIcon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <FlagIcon className="w-20 h-20 mx-auto" />
        <h1 className="mt-10 !text-3xl !leading-snug md:!text-4xl">
          Error 500 <br /> It looks like something went wrong.
        </h1>
        <h2 className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Don&apos;t worry, our team is already on it.Please try refreshing the
          page or come back later.
        </h2>
        <Button // Attempt to recover by trying to re-render the segment
          onClick={() => reset()}
          className="w-full px-4 md:w-[8rem]"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
