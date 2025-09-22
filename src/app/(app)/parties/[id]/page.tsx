
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parties, invoices } from '@/lib/data';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function PartyDetailsPage({ params }: { params: { id: string } }) {
  const party = parties.find((p) => p.id === params.id);

  if (!party) {
    notFound();
  }

  const partyInvoices = invoices.filter(inv => inv.party.id === party.id);
  
  let currentBalance = 0;
  const transactions = partyInvoices.map(inv => {
      let debit = 0;
      let credit = 0;
      
      if (inv.type === 'sell') { // We sold to them, they owe us. It's a debit from their perspective on our books.
          debit = inv.totalAmount;
          currentBalance += debit;
      } else { // We bought from them, we owe them. It's a credit.
          credit = inv.totalAmount;
          currentBalance -= credit;
      }

      return {
          date: inv.date,
          description: `Invoice ${inv.invoiceNumber}`,
          debit,
          credit,
          balance: currentBalance
      }
  });


  return (
    <>
      <PageHeader 
        title={party.name} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/parties"><ArrowLeft className="mr-2 h-4 w-4" />Back to Parties</Link>
                </Button>
                <Button asChild>
                    <Link href={`/parties/${party.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit Party</Link>
                </Button>
            </div>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Party Information</CardTitle>
                <CardDescription>Contact and company details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                        <p>{party.company}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{party.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                        <p>{party.phone}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                        <p>{party.address}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A record of all debits and credits with this party.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t, i) => (
                                <TableRow key={i}>
                                    <TableCell>{t.date}</TableCell>
                                    <TableCell>{t.description}</TableCell>
                                    <TableCell className="text-right">${t.debit > 0 ? t.debit.toFixed(2) : '-'}</TableCell>
                                    <TableCell className="text-right">${t.credit > 0 ? t.credit.toFixed(2) : '-'}</TableCell>
                                    <TableCell className="text-right">${t.balance.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No transactions found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                     <Separator className="my-4" />
                     <div className="flex justify-end font-bold text-lg">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between">
                                <span>Final Balance</span>
                                <span>${currentBalance.toFixed(2)}</span>
                             </div>
                              <p className="text-sm text-muted-foreground text-right">
                                {currentBalance > 0 ? "Party owes you." : currentBalance < 0 ? "You owe the party." : "All settled."}
                            </p>
                        </div>
                     </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
