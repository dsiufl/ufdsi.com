import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
export default function POST(req: NextRequest) {
    const { token } = req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!

    )
}