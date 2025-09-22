
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { parties, invoices } from '@/lib/data';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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

export default function PartiesPage() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedPartyId, setSelectedPartyId] = React.useState<string | null>(null);

  const getPartyBalance = (partyId: string) => {
    const partyInvoices = invoices.filter(inv => inv.party.id === partyId);
    let balance = 0;
    partyInvoices.forEach(inv => {
      if (inv.status !== 'Paid') {
        if (inv.type === 'sell') {
          balance -= inv.totalAmount; // We are owed (credit for us)
        } else {
          balance += inv.totalAmount; // We owe (debit for us)
        }
      }
    });
    return balance;
  };

  const handleDelete = () => {
    if (selectedPartyId) {
      console.log(`Deleting party with id: ${selectedPartyId}`);
      // Here you would typically call an API to delete the party
      setShowDeleteDialog(false);
      setSelectedPartyId(null);
    }
  };
  
  const openDeleteDialog = (partyId: string) => {
    setSelectedPartyId(partyId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="Parties"
        action={
          <Button asChild>
            <Link href="/parties/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Party
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {parties.map((party) => {
           const balance = getPartyBalance(party.id);
           const balanceStatus = balance === 0 ? 'Settled' : balance > 0 ? 'You Owe' : 'Owes You';
           const balanceColor = balance === 0 ? 'text-green-600' : balance > 0 ? 'text-red-600' : 'text-blue-600';

          return (
            <Card key={party.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="hover:underline">
                  <Link href={`/parties/${party.id}`}>{party.name}</Link>
                </CardTitle>
                <CardDescription>{party.company}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{party.email}</p>
                <p className="text-sm text-muted-foreground">{party.phone}</p>
                 <div className="mt-4">
                    <p className="text-sm font-medium">Balance Status</p>
                    <p className={`text-lg font-bold ${balanceColor}`}>
                      ${Math.abs(balance).toLocaleString()} <span className="text-sm font-normal">({balanceStatus})</span>
                    </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href={`/parties/${party.id}/edit`}><Edit className="h-4 w-4" /></Link>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(party.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                 </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this party?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the party and all associated data.
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
