// app/(dashboard)/inbox/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import InboxWrapper from '@/components/inbox/InboxWrapper';

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <InboxWrapper userId={user.id} />;
}
