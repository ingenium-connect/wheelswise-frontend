import OtpVerify from "@/components/Otpverify";

export default function Page() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2e5e74]">Step Six</h2>
        <p className="text-muted-foreground mt-2">Enter OTP Verification</p>
      </div>
      <OtpVerify />
    </section>
  );
}
