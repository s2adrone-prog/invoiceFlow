
"use client";

import { useEffect, useState } from 'react';
import { CreditCard, IndianRupee, Package, Loader2 } from 'lucide-react';

import { getInvoices } from '@/lib/data';
import type { Invoice } from '@/lib/types';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { useAuth } from '@/components/auth-provider';


export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if(user) {
        const data = await getInvoices();
        setInvoices(data);
        setIsLoading(false);
      } else {
        // If no user, might still want to load something or handle the state
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const totalSales = invoices.reduce((acc, invoice) => acc + invoice.total, 0);
  const outstandingPayments = invoices
    .filter((invoice) => invoice.status === 'Pending' || invoice.status === 'Overdue')
    .reduce((acc, invoice) => acc + invoice.total, 0);
  const totalInvoices = invoices.length;
  
  const salesData = invoices.reduce((acc, invoice) => {
    const month = new Date(invoice.invoiceDate).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    if(existingMonth) {
      existingMonth.totalSales += invoice.total;
    } else {
      acc.push({ month, totalSales: invoice.total });
    }
    return acc;
  }, [] as { month: string; totalSales: number }[]).reverse();


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2})}`}
          icon={IndianRupee}
        />
        <StatCard
          title="Outstanding Payments"
          value={`₹${outstandingPayments.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2})}`}
          icon={CreditCard}
        />
        <StatCard
          title="Total Invoices"
          value={totalInvoices.toString()}
          icon={Package}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SalesChart data={salesData} />
        </div>
        <div className="lg:col-span-2">
          <RecentInvoices invoices={invoices.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
