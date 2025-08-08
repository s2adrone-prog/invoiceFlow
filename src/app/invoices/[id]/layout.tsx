import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'View Invoice',
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return (
    // This simple layout is used to provide a clean slate for the printable invoice page
    // It purposefully does not include the main AppLayout
    <div className="bg-background min-h-screen">
      {children}
    </div>
  );
}
