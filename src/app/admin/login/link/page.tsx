import { redirect } from "next/navigation";
import { LoginPageShell } from "../components/LoginPageShell";
import VerifyButton from "./VerifyButton";

export default async function Page(props: { searchParams: Promise<{ token?: string; type?: string }> }) {
  const { token, type } = await props.searchParams;
  if (!token) redirect("/admin/login");

  return (
    <LoginPageShell>
      <VerifyButton token={token} type={type === "recovery" ? "recovery" : "magiclink"} />
    </LoginPageShell>
  );
}
