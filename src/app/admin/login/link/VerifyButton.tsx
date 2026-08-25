'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Email security scanners (e.g. Microsoft Safe Links) prefetch emailed URLs,
// which used to consume the single-use token before the user ever clicked.
// Verification now only happens on an explicit button press.
export default function VerifyButton({ token, type }: { token: string; type: 'magiclink' | 'recovery' }) {
    const [loading, setLoading] = useState(false);

    const verify = () => {
        setLoading(true);
        const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`;
        const redirectTo = type === 'recovery'
            ? `${window.location.origin}/admin/login/reset-password`
            : `${window.location.origin}/admin/login/`;
        window.location.href = `${base}?token=${encodeURIComponent(token)}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;
    };

    return (
        <Button onClick={verify} disabled={loading} className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {type === 'recovery' ? 'Reset my password' : 'Continue to my account'}
        </Button>
    );
}
