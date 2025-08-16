import { unstable_noStore as noStore } from 'next/cache';
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  // This prevents the page from being cached, ensuring the invoice list is always fresh.
  noStore();
  
  const invoices = await getInvoices();
  return <InvoicesTable invoices={invoices} />;
}
