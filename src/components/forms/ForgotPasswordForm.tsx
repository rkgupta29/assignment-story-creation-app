"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { resetPassword } from "@/lib/firebase/auth";
import { formatFirebaseAuthError } from "@/lib/utils/firebase-errors";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await resetPassword(data.email);

      if (resetError) {
        setError(formatFirebaseAuthError(resetError));
        return;
      }

      setSuccess(true);
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
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Password reset link has been sent to your email. Please check your
              inbox and follow the instructions to reset your password.
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  form.reset();
                }}
                className="w-full"
              >
                Try again
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
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
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

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
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
