import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewInvoicePage() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <InvoiceForm />
      </CardContent>
    </Card>
  )
}
