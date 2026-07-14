import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DecisionsClient from './decisions-client';
import { decisions } from '@/data/mock-data';

export default async function DecisionsPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['decisions-list'],
    queryFn: async () => decisions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DecisionsClient />
    </HydrationBoundary>
  );
}
