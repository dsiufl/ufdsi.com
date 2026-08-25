import { redirect } from "next/navigation";
import VerifyButton from "./VerifyButton";

export default async function Page(props: {
  searchParams: Promise<{ token?: string; type?: string }>
}) {
    const { token, type } = await props.searchParams;

    if (!token) {
        redirect('/admin/login');
    }

    const linkType = type === 'recovery' ? 'recovery' : 'magiclink';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <h1 className="text-2xl font-semibold">
                {linkType === 'recovery' ? 'Reset your password' : 'Sign in to DSI Admin'}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
                Click the button below to continue. This link can only be used once.
            </p>
            <VerifyButton token={token} type={linkType} />
        </div>
    );
}
