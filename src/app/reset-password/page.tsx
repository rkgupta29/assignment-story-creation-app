import { ShouldNotBeAuthenticated } from "@/lib/guards/ShouldNotBeAuthenticated";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";

export default function ResetPasswordPage() {
  return (
    <ShouldNotBeAuthenticated>
      <AuthLayoutWrapper>
        <ResetPasswordForm />
      </AuthLayoutWrapper>
    </ShouldNotBeAuthenticated>
  );
}
