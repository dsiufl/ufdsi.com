'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MoreVertical, Download, CheckCircle, Eye, ListOrdered, XCircle, Paperclip } from 'lucide-react';
import { FormSubmission, SubmissionStatus } from '@/types/db';
import Loading from '@/components/Loading/Loading';

function FileLink({ formId, path, name, token }: { formId: string; path: string; name: string; token: string | undefined }) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/forms/${formId}/file?path=${encodeURIComponent(path)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const { url } = await res.json();
                window.open(url, '_blank');
            }
        } catch {
            // ignore
        }
        setLoading(false);
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="mt-1 flex items-center gap-1.5 text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
            <Paperclip className="h-3.5 w-3.5" />
            {loading ? 'Opening...' : name}
        </button>
    );
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    waitlist: { label: 'Waitlist', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function SubmissionsTable({
    formId,
    formTitle,
    submissions,
    loading,
    token,
    onUpdate,
}: {
    formId: string;
    formTitle: string;
    submissions: FormSubmission[];
    loading: boolean;
    token: string | undefined;
    onUpdate: (updated: FormSubmission) => void;
}) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [viewSub, setViewSub] = useState<FormSubmission | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');

    const visible = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

    async function updateStatus(subId: string, status: SubmissionStatus) {
        if (!token) return;
        setUpdating(subId);
        const res = await fetch(`/api/forms/${formId}/submissions/${subId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: token, status }),
        });
        if (res.ok) {
            const updated = await res.json();
            onUpdate(updated);
        }
        setUpdating(null);
    }

    async function bulkConfirm() {
        for (const subId of Array.from(selected)) {
            const sub = submissions.find(s => s.id === subId);
            if (sub && sub.status !== 'confirmed') {
                await updateStatus(subId, 'confirmed');
            }
        }
        setSelected(new Set());
    }

    function exportCSV() {
        if (!token) return;
        fetch(`/api/forms/${formId}/export`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => {
                if (!r.ok) throw new Error('Export failed');
                return r.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${formTitle.replace(/\s+/g, '_')}_submissions.csv`;
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(console.error);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    if (loading) return <Loading message="Loading responses..." />;

    return (
        <div>
            {/* Filter Buttons */}
            <div className="mb-6 flex items-center gap-2">
                {(['all', 'confirmed', 'pending', 'waitlist', 'cancelled'] as const).map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className={filter === f ? 'bg-[#FF5722] hover:bg-[#F4511E] text-white' : ''}
                    >
                        {f === 'all' ? 'All' : statusConfig[f].label} ({f === 'all' ? submissions.length : submissions.filter(s => s.status === f).length})
                    </Button>
                ))}
            </div>

            {/* Actions Bar */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {selected.size > 0 && (
                        <>
                            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                            <Button size="sm" variant="outline" className="gap-2" onClick={bulkConfirm}>
                                <CheckCircle className="h-4 w-4" />
                                Confirm
                            </Button>
                        </>
                    )}
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={exportCSV}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selected.size === visible.length && visible.length > 0}
                                    onCheckedChange={(checked) =>
                                        setSelected(checked ? new Set(visible.map(s => s.id)) : new Set())
                                    }
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                                    No submissions{filter !== 'all' ? ` with status "${filter}"` : ''}.
                                </TableCell>
                            </TableRow>
                        )}
                        {visible.map(sub => (
                            <TableRow key={sub.id} className={updating === sub.id ? 'opacity-50' : ''}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.has(sub.id)}
                                        onCheckedChange={(checked) => {
                                            const next = new Set(selected);
                                            checked ? next.add(sub.id) : next.delete(sub.id);
                                            setSelected(next);
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {sub.first_name} {sub.last_name}
                                    {sub.status === 'waitlist' && sub.waitlist_position && (
                                        <span className="ml-1 text-xs text-muted-foreground">#{sub.waitlist_position}</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{sub.email}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {formatDate(sub.submitted_at)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusConfig[sub.status].className}>
                                        {statusConfig[sub.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setViewSub(sub)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            {sub.status !== 'confirmed' && (
                                                <DropdownMenuItem onClick={() => updateStatus(sub.id, 'confirmed')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Confirm
                                                </DropdownMenuItem>
                                            )}
                                            {sub.status !== 'waitlist' && (
                                                <DropdownMenuItem onClick={() => updateStatus(sub.id, 'waitlist')}>
                                                    <ListOrdered className="mr-2 h-4 w-4" />
                                                    Move to Waitlist
                                                </DropdownMenuItem>
                                            )}
                                            {sub.status !== 'cancelled' && (
                                                <DropdownMenuItem className="text-destructive" onClick={() => updateStatus(sub.id, 'cancelled')}>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Cancel
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!viewSub} onOpenChange={(open) => !open && setViewSub(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {viewSub?.first_name} {viewSub?.last_name}
                        </DialogTitle>
                        <DialogDescription>
                            Submitted on {viewSub && formatDate(viewSub.submitted_at)}
                        </DialogDescription>
                    </DialogHeader>
                    {viewSub && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">Email</Label>
                                <p className="mt-1">{viewSub.email}</p>
                            </div>
                            {viewSub.phone && (
                                <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="mt-1">{viewSub.phone}</p>
                                </div>
                            )}
                            <div>
                                <Label className="text-muted-foreground">Status</Label>
                                <div className="mt-1">
                                    <Badge variant="secondary" className={statusConfig[viewSub.status].className}>
                                        {statusConfig[viewSub.status].label}
                                    </Badge>
                                    {viewSub.waitlist_position && (
                                        <span className="ml-2 text-sm text-muted-foreground">#{viewSub.waitlist_position}</span>
                                    )}
                                </div>
                            </div>
                            {Object.keys(viewSub.data).length > 0 && (
                                <div className="border-t pt-4">
                                    <p className="font-medium mb-3">Form Responses</p>
                                    {Object.entries(viewSub.data).map(([k, v]) => (
                                        <div key={k} className="mb-3">
                                            <Label className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</Label>
                                            {v && typeof v === 'object' && !Array.isArray(v) && 'path' in (v as Record<string, unknown>) ? (
                                                <FileLink
                                                    formId={formId}
                                                    path={(v as { path: string }).path}
                                                    name={(v as { name: string }).name}
                                                    token={token}
                                                />
                                            ) : (
                                                <p className="mt-1">{Array.isArray(v) ? v.join(', ') : String(v ?? '—')}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
