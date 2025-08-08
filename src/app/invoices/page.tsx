import { InvoicesTable } from "@/components/invoices/invoices-table";
import { getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <InvoicesTable invoices={invoices} />;
}
