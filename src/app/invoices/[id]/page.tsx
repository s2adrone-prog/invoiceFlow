import { notFound } from 'next/navigation';
import { getInvoiceById } from '@/lib/data';
import { InvoicePreview } from '@/components/invoices/invoice-preview';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  return <InvoicePreview invoice={invoice} />;
}
