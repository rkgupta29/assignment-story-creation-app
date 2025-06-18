"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
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

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { confirmPasswordReset } from "@/lib/firebase/auth";
import { formatFirebaseAuthError } from "@/lib/utils/firebase-errors";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode) {
      setIsValidToken(false);
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
    }
  }, [oobCode]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await confirmPasswordReset(
        oobCode,
        data.password
      );

      if (resetError) {
        setError(formatFirebaseAuthError(resetError));
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/home");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-transparent shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center font-esbuild">
              Password reset successful!
            </CardTitle>
            <CardDescription className="text-center">
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Your password has been updated successfully. You will be
              redirected to the home page in a few seconds.
            </div>

            <div className="text-center">
              <Link
                href="/home"
                className="text-sm text-primary hover:underline"
              >
                Go to home page now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-transparent shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center font-esbuild">
              Invalid reset link
            </CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Please request a new password reset link.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/forgot-password")}
                className="w-full"
              >
                Request new reset link
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-transparent shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center font-esbuild">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter your new password"
                        {...field}
                        error={!!form.formState.errors.password}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-gray-500">
                      Must be at least 8 characters with uppercase, lowercase,
                      and number
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your new password"
                        {...field}
                        error={!!form.formState.errors.confirmPassword}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
