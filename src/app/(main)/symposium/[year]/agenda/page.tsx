import { Button } from '@/components/ui/button';
import { Table, TableCell, TableHead, TableRow, TableHeader, TableBody } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
export default async function Page({params}: {params: {year: string}}) {
    const { year } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {data: symposium} = await supabase.from('symposiums').select('*').eq('year', year).single();
    
    return (
        <div className='w-full p-10'>
            <h3 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                DSI SYMPOSIUM - 2026 AGENDA
            </h3>
            <Table className='!max-h-fit'>
                <TableHeader className="!sticky top-0 bg-primary/80 dark:bg-primary backdrop-blur-sm z-10">
                    <TableRow>
                        <TableHead className='text-foreground'>Session</TableHead>
                        <TableHead className='text-foreground'>Speaker(s)</TableHead>
                        <TableHead className='text-foreground'>Time range</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='border border-primary !h-fit'>
                    {symposium?.agenda.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.session}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.time_range}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}