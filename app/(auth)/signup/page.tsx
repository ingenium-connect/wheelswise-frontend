import Signup from "@/components/auth/SignUp";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: false },
    {
      name: "Motor Type",
      href: `/motor-type/${product_type}`,
      isActive: false,
    },
    ...(product_type === "COMPREHENSIVE"
      ? [
          {
            name: "Vehicle Value",
            href: `/motor-subtype?product_type=${product_type}&motor_type=${motor_type}`,
            isActive: false,
          },
        ]
      : []),
    {
      name: "Vehicle Details",
      href: `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: false,
    },
    {
      name: "Personal Details",
      href: `/personal-details?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: false,
    },
    {
      name: "Sign Up",
      href: `/sign-up?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: true,
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
      <PageBreadCrumb pages={pages} />
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2e5e74]">Step Five</h2>
        <p className="text-muted-foreground mt-2">Enter Personal Details</p>
      </div>
      {/* Form Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Signup product_type={product_type} motor_type={motor_type} />
        </div>
      </div>
    </section>
  );
}
