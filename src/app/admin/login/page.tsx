import { SignIn } from "@clerk/nextjs";
import { LoginPageShell } from "./components/LoginPageShell";

const DSI_BLUE = "#0021A5";

export default function Page() {
  return (
    <LoginPageShell>
      <div className="flex flex-col items-center gap-4">
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/admin/dashboard"
          appearance={{
            variables: { colorPrimary: DSI_BLUE },
            options: { logoImageUrl: "/images/logo/hd-transparent-dsi-logo.png" },
            // Invite-only -- there's no public sign-up, so hide the
            // "Don't have an account? Sign up" link Clerk shows by default.
            elements: { footerAction: { display: "none" } },
          }}
        />
        <a
          href="mailto:dsiufl@gmail.com?subject=Admin%20account%20access"
          className="text-sm font-medium hover:underline"
          style={{ color: DSI_BLUE }}
        >
          Need access?
        </a>
      </div>
    </LoginPageShell>
  );
}
