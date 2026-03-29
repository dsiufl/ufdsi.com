'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Upload, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { FormField } from '@/types/db';
import { autoMapColumns, validateRow, mapRow } from '@/lib/import-utils';

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'done';

const CORE_TARGETS = [
    { value: 'first_name', label: 'First Name' },
    { value: 'last_name', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
];

export default function ImportDialog({
    open,
    onOpenChange,
    formId,
    formFields,
    token,
    onComplete,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formId: string;
    formFields: FormField[];
    token: string | undefined;
    onComplete: () => void;
}) {
    const [step, setStep] = useState<Step>('upload');
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [skipDuplicates, setSkipDuplicates] = useState(true);
    const [defaultStatus, setDefaultStatus] = useState<'confirmed' | 'pending'>('confirmed');
    const [result, setResult] = useState<{ imported: number; skipped: number; errors: { row: number; message: string }[] } | null>(null);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function reset() {
        setStep('upload');
        setCsvHeaders([]);
        setCsvRows([]);
        setMapping({});
        setResult(null);
        setImportProgress(0);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields ?? [];
                const rows = results.data as Record<string, string>[];
                setCsvHeaders(headers);
                setCsvRows(rows);
                // Auto-map columns
                const autoMap = autoMapColumns(headers, formFields);
                setMapping(autoMap);
                setStep('mapping');
            },
        });
    }

    function updateMapping(csvCol: string, target: string) {
        setMapping(prev => {
            const next = { ...prev };
            if (target === '__none__') {
                delete next[csvCol];
            } else {
                next[csvCol] = target;
            }
            return next;
        });
    }

    const mappedTargets = new Set(Object.values(mapping));
    const hasCoreFields = ['first_name', 'last_name', 'email'].every(f => mappedTargets.has(f));

    // Preview data
    const previewRows = csvRows.slice(0, 10).map((row, i) => {
        const errors = validateRow(row, mapping);
        return { index: i, mapped: mapRow(row, mapping), errors };
    });
    const totalErrors = csvRows.reduce((acc, row) => acc + (validateRow(row, mapping).length > 0 ? 1 : 0), 0);

    async function handleImport() {
        if (!token) return;
        setStep('importing');
        setImportProgress(10);

        const mapped = csvRows
            .map(row => mapRow(row, mapping))
            .filter(r => r.first_name && r.last_name && r.email);

        setImportProgress(30);

        try {
            const res = await fetch(`/api/forms/${formId}/import`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: token,
                    rows: mapped,
                    skip_duplicates: skipDuplicates,
                    default_status: defaultStatus,
                }),
            });

            setImportProgress(90);

            if (res.ok) {
                const data = await res.json();
                setResult(data);
            } else {
                setResult({ imported: 0, skipped: 0, errors: [{ row: 0, message: await res.text() }] });
            }
        } catch {
            setResult({ imported: 0, skipped: 0, errors: [{ row: 0, message: 'Network error' }] });
        }

        setImportProgress(100);
        setStep('done');
    }

    // Custom form field targets for mapping dropdowns
    const fieldTargets = formFields
        .filter(f => !['section-header', 'info-banner', 'waiver', 'page-break'].includes(f.type))
        .map(f => ({ value: f.id, label: f.label }));

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Submissions from CSV</DialogTitle>
                    <DialogDescription>
                        {step === 'upload' && 'Upload a CSV file exported from Google Sheets or another source.'}
                        {step === 'mapping' && `Map CSV columns to form fields. ${csvRows.length} rows detected.`}
                        {step === 'preview' && 'Review the mapped data before importing.'}
                        {step === 'importing' && 'Importing submissions...'}
                        {step === 'done' && 'Import complete.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                            Select a .csv file to import
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button onClick={() => fileInputRef.current?.click()}>
                            Choose File
                        </Button>
                    </div>
                )}

                {/* Step 2: Column Mapping */}
                {step === 'mapping' && (
                    <div className="space-y-4">
                        <div className="rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>CSV Column</TableHead>
                                        <TableHead>Maps To</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {csvHeaders.map(header => (
                                        <TableRow key={header}>
                                            <TableCell className="font-medium">{header}</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={mapping[header] ?? '__none__'}
                                                    onValueChange={(v) => updateMapping(header, v)}
                                                >
                                                    <SelectTrigger className="w-56">
                                                        <SelectValue placeholder="Skip this column" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="__none__">-- Skip --</SelectItem>
                                                        {CORE_TARGETS.map(t => (
                                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                        ))}
                                                        {fieldTargets.map(t => (
                                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {!hasCoreFields && (
                            <p className="text-sm text-amber-600">
                                Please map First Name, Last Name, and Email before continuing.
                            </p>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep('upload')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                disabled={!hasCoreFields}
                                onClick={() => setStep('preview')}
                                className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                            >
                                Preview
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Step 3: Preview */}
                {step === 'preview' && (
                    <div className="space-y-4">
                        <div className="flex gap-4 text-sm">
                            <span>{csvRows.length} total rows</span>
                            {totalErrors > 0 && (
                                <span className="text-amber-600">{totalErrors} with issues</span>
                            )}
                        </div>

                        <div className="rounded-lg border border-border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previewRows.map(({ index, mapped, errors }) => (
                                        <TableRow key={index} className={errors.length > 0 ? 'bg-amber-50 dark:bg-amber-900/10' : ''}>
                                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                            <TableCell>{mapped.first_name} {mapped.last_name}</TableCell>
                                            <TableCell>{mapped.email}</TableCell>
                                            <TableCell>
                                                {errors.length > 0 ? (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                                        {errors[0]}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                        Ready
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {csvRows.length > 10 && (
                            <p className="text-sm text-muted-foreground">Showing first 10 of {csvRows.length} rows</p>
                        )}

                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="skip-dups"
                                    checked={skipDuplicates}
                                    onCheckedChange={(c) => setSkipDuplicates(!!c)}
                                />
                                <Label htmlFor="skip-dups" className="text-sm">Skip duplicate emails</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm">Import as:</Label>
                                <Select value={defaultStatus} onValueChange={(v: 'confirmed' | 'pending') => setDefaultStatus(v)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep('mapping')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleImport}
                                className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                            >
                                Import {csvRows.length - totalErrors} Rows
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Step 4: Importing */}
                {step === 'importing' && (
                    <div className="py-8 space-y-4">
                        <Progress value={importProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">Importing submissions...</p>
                    </div>
                )}

                {/* Step 5: Done */}
                {step === 'done' && result && (
                    <div className="py-6 space-y-4">
                        <div className="flex items-center gap-3">
                            {result.imported > 0 ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : (
                                <AlertCircle className="h-8 w-8 text-amber-600" />
                            )}
                            <div>
                                <p className="font-medium">{result.imported} submissions imported</p>
                                {result.skipped > 0 && (
                                    <p className="text-sm text-muted-foreground">{result.skipped} skipped (duplicate)</p>
                                )}
                                {result.errors.length > 0 && (
                                    <p className="text-sm text-red-600">{result.errors.length} errors</p>
                                )}
                            </div>
                        </div>
                        {result.errors.length > 0 && (
                            <div className="text-sm text-red-600 space-y-1">
                                {result.errors.slice(0, 5).map((e, i) => (
                                    <p key={i}>Row {e.row}: {e.message}</p>
                                ))}
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    reset();
                                    onOpenChange(false);
                                    onComplete();
                                }}
                                className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                            >
                                Done
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
