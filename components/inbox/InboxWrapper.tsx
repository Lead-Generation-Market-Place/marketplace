'use client';

import dynamic from 'next/dynamic';

const LazyInboxClient = dynamic(() => import('./InboxClient'), {
  ssr: false,
  loading: () => <p className="p-4">Loading chat...</p>,
});

export default function InboxWrapper({ userId }: { userId: string }) {
  return <LazyInboxClient userId={userId} />;
}
