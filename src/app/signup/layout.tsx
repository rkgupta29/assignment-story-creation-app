export const metadata = {
  title: "Sign Up",
  description: "Create a new account to get started",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen grid">{children}</div>;
}
