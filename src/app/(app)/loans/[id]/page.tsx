
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaymentRegistrationDialog } from '@/components/app/payment-registration-dialog';
import { LoanPDFExportButton } from '@/components/app/loan-pdf-export-button';
import type { Loan } from '@/lib/types';

export default function LoanDetailsPage() {
  const params = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchLoan() {
      if (params.id) {
        const res = await fetch(`/api/loans/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setLoan(data);
        } else if (res.status === 404) {
          setError('Loan not found');
        } else {
          setError('Failed to load loan');
        }
      }
    }
    fetchLoan();
  }, [params.id]);


  if (error) return <div className="p-6">{error}</div>;
  if (!loan) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  const getStatusArabic = (status: 'Active' | 'Paid Off' | 'Defaulted') => {
      switch (status) {
        case 'Active': return 'نشط';
        case 'Paid Off': return 'مدفوع بالكامل';
        case 'Defaulted': return 'متعثر';
      }
  }

  const getScheduleArabic = (schedule: string) => {
    switch(schedule){
        case 'Monthly': return 'شهري';
        case 'Quarterly': return 'ربع سنوي';
        case 'Annually': return 'سنوي';
        default: return schedule;
    }
  }

  return (
    <>
      <PageHeader 
        title={`قرض ${loan.loanId}`} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/loans"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى القروض</Link>
                </Button>
import { LoanPDFExportButton } from '@/components/app/loan-pdf-export-button';
                <Button asChild>
                    <Link href={`/loans/${loan.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل القرض</Link>
                </Button>
                <LoanPDFExportButton loan={loan} cardId="loan-card" />
            </div>
        }
      />
      
      <Card id="loan-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>تفاصيل القرض</CardTitle>
              <CardDescription>لـ {loan.fisher.name}</CardDescription>
            </div>
             <Badge variant={loan.status === 'Paid Off' ? 'secondary' : loan.status === 'Defaulted' ? 'destructive' : 'default'}>
                {getStatusArabic(loan.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">المبلغ الأصلي</h3>
              <p>{loan.amount.toLocaleString()} د.م.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">تاريخ الصرف</h3>
              <p>{new Date(loan.disbursementDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">جدول السداد</h3>
              <p>{getScheduleArabic(loan.repaymentSchedule)}</p>
            </div>
             <div>
              <h3 className="text-sm font-medium text-muted-foreground">المبلغ المستحق</h3>
              <p className="text-lg font-semibold">{loan.outstandingBalance.toLocaleString()} د.م.</p>
            </div>
          </div>
           <Separator />
            <div>
                <h3 className="text-lg font-semibold mb-2">سجل السداد</h3>
                <p className="text-sm text-muted-foreground">لم يتم تسجيل أي عمليات سداد بعد.</p>
                {/* Repayment history table would go here */}
            </div>
        </CardContent>
         <CardFooter>
            <Button onClick={() => setIsPaymentDialogOpen(true)}>تسجيل سداد</Button>
        </CardFooter>
      </Card>
      <PaymentRegistrationDialog 
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        loan={loan}
      />
    </>
  );
}
