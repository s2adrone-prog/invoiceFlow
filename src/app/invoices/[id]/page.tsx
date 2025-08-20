
"use client";

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getInvoiceById } from '@/lib/data';
import { InvoicePreview } from '@/components/invoices/invoice-preview';
import type { Invoice } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function InvoicePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (user && id) {
        const data = await getInvoiceById(id);
        setInvoice(data);
      } else {
        // Handle case where there is no user or id
        setInvoice(null);
      }
    }
    fetchData();
  }, [id, user]);

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
