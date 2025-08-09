"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SalesChart = dynamic(() => import('@/components/dashboard/sales-chart').then(mod => mod.SalesChart), {
  ssr: false,
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-[300px]" />
      </CardContent>
    </Card>
  )
});

export function SalesChartClient({ data }: { data: { month: string; totalSales: number }[] }) {
    return <SalesChart data={data} />;
}
