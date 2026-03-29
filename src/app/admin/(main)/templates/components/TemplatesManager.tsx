'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Copy, Edit, Trash2, FileText, Layers } from 'lucide-react';
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
import { FormTemplateDB } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';

function formatDate(dateString?: string | null) {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function TemplatesManager({ templates: initial }: { templates: FormTemplateDB[] }) {
    const [templates, setTemplates] = useState<FormTemplateDB[]>(initial);
    const [deleteTarget, setDeleteTarget] = useState<FormTemplateDB | null>(null);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        const supabase = createUserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(`/api/templates/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: session.access_token }),
        });

        if (res.ok) {
            setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id));
        }
        setDeleting(false);
        setDeleteTarget(null);
    }

    async function handleDuplicate(template: FormTemplateDB) {
        const supabase = createUserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: session.access_token,
                name: `${template.name} (Copy)`,
                description: template.description,
                icon: template.icon,
                category: template.category,
                fields: template.fields,
            }),
        });

        if (res.ok) {
            const newTemplate = await res.json();
            setTemplates(prev => [...prev, newTemplate]);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Templates</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage form templates used as starting points
                    </p>
                </div>
                <Button
                    className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                    onClick={() => router.push('/admin/templates/new')}
                >
                    <Plus className="h-4 w-4" />
                    New Template
                </Button>
            </div>

            {templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Layers className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No templates yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first template to speed up form creation
                    </p>
                    <Button
                        className="mt-6 gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                        onClick={() => router.push('/admin/templates/new')}
                    >
                        <Plus className="h-4 w-4" />
                        New Template
                    </Button>
                </div>
            ) : (
                <div className="rounded-lg border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Fields</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map(template => (
                                <TableRow
                                    key={template.id}
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => router.push(`/admin/templates/${template.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{template.name}</span>
                                            {template.is_default && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    Default
                                                </Badge>
                                            )}
                                        </div>
                                        {template.description && (
                                            <div className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                                {template.description}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {template.category}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {template.fields.length}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(template.created_at)}
                                    </TableCell>
                                    <TableCell onClick={e => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.push(`/admin/templates/${template.id}`)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    disabled={template.is_default}
                                                    onClick={() => setDeleteTarget(template)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Template</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This action cannot be undone.
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
