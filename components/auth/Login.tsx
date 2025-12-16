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

import { loginFormSchema } from "@/lib/validation-schemas";
import { PasswordInput } from "../forms/password-input";
import { useState } from "react";
import { loginSubmitHandler } from "@/utilities/api";
import { Loader2 } from "lucide-react";
import { setCookie } from "nookies";

import { LoginPayload } from "@/types/data";
import { ACCESS_TOKEN, EMAIL, NAME, USER_ID } from "@/utilities/constants";

const formSchema = loginFormSchema;

const Login: React.FC = () => {
  const [userDetails, setUserDetails] = useState<LoginPayload>({
    national_identifier: "",
    password: "",
    user_type: "CUSTOMER",
  });
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      national_identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setUserDetails(() => ({
      ...userDetails,
      national_identifier: values.national_identifier,
      password: values.password,
    }));
    try {
      const payload = {
        ...values,
        user_type: userDetails.user_type,
      };
      const response = await loginSubmitHandler({ ...payload });
      if (response?.id) {
        // Also store in cookies for backward compatibility
        const userData = {
          [ACCESS_TOKEN]: response?.auth_credentials?.idToken,
          [USER_ID]: response?.id,
          [EMAIL]: response?.email,
          [NAME]: response?.name,
        };

        // Set cookies with options to allow sending to backend (cross-site, secure, SameSite=None)
        Object.entries(userData).forEach(([key, value]) =>
          setCookie(null, key, value, {
            maxAge: 60 * 60, // 1 hour
            path: "/",
            secure: process.env.NODE_ENV === "production", // Not using HTTPS locally
            sameSite: "lax", // 'lax' is more permissive for local dev
          })
        );

        toast.success("Successfully logged in!");
        router.push("/");
      } else {
        toast.error("Submission Error", {
          description: "Error in submitting request! Please try again.",
        });
      }
      form.reset();
    } catch (error) {
      toast.error("Submission Error", {
        description: (error as Error)?.message || "An error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto mt-4 sm:mt-10 max-w-md w-full bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Login to continue managing your motor insurance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="national_identifier"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="national_identifier">
                        National identifier
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="national_identifier"
                          placeholder="******"
                          type="text"
                          required
                          autoComplete="national_identifier"
                          {...field}
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
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          required
                          placeholder="******"
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
                  className="w-full cursor-pointer"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
