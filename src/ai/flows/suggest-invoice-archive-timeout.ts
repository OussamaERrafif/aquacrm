'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal archive timeouts for invoice data using AI.
 *
 * - suggestInvoiceArchiveTimeout - A function that suggests an archive timeout for invoice data.
 * - SuggestInvoiceArchiveTimeoutInput - The input type for the suggestInvoiceArchiveTimeout function.
 * - SuggestInvoiceArchiveTimeoutOutput - The return type for the suggestInvoiceArchiveTimeout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInvoiceArchiveTimeoutInputSchema = z.object({
  invoiceDataSummary: z
    .string()
    .describe('A summary of the invoice data, including date, customer, and total amount.'),
  companyDataRetentionPolicy: z
    .string()
    .describe('The company data retention policy as a string.'),
  legalRequirements: z
    .string()
    .optional()
    .describe('Any relevant legal requirements for data retention.'),
});
export type SuggestInvoiceArchiveTimeoutInput = z.infer<typeof SuggestInvoiceArchiveTimeoutInputSchema>;

const SuggestInvoiceArchiveTimeoutOutputSchema = z.object({
  suggestedTimeout: z
    .string()
    .describe('The suggested archive timeout duration (e.g., 1 year, 5 years).'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggested timeout, considering the invoice data, company policy, and legal requirements.'),
});
export type SuggestInvoiceArchiveTimeoutOutput = z.infer<typeof SuggestInvoiceArchiveTimeoutOutputSchema>;

export async function suggestInvoiceArchiveTimeout(input: SuggestInvoiceArchiveTimeoutInput): Promise<SuggestInvoiceArchiveTimeoutOutput> {
  return suggestInvoiceArchiveTimeoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInvoiceArchiveTimeoutPrompt',
  input: {schema: SuggestInvoiceArchiveTimeoutInputSchema},
  output: {schema: SuggestInvoiceArchiveTimeoutOutputSchema},
  prompt: `You are an AI assistant designed to suggest optimal archive timeouts for invoice data.

  Consider the following information when determining the appropriate timeout:

  Invoice Data Summary: {{{invoiceDataSummary}}}
  Company Data Retention Policy: {{{companyDataRetentionPolicy}}}
  Legal Requirements (if any): {{{legalRequirements}}}

  Based on this information, suggest an archive timeout duration and explain your reasoning.
  Format your response as:

  Suggested Timeout: [timeout duration]
  Reasoning: [explanation]`,
});

const suggestInvoiceArchiveTimeoutFlow = ai.defineFlow(
  {
    name: 'suggestInvoiceArchiveTimeoutFlow',
    inputSchema: SuggestInvoiceArchiveTimeoutInputSchema,
    outputSchema: SuggestInvoiceArchiveTimeoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
