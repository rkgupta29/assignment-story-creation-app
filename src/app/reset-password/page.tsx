import { ShouldNotBeAuthenticated } from "@/lib/guards/ShouldNotBeAuthenticated";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";
import UpcomingFeature from "@/components/UpcomingFeature";

export default function ResetPasswordPage() {
  return (
    <ShouldNotBeAuthenticated>
      <AuthLayoutWrapper>
        <UpcomingFeature />
      </AuthLayoutWrapper>
    </ShouldNotBeAuthenticated>
  );
}
