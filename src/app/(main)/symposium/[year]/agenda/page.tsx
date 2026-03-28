import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { AgendaItem } from '@/types/db';

const BREAK_KEYWORDS = ['break', 'lunch', 'coffee', 'breakfast', 'check in', 'check-in'];

function isBreak(session: string) {
    const lower = session.toLowerCase();
    return BREAK_KEYWORDS.some(kw => lower.includes(kw));
}

function parseTimeRange(timeRange: string): { start: string; end: string | null } {
    const parts = timeRange.split(/\s*[-–]\s*/);
    if (parts.length >= 2) {
        return { start: parts[0].trim(), end: parts[1].trim() };
    }
    return { start: timeRange.trim(), end: null };
}

function TimeBadge({ start, end, accent }: { start: string; end: string | null; accent?: boolean }) {
    return (
        <div className={`print-time-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-3 md:hidden ${
            accent
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
            <span>{start}</span>
            {end && <>
                <span className="opacity-50">→</span>
                <span>{end}</span>
            </>}
        </div>
    );
}

function BreakItem({ item }: { item: AgendaItem }) {
    const { start, end } = parseTimeRange(item.time_range);
    return (
        <div className="flex flex-col md:flex-row items-stretch group opacity-75 hover:opacity-100 transition-opacity print:opacity-100 print:flex-row">
            {/* Time column */}
            <div className="print-time-col hidden md:flex w-52 shrink-0 flex-col items-end justify-center pr-10 text-right">
                <span className="text-sm font-medium text-gray-500 leading-none print:text-gray-700">{start}</span>
                {end && <span className="text-xs text-gray-400 mt-1.5 font-mono print:text-gray-500">{end}</span>}
            </div>

            {/* Connector — screen only */}
            <div className="print-connector hidden md:flex flex-col items-center w-6 shrink-0">
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-950 my-0 group-hover:bg-primary transition-colors shrink-0" />
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Card */}
            <div className="flex-1 md:pl-8 print:pl-4 py-1">
                <div className="agenda-break-card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-l-4 border-l-gray-300 group-hover:border-l-primary px-5 py-3 transition-colors print:border-gray-300 print:py-2">
                    <TimeBadge start={start} end={end} />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-600">{item.session}</p>
                    {item.description && (
                        <p className="text-xs text-gray-400 mt-1 print:text-gray-500">{item.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function SessionItem({ item }: { item: AgendaItem }) {
    const { start, end } = parseTimeRange(item.time_range);
    return (
        <div className="flex flex-col md:flex-row items-stretch group print:flex-row">
            {/* Time column */}
            <div className="print-time-col hidden md:flex w-52 shrink-0 flex-col items-end justify-center pr-10 text-right">
                <span className="text-base font-bold text-blue-700 dark:text-blue-400 leading-none print:text-gray-900">{start}</span>
                {end && <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono print:text-gray-500">{end}</span>}
            </div>

            {/* Connector — screen only */}
            <div className="print-connector hidden md:flex flex-col items-center w-6 shrink-0">
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-white dark:ring-gray-950 shrink-0" />
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Card */}
            <div className="flex-1 md:pl-8 print:pl-4 py-1">
                <div className="agenda-item-card bg-gray-50 dark:bg-gray-800/60 border-l-4 border-primary px-6 py-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-200 print:bg-white print:border-gray-800 print:py-2.5">
                    <TimeBadge start={start} end={end} accent />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-1 print:text-base print:text-black">{item.session}</h3>
                    {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed print:text-gray-600 print:text-xs">{item.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default async function Page({ params }: { params: { year: string } }) {
    const { year } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: symposium } = await supabase.from('symposiums').select('*').eq('year', year).single();

    const agenda: AgendaItem[] = symposium?.agenda ?? [];
    const date = symposium?.date
        ? new Date(symposium.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <div className="w-full min-h-screen py-20 px-4 sm:px-8 flex flex-col items-center print:py-8 print:px-6 print:block">

            {/* Print-only header */}
            <div className="agenda-print-header hidden print:flex flex-col mb-8 border-b border-gray-300 pb-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-1">DSI Spring Symposium</p>
                <h1 className="text-3xl font-black text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {year} Agenda
                </h1>
                {date && <p className="text-sm text-gray-600 mt-1">{date} · Reitz Auditorium, University of Florida</p>}
            </div>

            {/* Screen header */}
            <div className="w-full mb-14 text-center print:hidden">
                <p className="text-xs text-primary tracking-[0.2em] uppercase mb-3 font-mono font-semibold">
                    Schedule
                </p>
                <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white font-bold mb-4 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {year} Agenda
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                    A single-day deep dive into data science and AI. All sessions take place in the Reitz Auditorium unless otherwise noted.
                </p>
            </div>

            {/* Timeline */}
            <div className="w-full max-w-4xl print:max-w-none print:w-full">
                {agenda.length === 0 ? (
                    <p className="text-center text-gray-400 py-16 print:hidden">No agenda items yet.</p>
                ) : (
                    <div className="flex flex-col">
                        {agenda.map((item) =>
                            isBreak(item.session) ? (
                                <BreakItem key={item.id} item={item} />
                            ) : (
                                <SessionItem key={item.id} item={item} />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Print footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 w-full">
                ufdsi.com · DSI Spring Symposium {year}
            </div>
        </div>
    );
}
