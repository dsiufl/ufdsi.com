import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { CheckCircle, ListOrdered, Calendar, Mail } from 'lucide-react';

export default async function SuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ status?: string; pos?: string }>;
}) {
    const { slug } = await params;
    const { status, pos } = await searchParams;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: form } = await supabase
        .from('forms')
        .select('title, event_date')
        .eq('slug', slug)
        .single();

    const isWaitlist = status === 'waitlist';
    const position = pos ? parseInt(pos) : null;

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex justify-center">
                    <Image src="/images/logo/dsi-logo-small.svg" alt="UF DSI" width={80} height={80} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
                    {/* Icon and Title */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${isWaitlist ? 'bg-blue-100' : 'bg-green-100'}`}>
                                {isWaitlist ? (
                                    <ListOrdered className="h-10 w-10 text-blue-600" />
                                ) : (
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                )}
                            </div>
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {isWaitlist ? "You're on the Waitlist" : 'Registration Confirmed'}
                        </h1>
                        <p className="mt-3 text-lg text-gray-500">
                            {isWaitlist
                                ? `You are currently #${position ?? '—'} on the waitlist. We'll notify you if a spot opens up.`
                                : 'Your registration has been successfully submitted'}
                        </p>
                    </div>

                    {/* Event Details */}
                    {form && (
                        <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                            <h3 className="font-semibold text-gray-900">Event Details</h3>
                            <div className="space-y-3">
                                {form.event_date && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">When</p>
                                            <p className="text-sm text-gray-500">{formatDate(form.event_date)}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Confirmation</p>
                                        <p className="text-sm text-gray-500">
                                            A confirmation email has been sent to your email address
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* What's Next */}
                    <div className="mt-6 space-y-3 rounded-lg border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900">What&apos;s Next?</h3>
                        {isWaitlist ? (
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>We&apos;ll send you an email if a spot becomes available</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>Your waitlist position may change as others register or cancel</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>Check your email regularly for updates from dsi@ufl.edu</span>
                                </li>
                            </ul>
                        ) : (
                            <ul className="space-y-2 text-sm text-gray-500">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>Check your email for a confirmation with additional details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>Add the event to your calendar</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span>If you need to cancel, please email dsi@ufl.edu</span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Questions? Contact us at{' '}
                    <a href="mailto:dsi@ufl.edu" className="text-[#FF5722] hover:underline">dsi@ufl.edu</a>
                </p>
            </div>
        </div>
    );
}
