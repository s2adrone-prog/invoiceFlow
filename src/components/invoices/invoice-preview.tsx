"use client";

import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from "../icons";
import { Printer } from "lucide-react";

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const handlePrint = () => {
    window.print();
  };
  
  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const gstAmount = subtotal * (invoice.gstRate / 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 print:p-0">
       <div className="flex justify-end mb-4 print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Download
        </Button>
      </div>
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Logo className="size-8 text-primary" />
                 <h1 className="text-2xl font-bold">ADR E-Store</h1>
              </div>
              <p className="text-muted-foreground">123 Business Rd.<br/>Suite 100<br/>City, State 12345</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">Invoice</h2>
              <p className="text-muted-foreground"># {invoice.invoiceNumber}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p>{invoice.customerName}</p>
              <p className="text-muted-foreground">{invoice.customerEmail}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Invoice Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({invoice.gstRate}%)</span>
                <span>${gstAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-muted-foreground text-sm">
            <p>Thank you for your business!</p>
            <p>Please contact us with any questions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
