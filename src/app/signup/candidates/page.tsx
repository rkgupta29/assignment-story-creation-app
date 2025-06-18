import { CandidateSignupForm } from "@/components/forms/CandidateSignupForm";

import { ShouldNotBeAuthenticated } from "@/lib/guards/ShouldNotBeAuthenticated";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";

export default function CandidateSignupPage() {
  return (
    <ShouldNotBeAuthenticated>
      <AuthLayoutWrapper>
        <CandidateSignupForm />
      </AuthLayoutWrapper>
    </ShouldNotBeAuthenticated>
  );
}
