import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Lock, Clock } from 'lucide-react';

const content = {
    closed: {
        icon: Lock,
        title: 'Registration Closed',
        description: 'This form is no longer accepting new submissions.',
        details: [
            'Registration has been closed by the event organizers',
            'All available spots have been filled',
            'The registration deadline has passed',
        ],
    },
    expired: {
        icon: Clock,
        title: 'Registration Deadline Passed',
        description: 'The deadline for this form has expired.',
        details: [
            'Late registrations are not being accepted at this time',
            'Check back for future events and opportunities',
        ],
    },
    capacity: {
        icon: Lock,
        title: 'Event at Full Capacity',
        description: 'All spots for this event have been filled.',
        details: [
            'This event has reached maximum capacity',
            'The waitlist is currently full',
            'Follow us for announcements about future events',
        ],
    },
};

export default async function FormClosedPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ reason?: string }>;
}) {
    const { slug } = await params;
    const { reason } = await searchParams;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: form, error } = await supabase
        .from('forms')
        .select('title, description, deadline')
        .eq('slug', slug)
        .single();

    if (error || !form) notFound();

    const displayContent = content[(reason as keyof typeof content) ?? 'closed'] ?? content.closed;
    const Icon = displayContent.icon;

    const details = [...displayContent.details];
    if (reason === 'expired' && form.deadline) {
        details.unshift(
            `Registration closed on ${new Date(form.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex justify-center">
                    <Image src="/images/logo/dsi-logo-small.svg" alt="UF DSI" width={80} height={80} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                <Icon className="h-10 w-10 text-gray-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900">{displayContent.title}</h1>
                        <p className="mt-3 text-lg text-gray-500">{displayContent.description}</p>
                    </div>

                    <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                        <h3 className="font-semibold text-gray-900">{form.title}</h3>
                        {form.description && (
                            <p className="text-sm text-gray-500">{form.description}</p>
                        )}
                    </div>

                    <div className="mt-6 space-y-3 rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900">Information</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            {details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8 rounded-lg border border-[#FF5722]/20 bg-[#FF5722]/5 p-6 text-center">
                        <p className="text-sm text-gray-700">
                            Have questions or need assistance?
                            <br />
                            <a href="mailto:dsi@ufl.edu" className="mt-1 inline-block font-medium text-[#FF5722] hover:underline">
                                Contact us at dsi@ufl.edu
                            </a>
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-400">
                    UF Data Science &amp; Informatics
                </p>
            </div>
        </div>
    );
}
