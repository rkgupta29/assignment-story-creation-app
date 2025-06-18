import { OrganizationSignupForm } from "@/components/forms/OrganizationSignupForm";
import { ShouldNotBeAuthenticated } from "@/lib/guards/ShouldNotBeAuthenticated";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";

export default function OrganizationSignupPage() {
  return (
    <ShouldNotBeAuthenticated>
      <AuthLayoutWrapper>
        <OrganizationSignupForm />
      </AuthLayoutWrapper>
    </ShouldNotBeAuthenticated>
  );
}
