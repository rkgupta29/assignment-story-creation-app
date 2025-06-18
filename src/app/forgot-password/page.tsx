import { ShouldNotBeAuthenticated } from "@/lib/guards/ShouldNotBeAuthenticated";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";

export default function ResetPasswordPage() {
  return (
    <ShouldNotBeAuthenticated>
      <AuthLayoutWrapper>
        <ForgotPasswordForm />
      </AuthLayoutWrapper>
    </ShouldNotBeAuthenticated>
  );
}
