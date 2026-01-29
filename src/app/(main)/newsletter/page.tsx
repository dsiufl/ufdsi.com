
import { createClient } from '@/lib/supabase/server';
import Newsletter from './components/Newsletter';
import { cookies } from 'next/headers';


export default async function NewsletterPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: articles, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return <div>Error loading articles.</div>;
  }

  return <Newsletter articles={articles || []} />;
}