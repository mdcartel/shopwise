import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DashboardClient from './dashboard-client';
import { kpis, priorities, activities } from '@/data/mock-data';

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['kpis'],
    queryFn: async () => kpis,
  });

  await queryClient.prefetchQuery({
    queryKey: ['priorities'],
    queryFn: async () => priorities,
  });

  await queryClient.prefetchQuery({
    queryKey: ['activities'],
    queryFn: async () => activities,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
