import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MemoryClient from './memory-client';
import { memories } from '@/data/mock-data';

export default async function MemoryPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['memories-list'],
    queryFn: async () => memories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemoryClient />
    </HydrationBoundary>
  );
}
