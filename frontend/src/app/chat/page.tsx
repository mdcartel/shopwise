import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ChatClient from './chat-client';
import { chatMessages } from '@/data/mock-data';

export default async function ChatPage() {
  const queryClient = new QueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: ['chat-history'],
    queryFn: async () => chatMessages,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatClient />
    </HydrationBoundary>
  );
}
