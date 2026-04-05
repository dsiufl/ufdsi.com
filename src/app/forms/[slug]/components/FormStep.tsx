import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function FormStep({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-xl">
            <Card className="rounded-xl border py-6 shadow-sm w-full">
                <CardHeader className="px-6 gap-2 pb-0">
                    <h2 className="leading-none font-semibold text-lg">{title}</h2>
                    {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
                </CardHeader>
                <CardContent className="px-6 pt-6">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
