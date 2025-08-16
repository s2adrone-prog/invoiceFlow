
"use client";

import { useEffect, useState } from 'react';
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { getInvoices } from "@/lib/data";
import type { Invoice } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getInvoices();
      setInvoices(data);
      setIsLoading(false);
    };

    fetchInvoices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return <InvoicesTable invoices={invoices} />;
}
