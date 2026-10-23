'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Copy, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Empty, PageHeader, Panel } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { EventForm, FormStatus } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';
import { CreateButton } from "../../components/CreateButton";

const statusConfig: Record<FormStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: '' },
    open: { label: 'Open', className: 'admin-pill--ok' },
    closed: { label: 'Closed', className: 'admin-pill--plain' },
};

type Counts = Record<string, { total: number; confirmed: number; waitlist: number }>;

function formatDate(dateString?: string | null) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function FormsManager({ forms: initial, counts }: { forms: EventForm[]; counts: Counts }) {
    const [forms, setForms] = useState<EventForm[]>(initial);
    const [deleteTarget, setDeleteTarget] = useState<EventForm | null>(null);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        const supabase = createUserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setDeleting(false); return; }

        const res = await fetch(`/api/forms/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: session.access_token }),
        });

        if (res.ok) {
            setForms(prev => prev.filter(f => f.id !== deleteTarget.id));
        }
        setDeleting(false);
        setDeleteTarget(null);
    }

    const open = forms.filter(f => f.status === 'open').length;

    return (
        <div className="admin-page">
            <PageHeader
                label="Events"
                title="Forms"
                description="Sign-ups and RSVPs for DSI events. Open a form to see responses, manage the waitlist or export them."
                actions={
                    <CreateButton label="New form" href="/admin/forms/new" />
                }
            />

            <Panel title="All forms" meta={open ? `${forms.length} · ${open} open` : forms.length}>
                {forms.length === 0 ? (
                    <Empty title="No forms yet">Start one from a template with New form.</Empty>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Form</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Responses</th>
                                    <th aria-label="Actions" />
                                </tr>
                            </thead>
                            <tbody>
                                {forms.map(form => {
                                    const c = counts[form.id] ?? { total: 0, confirmed: 0, waitlist: 0 };
                                    const fill = form.capacity ? Math.min(1, c.confirmed / form.capacity) : 0;
                                    return (
                                        <tr
                                            key={form.id}
                                            className="cursor-pointer"
                                            onClick={() => router.push(`/admin/forms/${form.id}`)}
                                        >
                                            <td className="max-w-[26rem]">
                                                <Link href={`/admin/forms/${form.id}`} className="admin-table__title hover:underline" onClick={e => e.stopPropagation()}>
                                                    {form.title}
                                                </Link>
                                                <p className="admin-table__sub line-clamp-1">/forms/{form.slug}</p>
                                            </td>
                                            <td>
                                                <span className={`admin-pill ${statusConfig[form.status].className}`}>
                                                    {statusConfig[form.status].label}
                                                </span>
                                            </td>
                                            <td className="is-num whitespace-nowrap text-muted-foreground">
                                                {formatDate(form.deadline)}
                                            </td>
                                            <td className="is-num min-w-[9rem]">
                                                <span className="font-medium">{c.total}</span>
                                                <span className="text-muted-foreground">
                                                    {form.capacity ? ` · ${c.confirmed}/${form.capacity} spots` : ''}
                                                    {c.waitlist ? ` · ${c.waitlist} waitlisted` : ''}
                                                </span>
                                                {form.capacity ? (
                                                    <span className="mt-1.5 block h-1 w-full max-w-[8rem] overflow-hidden rounded-full bg-muted">
                                                        <span className="block h-full rounded-full bg-[hsl(var(--brand))]" style={{ width: `${fill * 100}%` }} />
                                                    </span>
                                                ) : null}
                                            </td>
                                            <td className="w-12 text-right" onClick={e => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${form.title}`}>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/builder/${form.id}`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit fields
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/forms/${form.slug}`)}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Copy link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onSelect={() => setTimeout(() => setDeleteTarget(form), 0)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this form?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This will also delete all submissions. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
