"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  organizationSignupSchema,
  type OrganisationSignupFormData,
} from "@/lib/validations/auth";
import { signUpWithEmail } from "@/lib/firebase/auth";
import { addDocumentWithId } from "@/lib/firebase/firestore";
import { formatFirebaseAuthError } from "@/lib/utils/firebase-errors";
import { useAuthStoreWithInit } from "@/stores/auth-store";
import type { Organization } from "@/types/auth";

export function OrganizationSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { fetchUserProfile } = useAuthStoreWithInit();

  const form = useForm<OrganisationSignupFormData>({
    resolver: zodResolver(organizationSignupSchema),
    defaultValues: {
      companyName: "",
      websiteUrl: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: OrganisationSignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error: authError } = await signUpWithEmail(
        data.email,
        data.password
      );

      if (authError) {
        setError(formatFirebaseAuthError(authError));
        return;
      }

      if (user) {
        const organizationData: Omit<Organization, "uid"> = {
          email: data.email,
          userType: "organization",
          companyName: data.companyName,
          websiteUrl: data.websiteUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await addDocumentWithId("organizations", user.uid, organizationData);

        await fetchUserProfile(user.uid);

        router.push("/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="w-full max-w-md border-transparent shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-semibold text-center font-pp tracking-wide">
            Create your profile now
          </CardTitle>
          <CardDescription className="text-center text-sm text-background/80">
            Start connecting with your matches
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company name"
                        {...field}
                        error={!!form.formState.errors.companyName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your company website"
                        {...field}
                        error={!!form.formState.errors.websiteUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Create a password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm your password"
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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Looking for a job?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up as candidate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
