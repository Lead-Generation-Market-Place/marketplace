'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VerifyForm = dynamic(() => import('@/components/dashboard/service/Social'), {
  ssr: false,
  loading: () => <p className="text-center mt-8">Loading...</p>,
});

export default function VerifyPage() {
  return (
    <Suspense fallback={<p className="text-center mt-8">Loading form...</p>}>
      <VerifyForm />
    </Suspense>
  );
}
