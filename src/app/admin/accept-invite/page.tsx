import { notFound } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { LoginPageShell } from "../login/components/LoginPageShell";

const DSI_BLUE = "#0021A5";

// Clerk's invitation redirect appends `__clerk_ticket` as a real query param
// on first landing. Anyone visiting this URL without one isn't coming from a
// real invite email -- 404 rather than show a usable self-serve sign-up form
// (this app is invite-only, there's no public sign-up).
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  if (!params.__clerk_ticket) {
    notFound();
  }

  return (
    <LoginPageShell>
      <SignUp
        routing="hash"
        fallbackRedirectUrl="/admin/dashboard"
        signInUrl="/admin/login"
        appearance={{
          variables: { colorPrimary: DSI_BLUE },
          options: { logoImageUrl: "/images/logo/hd-transparent-dsi-logo.png" },
        }}
      />
    </LoginPageShell>
  );
}
