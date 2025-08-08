'use server';

/**
 * @fileOverview An invoice data analysis AI agent.
 *
 * - analyzeInvoiceData - A function that handles the invoice data analysis process.
 * - AnalyzeInvoiceDataInput - The input type for the analyzeInvoiceData function.
 * - AnalyzeInvoiceDataOutput - The return type for the analyzeInvoiceData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInvoiceDataInputSchema = z.object({
  invoiceData: z
    .string()
    .describe(
      'A string containing invoice data, such as in CSV or JSON format.'
    ),
});
export type AnalyzeInvoiceDataInput = z.infer<typeof AnalyzeInvoiceDataInputSchema>;

const AnalyzeInvoiceDataOutputSchema = z.object({
  salesTrends: z.string().describe('Identified sales trends from the invoice data.'),
  customerBehavior: z
    .string()
    .describe('Analysis of customer behavior based on the invoice data.'),
  revenueOpportunities: z
    .string()
    .describe('Potential revenue opportunities identified from the data.'),
});
export type AnalyzeInvoiceDataOutput = z.infer<typeof AnalyzeInvoiceDataOutputSchema>;

export async function analyzeInvoiceData(input: AnalyzeInvoiceDataInput): Promise<AnalyzeInvoiceDataOutput> {
  return analyzeInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInvoiceDataPrompt',
  input: {schema: AnalyzeInvoiceDataInputSchema},
  output: {schema: AnalyzeInvoiceDataOutputSchema},
  prompt: `You are an expert business analyst specializing in invoice data analysis.

You will analyze the provided invoice data to identify sales trends, customer behavior, and potential revenue opportunities.

Invoice Data: {{{invoiceData}}}

Based on this data, identify:

*   Sales Trends: Describe any notable patterns or trends in sales.
*   Customer Behavior: Analyze customer purchasing habits and preferences.
*   Revenue Opportunities: Suggest potential areas for revenue growth.
`,
});

const analyzeInvoiceDataFlow = ai.defineFlow(
  {
    name: 'analyzeInvoiceDataFlow',
    inputSchema: AnalyzeInvoiceDataInputSchema,
    outputSchema: AnalyzeInvoiceDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
