'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Copy, Edit, Trash2 } from 'lucide-react';
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
import { FormTemplateDB } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';
import { CreateButton } from "../../components/CreateButton";

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
        <div className="admin-page">
            <PageHeader
                label="Events"
                title="Templates"
                description="Starting points for new forms. Defaults ship with the site; duplicate one to tweak it."
                actions={
                    <CreateButton label="New template" href="/admin/templates/new" />
                }
            />

            <Panel title="All templates" meta={templates.length}>
                {templates.length === 0 ? (
                    <Empty title="No templates yet">Create one to speed up new forms.</Empty>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Template</th>
                                    <th>Category</th>
                                    <th>Fields</th>
                                    <th>Updated</th>
                                    <th aria-label="Actions" />
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map(template => (
                                    <tr
                                        key={template.id}
                                        className="cursor-pointer"
                                        onClick={() => router.push(`/admin/templates/${template.id}`)}
                                    >
                                        <td className="max-w-[28rem]">
                                            <div className="flex items-center gap-2">
                                                <span className="admin-table__title">{template.name}</span>
                                                {template.is_default && <span className="admin-pill admin-pill--info admin-pill--plain">Default</span>}
                                            </div>
                                            {template.description && (
                                                <p className="admin-table__sub line-clamp-1">{template.description}</p>
                                            )}
                                        </td>
                                        <td className="capitalize text-muted-foreground">{template.category}</td>
                                        <td className="is-num text-muted-foreground">{template.fields.length}</td>
                                        <td className="is-num whitespace-nowrap text-muted-foreground">{formatDate(template.updated_at ?? template.created_at)}</td>
                                        <td className="w-12 text-right" onClick={e => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${template.name}`}>
                                                        <MoreHorizontal />
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
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        disabled={template.is_default}
                                                        onSelect={() => setTimeout(() => setDeleteTarget(template), 0)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this template?</DialogTitle>
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
