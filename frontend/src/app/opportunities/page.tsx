import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import OpportunitiesClient from './opportunities-client';
import { opportunities } from '@/data/mock-data';

export default async function OpportunitiesPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['opportunities-list'],
    queryFn: async () => opportunities,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OpportunitiesClient />
    </HydrationBoundary>
  );
}
