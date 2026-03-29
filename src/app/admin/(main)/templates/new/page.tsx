'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createUserClient } from '@/lib/supabase/client';

export default function NewTemplatePage() {
    const router = useRouter();
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('general');

    async function handleCreate() {
        if (!name.trim()) {
            setError('Template name is required.');
            return;
        }
        setCreating(true);
        setError(null);

        const supabase = createUserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError('You must be logged in.');
            setCreating(false);
            return;
        }

        try {
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: session.access_token,
                    name: name.trim(),
                    description: description.trim() || null,
                    category,
                    icon: 'FileText',
                    fields: [],
                }),
            });

            if (res.ok) {
                const template = await res.json();
                router.push(`/admin/templates/${template.id}`);
            } else {
                setError(await res.text());
                setCreating(false);
            }
        } catch {
            setError('Failed to create template. Please try again.');
            setCreating(false);
        }
    }

    return (
        <div className="container pt-20 max-w-xl">
            <button
                onClick={() => router.push('/admin/templates')}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                style={{ background: 'none', padding: 0, fontWeight: 'normal' }}
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Templates
            </button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        New Template
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., Workshop Registration"
                            className="mt-1.5"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Brief description of what this template is for"
                            rows={3}
                            className="mt-1.5"
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="events">Events</SelectItem>
                                <SelectItem value="surveys">Surveys</SelectItem>
                                <SelectItem value="applications">Applications</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white"
                        onClick={handleCreate}
                        disabled={creating}
                    >
                        {creating ? 'Creating...' : 'Create Template'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
