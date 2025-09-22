
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
import { loans } from '@/lib/data';
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


export default function LoansPage() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedLoanId, setSelectedLoanId] = React.useState<string | null>(null);

  const handleDelete = () => {
    if (selectedLoanId) {
      console.log(`Deleting loan with id: ${selectedLoanId}`);
      setShowDeleteDialog(false);
      setSelectedLoanId(null);
    }
  };
  
  const openDeleteDialog = (loanId: string) => {
    setSelectedLoanId(loanId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="Loans"
        action={
          <Link href="/loans/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Loan
            </Button>
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Fisher</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                  <TableCell>${loan.amount.toLocaleString()}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>${loan.outstandingBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={loan.status === 'Paid Off' ? 'secondary' : loan.status === 'Defaulted' ? 'destructive' : 'default'}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/loans/${loan.id}`} legacyBehavior passHref><DropdownMenuItem>View Details</DropdownMenuItem></Link>
                        <Link href={`/loans/${loan.id}/edit`} legacyBehavior passHref><DropdownMenuItem>Edit</DropdownMenuItem></Link>
                        <DropdownMenuItem>Record Repayment</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(loan.id)}>
                          Delete
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the loan record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
