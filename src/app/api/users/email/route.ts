import { NextRequest } from "next/server";
import { Email } from "@/types/db";
import sendEmail from "./lib";

export async function POST(req: NextRequest) {
    const { access_token, user, type } = await req.json();
    if (!access_token) return new Response("Unauthorized", { status: 401 });
    if (!user) return new Response("No user provided", { status: 400 });
    const kind = type === "reset" ? Email.RESET_PASSWORD : Email.INVITE_EMAIL;
    return sendEmail(user, access_token, kind, req.nextUrl.origin);
}
