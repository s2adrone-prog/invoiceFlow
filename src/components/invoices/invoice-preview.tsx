
"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer } from "lucide-react";
import { Logo } from "@/components/icons";
import { WhatsAppDialog } from "./whatsapp-dialog";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 448 512"
    {...props}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 .5c58.7 0 111.3 22.5 151.1 63.8 40.2 41.8 62.1 96.2 62.1 156.1 0 107.4-87.1 194.5-194.5 194.5h-.1c-34.9 0-68.8-9.2-99.3-26.2l-7.1-4.2-74.3 19.6 19.9-72.6-4.5-7.4c-18.5-30.7-29.9-66.5-29.9-104.3C24.1 197.8 111.6 111 223.9 111zM223.9 321.4c-12.7 0-24.9-4-35.4-11.8l-1.5-.9-26.2 15.5 15.7-25.5-1-1.6c-10.4-16.6-16-35.6-16-55.8 0-48.4 39.3-87.7 87.7-87.7 23.4 0 45.4 9.1 61.9 25.6 16.5 16.5 25.6 38.5 25.6 61.9 0 48.4-39.3 87.7-87.7 87.7zm0-112.2c-15.1 0-29.2 5.8-39.6 16.2-10.4 10.4-16.2 24.5-16.2 39.6s5.8 29.2 16.2 39.6c10.4 10.4 24.5 16.2 39.6 16.2 15.1 0 29.2-5.8 39.6-16.2 10.4-10.4 16.2-24.5 16.2-39.6s-5.8-29.2-16.2-39.6c-10.4-10.4-24.5-16.2-39.6-16.2z"/>
  </svg>
);


export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const input = invoiceRef.current;
    if (!input) return;

    // Temporarily make all text black for printing
    const originalColors = new Map<HTMLElement, string>();
    const allElements = input.querySelectorAll<HTMLElement>('*');
    allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        originalColors.set(el, style.color);
        el.style.color = 'black';
    });

    window.print();

    // Restore original colors after printing
    allElements.forEach(el => {
        const originalColor = originalColors.get(el);
        if (originalColor) {
            el.style.color = originalColor;
        } else {
            el.style.removeProperty('color');
        }
    });
  };
  
  const handleGeneratePdf = async () => {
    const input = invoiceRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height], true);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };


  const subtotal = invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const totalDiscount = invoice.items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.price;
    const discountAmount = itemTotal * ((item.discountPercentage || 0) / 100);
    return acc + discountAmount;
  }, 0);
  const totalAfterDiscount = subtotal - totalDiscount;
  const gstAmount = invoice.gstRate > 0 ? totalAfterDiscount * (invoice.gstRate / 100) : 0;


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 print:p-0">
       <div className="flex justify-end mb-4 print:hidden gap-2">
        <WhatsAppDialog invoice={invoice} onSend={handleGeneratePdf}>
          <Button>
            <WhatsAppIcon className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </WhatsAppDialog>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Download
        </Button>
      </div>
      <Card ref={invoiceRef} className="print:shadow-none print:border-none print:p-0">
        <CardHeader className="print:p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Logo className="w-auto h-8" />
              </div>
              <p className="text-muted-foreground text-sm">123 Business Rd.<br/>Suite 100<br/>City, State 12345</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-1">Invoice</h2>
              <p className="text-muted-foreground"># {invoice.invoiceNumber}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="print:p-4 print:pt-0">
          <Separator className="my-4 print:my-2" />
          <div className="grid grid-cols-2 gap-4 mb-6 print:mb-3">
            <div>
              <h3 className="font-semibold mb-1 text-sm">Bill To:</h3>
              <p className="text-sm">{invoice.customerName}</p>
              <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
            </div>
            <div className="text-right text-sm">
              <p><span className="font-semibold">Invoice Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="print:p-2">Description</TableHead>
                <TableHead className="text-center print:p-2">Quantity</TableHead>
                <TableHead className="text-right print:p-2">Unit Price</TableHead>
                <TableHead className="text-right print:p-2">Discount</TableHead>
                <TableHead className="text-right print:p-2">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => {
                const itemTotal = item.quantity * item.price;
                const discountAmount = itemTotal * ((item.discountPercentage || 0) / 100);
                const totalAfterDiscount = itemTotal - discountAmount;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="print:p-2">{item.description}</TableCell>
                    <TableCell className="text-center print:p-2">{item.quantity}</TableCell>
                    <TableCell className="text-right print:p-2">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right print:p-2">
                      ${discountAmount.toFixed(2)} ({item.discountPercentage || 0}%)
                    </TableCell>
                    <TableCell className="text-right print:p-2">${totalAfterDiscount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Separator className="my-4 print:my-2" />

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">-${totalDiscount.toFixed(2)}</span>
              </div>
               {invoice.gstRate > 0 && (
                <div className="flex justify-between">
                  <span>GST ({invoice.gstRate}%)</span>
                  <span>${gstAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 print:mt-4 text-center text-muted-foreground text-xs">
            <p>Thank you for your business!</p>
            <p>Please contact us with any questions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
