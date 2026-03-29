'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventForm } from '@/types/db';

export default function FormSettingsPanel({
    form,
    token,
    onSave,
}: {
    form: EventForm;
    token: string | undefined;
    onSave: (updated: EventForm) => void;
}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState(form.title);
    const [description, setDescription] = useState(form.description ?? '');
    const [slug, setSlug] = useState(form.slug);
    const [eventDate, setEventDate] = useState(form.event_date ?? '');
    const [deadline, setDeadline] = useState(form.deadline ? new Date(form.deadline).toISOString().slice(0, 16) : '');
    const [capacity, setCapacity] = useState(form.capacity?.toString() ?? '');
    const [allowedDomains, setAllowedDomains] = useState(form.allowed_domains?.join(', ') ?? '');
    const [isOpen, setIsOpen] = useState(form.status === 'open');

    const isDirty = useMemo(() => {
        return title !== form.title
            || description !== (form.description ?? '')
            || slug !== form.slug
            || eventDate !== (form.event_date ?? '')
            || capacity !== (form.capacity?.toString() ?? '')
            || allowedDomains !== (form.allowed_domains?.join(', ') ?? '')
            || isOpen !== (form.status === 'open');
    }, [title, description, slug, eventDate, capacity, allowedDomains, isOpen, form]);

    useEffect(() => {
        if (!isDirty) return;
        const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    async function handleSave() {
        if (!token) return;
        setSaving(true);
        setError(null);
        setSaved(false);

        const res = await fetch(`/api/forms/${form.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: token,
                title,
                description: description || null,
                slug,
                status: isOpen ? 'open' : (form.status === 'draft' && !isOpen ? 'draft' : 'closed'),
                event_date: eventDate || null,
                deadline: deadline ? new Date(deadline).toISOString() : null,
                capacity: capacity ? parseInt(capacity) : null,
                allowed_domains: allowedDomains
                    ? allowedDomains.split(',').map(d => d.trim().toLowerCase()).filter(Boolean)
                    : null,
            }),
        });

        setSaving(false);
        if (!res.ok) {
            setError(await res.text());
            return;
        }
        const updated = await res.json();
        onSave(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    async function handleDelete() {
        if (!token || !confirm('Are you sure you want to delete this form? This cannot be undone.')) return;
        const res = await fetch(`/api/forms/${form.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: token }),
        });
        if (res.ok) {
            router.push('/admin/forms');
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-3 border-b border-border -mx-1 px-1">
                <div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {saved && <p className="text-green-600 text-sm">Settings saved.</p>}
                </div>
                <Button
                    className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Form Status</CardTitle>
                    <CardDescription>Control whether new registrations are accepted</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Registration Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Form is currently {isOpen ? 'open' : form.status === 'draft' ? 'draft' : 'closed'}
                            </p>
                        </div>
                        <Switch checked={isOpen} onCheckedChange={setIsOpen} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Form Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1.5" />
                    </div>
                    <div>
                        <Label>URL Slug</Label>
                        <Input value={slug} onChange={e => setSlug(e.target.value)} className="mt-1.5" />
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {typeof window !== 'undefined' ? window.location.origin : ''}/forms/{slug}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Event Date</Label>
                        <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                        <Label>Registration Deadline</Label>
                        <Input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                        <Label>Capacity</Label>
                        <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Leave blank for unlimited" className="mt-1.5" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label>Allowed Email Domains</Label>
                        <Input
                            value={allowedDomains}
                            onChange={e => setAllowedDomains(e.target.value)}
                            placeholder="ufl.edu, example.com"
                            className="mt-1.5"
                        />
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Comma-separated list of allowed domains. Leave blank to allow all.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                        Delete Form
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
