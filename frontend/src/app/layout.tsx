import React from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import { AppLayout } from '@/components/layout/AppLayout';
import '../index.css';

export const metadata: Metadata = {
  title: 'ShopWise - AI Business Co-Pilot',
  description: 'The AI business co-pilot that remembers your business and helps you run your online store.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%237c3aed%22/><text y=%22.75em%22 x=%22.18em%22 font-size=%2270%22 font-weight=%22bold%22 fill=%22white%22 font-family=%22sans-serif%22>S</text></svg>'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark">
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
