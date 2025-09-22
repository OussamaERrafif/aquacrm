'use server';

/**
 * @fileOverview Generates a summarized financial overview of transactions and outstanding loans using AI.
 *
 * - generateFinancialOverview - A function that generates the financial overview.
 * - GenerateFinancialOverviewInput - The input type for the generateFinancialOverview function.
 * - GenerateFinancialOverviewOutput - The return type for the generateFinancialOverview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialOverviewInputSchema = z.object({
  transactionsData: z
    .string()
    .describe("A stringified JSON array containing transaction data. Each object should have fields like 'date', 'type' ('buy' or 'sell'), 'amount', and 'description'."),
  loansData: z
    .string()
    .describe("A stringified JSON array containing loans data. Each object should have fields like 'borrower', 'amount', 'interestRate', 'disbursementDate', 'repaymentSchedule', and 'outstandingBalance'."),
});
export type GenerateFinancialOverviewInput = z.infer<typeof GenerateFinancialOverviewInputSchema>;

const GenerateFinancialOverviewOutputSchema = z.object({
  financialOverview: z
    .string()
    .describe('A summarized financial overview of transactions and outstanding loans, including key insights and recommendations.'),
});
export type GenerateFinancialOverviewOutput = z.infer<typeof GenerateFinancialOverviewOutputSchema>;

export async function generateFinancialOverview(
  input: GenerateFinancialOverviewInput
): Promise<GenerateFinancialOverviewOutput> {
  return generateFinancialOverviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialOverviewPrompt',
  input: {schema: GenerateFinancialOverviewInputSchema},
  output: {schema: GenerateFinancialOverviewOutputSchema},
  prompt: `You are an expert financial analyst specializing in providing concise financial overviews.

You will receive transaction data and loans data in JSON format.
Your goal is to analyze this data and generate a summarized financial overview that includes key insights and recommendations.
Focus on identifying trends, outstanding balances, potential risks, and opportunities for improvement.

Transaction Data: {{{transactionsData}}}
Loans Data: {{{loansData}}}

Please provide a clear and actionable financial overview based on the provided data.`,
});

const generateFinancialOverviewFlow = ai.defineFlow(
  {
    name: 'generateFinancialOverviewFlow',
    inputSchema: GenerateFinancialOverviewInputSchema,
    outputSchema: GenerateFinancialOverviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
