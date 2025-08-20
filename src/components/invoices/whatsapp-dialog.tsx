"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Invoice } from "@/lib/types";

interface WhatsAppDialogProps {
  invoice: Invoice;
  children: React.ReactNode;
  onSend: () => Promise<void>;
}

export function WhatsAppDialog({ invoice, children, onSend }: WhatsAppDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (invoice.customerPhone) {
      setPhoneNumber(invoice.customerPhone);
    }
  }, [invoice.customerPhone]);

  const handleSend = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    // Generate and download the PDF first
    await onSend();

    // Then prepare and open the WhatsApp link
    const message = `Hello ${invoice.customerName},

Here is your invoice ${invoice.invoiceNumber} for ₹${invoice.total.toFixed(2)}.

Please find the attached PDF for details.

Thank you for your business!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    
    // Give a small delay for the PDF to start downloading before opening whatsapp
    setTimeout(() => {
        window.open(whatsappUrl, "_blank");
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Invoice via WhatsApp</DialogTitle>
          <DialogDescription>
            Enter the customer's phone number with country code. The invoice will be downloaded as a PDF for you to attach.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSend}>
              Download PDF & Send
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
