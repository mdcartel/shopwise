import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import InboxClient from './inbox-client';
import { emails } from '@/data/mock-data';

export default async function InboxPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['emails-list'],
    queryFn: async () => emails,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InboxClient />
    </HydrationBoundary>
  );
}
