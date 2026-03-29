'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Copy, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

const statusConfig: Record<FormStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    open: { label: 'Open', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    closed: { label: 'Closed', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
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

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Forms</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage registration forms and collect responses
                    </p>
                </div>
                <Button
                    className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                    onClick={() => router.push('/admin/forms/new')}
                >
                    <Plus className="h-4 w-4" />
                    New Form
                </Button>
            </div>

            {forms.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No forms yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Get started by creating your first form
                    </p>
                    <Button
                        className="mt-6 gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                        onClick={() => router.push('/admin/forms/new')}
                    >
                        <Plus className="h-4 w-4" />
                        New Form
                    </Button>
                </div>
            ) : (
                <div className="rounded-lg border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead>Responses</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {forms.map(form => {
                                const c = counts[form.id] ?? { total: 0, confirmed: 0, waitlist: 0 };
                                return (
                                    <TableRow
                                        key={form.id}
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => router.push(`/admin/forms/${form.id}`)}
                                    >
                                        <TableCell>
                                            <div className="font-medium">{form.title}</div>
                                            {form.description && (
                                                <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                                    {form.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={statusConfig[form.status].className}
                                            >
                                                {statusConfig[form.status].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(form.deadline)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {c.total}
                                        </TableCell>
                                        <TableCell onClick={e => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/builder/${form.id}`)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Form
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/forms/${form.slug}`)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Copy Link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onSelect={() => setTimeout(() => setDeleteTarget(form), 0)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Form</DialogTitle>
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
