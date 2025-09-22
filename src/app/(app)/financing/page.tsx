import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function FinancingPage() {
  return (
    <>
      <PageHeader title="Financing" />
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Financing & Credit Management</CardTitle>
          <CardDescription>
            Financing options, credit limits, and terms are managed within individual buyer and seller profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please navigate to the <Link href="/buyers" className="text-primary underline">Buyers</Link> or <Link href="/sellers" className="text-primary underline">Sellers</Link> sections to view or edit financing details.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
