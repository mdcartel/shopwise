import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CustomersClient from './customers-client';
import { customers, orders } from '@/data/mock-data';

export default async function CustomersPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['customers-list'],
    queryFn: async () => customers,
  });

  await queryClient.prefetchQuery({
    queryKey: ['orders-list'],
    queryFn: async () => orders,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersClient />
    </HydrationBoundary>
  );
}
