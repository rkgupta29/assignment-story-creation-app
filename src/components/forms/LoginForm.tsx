"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { signInWithEmail } from "@/lib/firebase/auth";
import { formatFirebaseAuthError } from "@/lib/utils/firebase-errors";
import { PasswordInput } from "../ui/password-input";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error: authError } = await signInWithEmail(
        data.email,
        data.password
      );

      if (authError) {
        setError(formatFirebaseAuthError(authError));
        return;
      }

      if (user) {
        // Redirect to the intended destination or home
        router.push(redirectTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-transparent shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center font-esbuild">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        error={!!form.formState.errors.email}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your password"
                        {...field}
                        error={!!form.formState.errors.password}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-end">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 bg-white border border-background/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Don&apos;t have an account?{" "}
            </p>
            <div className="mt-2 text-center flex items-center justify-center gap-2">
              <Link
                href="/signup/candidates"
                className="text-primary hover:underline font-medium text-sm"
              >
                Sign up as candidate
              </Link>
              <span className="text-lg text-gray-600">or</span>
              <p className="text-sm text-gray-600">
                <Link
                  href="/signup/organization"
                  className="text-primary hover:underline font-medium text-sm"
                >
                  Sign up as organization
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
