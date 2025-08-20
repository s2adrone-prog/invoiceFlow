"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Invoice } from "@/lib/types"
import { User } from "lucide-react"

interface RecentInvoicesProps {
  invoices: Invoice[]
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center">
            <Avatar className="h-9 w-9">
               <AvatarImage data-ai-hint="company logo" src={`https://avatar.vercel.sh/${invoice.customerEmail}.png`} alt="Avatar" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{invoice.customerName}</p>
              <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
            </div>
            <div className="ml-auto font-medium">+₹{invoice.total.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
