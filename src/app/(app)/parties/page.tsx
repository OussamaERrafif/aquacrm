
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
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
import type { Party, Invoice } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface PartyWithInvoices extends Party {
    invoices: Invoice[];
}

export default function PartiesPage() {
  const router = useRouter();
  const [parties, setParties] = React.useState<PartyWithInvoices[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedPartyId, setSelectedPartyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const resParties = await fetch('/api/parties?include_invoices=true');
      if (resParties.ok) {
        const partiesData = await resParties.json();
        setParties(partiesData);
      } else {
        console.error('Failed to fetch parties');
      }
    }
    fetchData();
  }, []);

  const getPartyBalance = (party: PartyWithInvoices) => {
    let balance = 0;
    party.invoices.forEach(inv => {
      if (inv.status !== 'Paid') {
        if (inv.type === 'sell') {
          balance -= inv.totalAmount; 
        } else {
          balance += inv.totalAmount; 
        }
      }
    });
    return balance;
  };

  const handleDelete = async () => {
    if (selectedPartyId) {
      await fetch(`/api/parties/${selectedPartyId}`, {
        method: 'DELETE',
      });
      setParties(parties.filter(p => p.id !== selectedPartyId));
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
        title="الأطراف"
        action={
          <Button asChild>
            <Link href="/parties/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة طرف
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {parties.map((party) => {
           const balance = getPartyBalance(party);
           const balanceStatus = balance === 0 ? 'مسدد' : balance > 0 ? 'أنت مدين' : 'مدين لك';
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
                    <p className="text-sm font-medium">حالة الرصيد</p>
                    <p className={`text-lg font-bold ${balanceColor}`}>
                      {Math.abs(balance).toLocaleString()} د.م. <span className="text-sm font-normal">({balanceStatus})</span>
                    </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/parties/${party.id}`}>عرض التفاصيل</Link>
                 </Button>
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
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الطرف؟</AlertDialogTitle>
            <AlertDialogDescription>
             لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الطرف وجميع البيانات المرتبطة به بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    