
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { loans } from '@/lib/data';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function LoanDetailsPage({ params }: { params: { id: string } }) {
  const loan = loans.find((l) => l.id === params.id);

  if (!loan) {
    notFound();
  }

  return (
    <>
      <PageHeader 
        title={`Loan ${loan.loanId}`} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/loans"><ArrowLeft className="mr-2 h-4 w-4" />Back to Loans</Link>
                </Button>
                <Button asChild>
                    <Link href={`/loans/${loan.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit Loan</Link>
                </Button>
            </div>
        }
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>For {loan.fisher.name}</CardDescription>
            </div>
             <Badge variant={loan.status === 'Paid Off' ? 'secondary' : loan.status === 'Defaulted' ? 'destructive' : 'default'}>
                {loan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Principal Amount</h3>
              <p>${loan.amount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Disbursement Date</h3>
              <p>{loan.disbursementDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Repayment Schedule</h3>
              <p>{loan.repaymentSchedule}</p>
            </div>
             <div>
              <h3 className="text-sm font-medium text-muted-foreground">Outstanding Balance</h3>
              <p className="text-lg font-semibold">${loan.outstandingBalance.toLocaleString()}</p>
            </div>
          </div>
           <Separator />
            <div>
                <h3 className="text-lg font-semibold mb-2">Repayment History</h3>
                <p className="text-sm text-muted-foreground">No repayments recorded yet.</p>
                {/* Repayment history table would go here */}
            </div>
        </CardContent>
         <CardFooter>
            <Button>Record Repayment</Button>
        </CardFooter>
      </Card>
    </>
  );
}
