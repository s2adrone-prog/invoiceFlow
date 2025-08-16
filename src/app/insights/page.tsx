
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { analyzeInvoiceData, type AnalyzeInvoiceDataOutput } from '@/ai/flows/invoice-analyzer';
import { getInvoices } from '@/lib/data';
import { Lightbulb, Loader2, BarChart, Users, DollarSign } from 'lucide-react';

export default function InsightsPage() {
  const [invoiceData, setInvoiceData] = useState('');
  const [insights, setInsights] = useState<AnalyzeInvoiceDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!invoiceData.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste some invoice data to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setInsights(null);
    try {
      const result = await analyzeInvoiceData({ invoiceData });
      setInsights(result);
    } catch (error) {
      console.error('Failed to analyze invoice data:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not get insights. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSampleData = async () => {
    const sampleInvoices = await getInvoices();
    setInvoiceData(JSON.stringify(sampleInvoices, null, 2));
    toast({
      title: "Sample Data Loaded",
      description: "Sample invoice data has been loaded into the text area.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            <span>Generate Business Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Paste your invoice data (e.g., in JSON or CSV format) into the text area below to get AI-powered insights.
          </p>
          <Textarea
            placeholder="Paste your invoice data here..."
            value={invoiceData}
            onChange={(e) => setInvoiceData(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Data'
              )}
            </Button>
            <Button variant="outline" onClick={handleLoadSampleData}>
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {insights && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {insights.salesTrends}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Customer Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {insights.customerBehavior}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {insights.revenueOpportunities}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
