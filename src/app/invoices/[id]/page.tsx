
"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/lib/data';
import { InvoicePreview } from '@/components/invoices/invoice-preview';
import type { Invoice } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function InvoicePage({ params: { id } }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      const data = await getInvoiceById(id);
      setInvoice(data);
    }
    fetchData();
  }, [id]);

  if (invoice === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (invoice === null) {
    notFound();
  }

  return <InvoicePreview invoice={invoice} />;
}
