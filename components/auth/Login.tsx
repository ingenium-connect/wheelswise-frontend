"use client";

import { useRouter } from "next/navigation";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { PasswordInput } from "../forms/password-input";
import { useState } from "react";
import { loginSubmitHandler } from "@/utilities/api";
import { AlertCircle, Loader2 } from "lucide-react";
import { setCookie } from "nookies";

import { LoginPayload } from "@/types/data";
import { ACCESS_TOKEN, EMAIL, NAME, REFRESH_TOKEN, USER_ID } from "@/utilities/constants";
import { loginFormSchema } from "@/utilities/validation-schemas";
import { useOtp } from "@/hooks/useOtp";

const formSchema = loginFormSchema;

const Login: React.FC = () => {
  const router = useRouter();

  const { sendOtp } = useOtp();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      national_identifier: "",
      password: "",
    },
  });

  function extractApiError(response: Record<string, unknown>): string {
    const raw =
      (response?.error as string) ||
      (response?.message as string) ||
      (response?.detail as string) ||
      ((response?.non_field_errors as string[])?.[0]);

    if (!raw) return "Something went wrong. Please try again.";

    const lower = raw.toLowerCase();
    if (lower.includes("invalid") || lower.includes("credentials") || lower.includes("incorrect") || lower.includes("wrong password"))
      return "Incorrect ID or password. Please try again.";
    if (lower.includes("not found") || lower.includes("no account"))
      return "No account found with that ID. Please check and try again.";
    if (lower.includes("inactive") || lower.includes("disabled"))
      return "Your account has been deactivated. Please contact support.";
    if (lower.includes("locked") || lower.includes("too many"))
      return "Too many failed attempts. Please wait a moment before trying again.";

    return raw;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setLoginError("");
    try {
      const payload: LoginPayload = {
        national_identifier: values.national_identifier,
        password: values.password,
        user_type: "CUSTOMER",
      };
      const response = await loginSubmitHandler({ ...payload });
      if (response?.id) {
        // absent field (Go omitempty) === false
        const otpVerified = response?.otp_verified === true;
        const isActive = response?.is_active === true;

        if (!otpVerified) {
          sessionStorage.setItem("__login_national_id__", values.national_identifier);
          await sendOtp(values.national_identifier);
          router.push("/otp-verify?from=login");
          return;
        }

        if (!isActive) {
          setLoginError("Your account has been deactivated. Please contact support.");
          form.reset();
          return;
        }

        const userData = {
          [ACCESS_TOKEN]: response?.auth_credentials?.idToken,
          [REFRESH_TOKEN]: response?.auth_credentials?.refreshToken,
          [USER_ID]: response?.id,
          [EMAIL]: response?.email,
          [NAME]: response?.name,
        };

        Object.entries(userData).forEach(([key, value]) =>
          setCookie(null, key, value ?? "", {
            maxAge: key === REFRESH_TOKEN ? 30 * 24 * 60 * 60 : 60 * 60,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          }),
        );

        toast.success("Successfully logged in!");
        router.push("/dashboard");
      } else {
        const errorMsg = (response?.error as string) ?? "";
        if (errorMsg.toLowerCase().includes("not verified")) {
          sessionStorage.setItem("__login_national_id__", values.national_identifier);
          await sendOtp(values.national_identifier);
          router.push("/otp-verify?from=login");
          return;
        }
        setLoginError(extractApiError(response));
      }
      form.reset();
    } catch {
      setLoginError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#f0f6f9] flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-[#1e3a5f]">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Login to continue managing your motor insurance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {loginError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="national_identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National Identifier</FormLabel>
                      <FormControl>
                        <Input
                          id="national_identifier"
                          placeholder="ID / Passport number"
                          type="text"
                          required
                          autoComplete="national_identifier"
                          {...field}
                          onChange={(e) => { field.onChange(e); setLoginError(""); }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          required
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white mt-2"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
