import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPageShell } from "../login/components/LoginPageShell";
import { AuthCard, Notice } from "../login/components/AuthCard";
import { SignOutButton, WelcomeForm } from "./WelcomeForm";
import { getAdminProfile } from "@/lib/supabase/admin";

export const metadata = { title: "Set up your account · DSI admin" };

export default async function Page() {
  const supabase = await createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const profile = await getAdminProfile<{ role: string | null; first_name: string | null; last_name: string | null; pictureURL: string | null; account_setup: boolean }>(user.id);
  if (profile?.account_setup) redirect("/admin/dashboard");

  return (
    <LoginPageShell>
      {profile ? (
        <WelcomeForm
          id={user.id}
          email={user.email ?? ""}
          role={profile.role}
          defaults={{ first_name: profile.first_name ?? "", last_name: profile.last_name ?? "", pictureURL: profile.pictureURL ?? "" }}
        />
      ) : (
        <AuthCard step="Account setup" title="No admin profile yet" description={<>You&apos;re signed in as <span className="font-medium text-foreground">{user.email}</span>, but this account hasn&apos;t been added to the admin.</>}>
          <div className="flex flex-col gap-6">
            <Notice>Ask the President or a Technology Coordinator to add you on the Users page, then use the invite email they send.</Notice>
            <SignOutButton />
          </div>
        </AuthCard>
      )}
    </LoginPageShell>
  );
}
