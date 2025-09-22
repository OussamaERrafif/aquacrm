
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/app/page-header';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PaymentRegistrationDialog } from '@/components/app/payment-registration-dialog';
import type { Loan } from '@/lib/types';
import { useRouter } from 'next/navigation';


export default function LoansPage() {
  const router = useRouter();
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchLoans() {
      const res = await fetch('/api/loans');
      const data = await res.json();
      setLoans(data);
    }
    fetchLoans();
  }, []);

  const handleDelete = async () => {
    if (selectedLoan) {
      await fetch(`/api/loans/${selectedLoan.id}`, { method: 'DELETE' });
      setLoans(loans.filter(l => l.id !== selectedLoan.id));
      setShowDeleteDialog(false);
      setSelectedLoan(null);
    }
  };
  
  const openDeleteDialog = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDeleteDialog(true);
  }

  const openPaymentDialog = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsPaymentDialogOpen(true);
  };

  const getStatusArabic = (status: 'Active' | 'Paid Off' | 'Defaulted') => {
      switch (status) {
        case 'Active': return 'نشط';
        case 'Paid Off': return 'مدفوع بالكامل';
        case 'Defaulted': return 'متعثر';
      }
  }

  return (
    <>
      <PageHeader
        title="القروض"
        action={
          <Button asChild>
            <Link href="/loans/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة قرض
            </Link>          
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>إدارة القروض</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>معرف القرض</TableHead>
                <TableHead>الصياد</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>المبلغ المستحق</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>
                  <span className="sr-only">الإجراءات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">
                     <Link href={`/loans/${loan.id}`} className="hover:underline">{loan.loanId}</Link>
                  </TableCell>
                  <TableCell>{loan.fisher.name}</TableCell>
                  <TableCell>{loan.amount.toLocaleString()} د.م.</TableCell>
                  <TableCell>{loan.outstandingBalance.toLocaleString()} د.م.</TableCell>
                  <TableCell>
                    <Badge variant={loan.status === 'Paid Off' ? 'secondary' : loan.status === 'Defaulted' ? 'destructive' : 'default'}>
                      {getStatusArabic(loan.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">تبديل القائمة</span>
                        </Button>                      
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/loans/${loan.id}`}>عرض التفاصيل</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href={`/loans/${loan.id}/edit`}>تعديل</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openPaymentDialog(loan)}>تسجيل سداد</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(loan)}>
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا القرض؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف سجل القرض بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <PaymentRegistrationDialog 
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        loan={selectedLoan}
      />
    </>
  );
}

    