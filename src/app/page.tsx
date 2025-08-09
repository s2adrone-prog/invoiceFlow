import { CreditCard, DollarSign, Package } from 'lucide-react';

import { getInvoices } from '@/lib/data';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { SalesChartClient } from '@/components/dashboard/sales-chart-client';


export default async function DashboardPage() {
  const invoices = await getInvoices();

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
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Outstanding Payments"
          value={`$${outstandingPayments.toLocaleString()}`}
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
          <SalesChartClient data={salesData} />
        </div>
        <div className="lg:col-span-2">
          <RecentInvoices invoices={invoices.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
