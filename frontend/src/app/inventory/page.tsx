import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import InventoryClient from './inventory-client';
import { products } from '@/data/mock-data';

export default async function InventoryPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['products-list'],
    queryFn: async () => products,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InventoryClient />
    </HydrationBoundary>
  );
}
