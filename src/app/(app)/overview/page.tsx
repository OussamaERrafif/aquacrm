'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateFinancialOverview } from '@/ai/flows/generate-financial-overview';
import { invoices, loans } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';
import { Loader2 } from 'lucide-react';

export default function OverviewPage() {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState('');

  const handleGenerateOverview = async () => {
    setLoading(true);
    setOverview('');
    try {
      const result = await generateFinancialOverview({
        transactionsData: JSON.stringify(invoices),
        loansData: JSON.stringify(loans),
      });
      setOverview(result.financialOverview);
    } catch (error) {
      console.error('Failed to generate overview:', error);
      setOverview('An error occurred while generating the financial overview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="AI Financial Overview" />
      <Card>
        <CardHeader>
          <CardTitle>Generate Financial Summary</CardTitle>
          <CardDescription>
            Use AI to analyze all transactions and loans, generating a concise financial overview with key insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateOverview} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Overview
          </Button>
          {loading && (
             <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin"/>
                <span>Analyzing data... This may take a moment.</span>
            </div>
          )}
          {overview && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Generated Overview:</h3>
              <div className="p-4 border rounded-md bg-muted/50 whitespace-pre-wrap">
                {overview}
              </div>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Note: The AI analysis is based on the mock data loaded in the application.</p>
        </CardFooter>
      </Card>
    </>
  );
}
