'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EventForm, FormSubmission, FormStatus } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import SubmissionsTable from './SubmissionsTable';
import FormSettingsPanel from './FormSettingsPanel';

const statusConfig: Record<FormStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    open: { label: 'Open', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    closed: { label: 'Closed', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function FormDetail({ form: initial }: { form: EventForm }) {
    const [form, setForm] = useState<EventForm>(initial);
    const [submissions, setSubmissions] = useState<FormSubmission[] | null>(null);
    const [token, setToken] = useState<string | undefined>();
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [tab, setTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        const supabase = createUserClient();
        supabase.auth.getSession().then(res => {
            if (res.data.session) setToken(res.data.session.access_token);
        });
    }, []);

    useEffect(() => {
        if (submissions === null && token) {
            setLoadingSubmissions(true);
            fetch(`/api/forms/${form.id}/submissions`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(r => r.json())
                .then(res => setSubmissions(res.data ?? res))
                .finally(() => setLoadingSubmissions(false));
        }
    }, [token, form.id, submissions]);

    const stats = {
        confirmed: submissions?.filter(s => s.status === 'confirmed').length ?? 0,
        pending: submissions?.filter(s => s.status === 'pending').length ?? 0,
        waitlist: submissions?.filter(s => s.status === 'waitlist').length ?? 0,
        cancelled: submissions?.filter(s => s.status === 'cancelled').length ?? 0,
    };
    const capacityUsed = stats.confirmed + stats.pending;
    const capacityPercent = form.capacity ? (capacityUsed / form.capacity) * 100 : 0;

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/forms/${form.slug}`);
    };

    return (
        <div className="w-full max-w-5xl">
            <Tabs value={tab} onValueChange={setTab}>
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/admin/forms')}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                        style={{ background: 'none', padding: 0, fontWeight: 'normal' }}
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Forms
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-semibold">{form.title}</h1>
                                <Badge variant="secondary" className={statusConfig[form.status].className}>
                                    {statusConfig[form.status].label}
                                </Badge>
                            </div>
                            {form.description && (
                                <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-0.5">
                                /forms/{form.slug}
                                {form.event_date && ` · ${new Date(form.event_date).toLocaleDateString()}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => router.push(`/admin/builder/${form.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                                Edit Form
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={copyLink}>
                                <Copy className="h-4 w-4" />
                                Copy Link
                            </Button>
                            <a href={`/forms/${form.slug}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    View Public
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="responses">
                        Responses {submissions !== null && <span className="ml-1.5 text-muted-foreground">({submissions.length})</span>}
                    </TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {([
                            { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
                            { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
                            { label: 'Waitlist', value: stats.waitlist, color: 'text-blue-600' },
                            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
                        ]).map(s => (
                            <Card key={s.label}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-semibold">{s.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {form.capacity && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Capacity</CardTitle>
                                <CardDescription>
                                    {capacityUsed} of {form.capacity} spots filled
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={Math.min(100, capacityPercent)} className="h-2" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {Math.max(0, form.capacity - capacityUsed)} spots remaining
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-3">
                            <Button variant="outline" className="gap-2" onClick={copyLink}>
                                <Copy className="h-4 w-4" />
                                Copy Registration Link
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    'gap-2',
                                    form.status === 'open' && 'border-red-200 text-red-700 hover:bg-red-50',
                                    form.status === 'closed' && 'border-green-200 text-green-700 hover:bg-green-50'
                                )}
                                onClick={async () => {
                                    if (!token) return;
                                    const newStatus = form.status === 'open' ? 'closed' : 'open';
                                    const res = await fetch(`/api/forms/${form.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ access_token: token, status: newStatus }),
                                    });
                                    if (res.ok) {
                                        const updated = await res.json();
                                        setForm(updated);
                                    }
                                }}
                            >
                                {form.status === 'open' ? 'Close Registration' : 'Open Registration'}
                            </Button>
                        </CardContent>
                    </Card>

                </TabsContent>

                {/* Responses */}
                <TabsContent value="responses">
                    <SubmissionsTable
                        formId={form.id}
                        formTitle={form.title}
                        submissions={submissions ?? []}
                        loading={loadingSubmissions}
                        token={token}
                        onUpdate={(updated) => {
                            setSubmissions(prev =>
                                (prev ?? []).map(s => (s.id === updated.id ? updated : s))
                            );
                        }}
                    />
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings">
                    <FormSettingsPanel
                        form={form}
                        token={token}
                        onSave={(updated) => setForm(updated)}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
