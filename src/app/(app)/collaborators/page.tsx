
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
import type { Collaborator, ChargesInvoice } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface CollaboratorWithChargesInvoices extends Collaborator {
    chargesInvoices: ChargesInvoice[];
}

export default function CollaboratorsPage() {
  const router = useRouter();
  const [collaborators, setCollaborators] = React.useState<CollaboratorWithChargesInvoices[]>([]);
  const [query, setQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'name:asc' | 'name:desc' | 'balance:asc' | 'balance:desc'>('name:asc');
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const resCollaborators = await fetch('/api/collaborators?include_charges_invoices=true');
      if (resCollaborators.ok) {
        const collaboratorsData = await resCollaborators.json();
        setCollaborators(collaboratorsData);
      } else {
        console.error('Failed to fetch collaborators');
      }
    }
    fetchData();
  }, []);

  const getCollaboratorBalance = (collaborator: CollaboratorWithChargesInvoices) => {
    let balance = 0;
    collaborator.chargesInvoices.forEach(inv => {
      if (inv.status !== 'Paid') {
        balance += inv.totalAmount; 
      }
    });
    return balance;
  };

  const filteredCollaborators = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = collaborators.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
      );
    });

    // compute balances for sorting
    const withBalance = list.map((c) => ({ c, balance: getCollaboratorBalance(c) }));

    switch (sortBy) {
      case 'name:asc':
        withBalance.sort((a, b) => a.c.name.localeCompare(b.c.name));
        break;
      case 'name:desc':
        withBalance.sort((a, b) => b.c.name.localeCompare(a.c.name));
        break;
      case 'balance:asc':
        withBalance.sort((a, b) => a.balance - b.balance);
        break;
      case 'balance:desc':
        withBalance.sort((a, b) => b.balance - a.balance);
        break;
    }

    return withBalance.map(w => w.c);
  }, [collaborators, query, sortBy]);
  

  const handleDelete = async () => {
    if (selectedCollaboratorId) {
      await fetch(`/api/collaborators/${selectedCollaboratorId}`, {
        method: 'DELETE',
      });
      setCollaborators(collaborators.filter(c => c.id !== selectedCollaboratorId));
      setShowDeleteDialog(false);
      setSelectedCollaboratorId(null);
    }
  };
  
  const openDeleteDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="المتعاونون"
        action={
          <Button asChild>
            <Link href="/collaborators/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة متعاون
            </Link>
          </Button>
        }
      />
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Input placeholder="ابحث بالاسم أو البريد" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-[240px]" />
        <div className="ml-auto">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name:asc">الاسم (أ-ي)</SelectItem>
              <SelectItem value="name:desc">الاسم (ي-أ)</SelectItem>
              <SelectItem value="balance:asc">الرصيد (صاعد)</SelectItem>
              <SelectItem value="balance:desc">الرصيد (تنازلي)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCollaborators.map((collaborator) => {
           const balance = getCollaboratorBalance(collaborator);
           const balanceStatus = balance === 0 ? 'مسدد' : balance > 0 ? 'مدين لك' : 'مدين لك'; // Collaborators are always owed money or balance is 0
           const balanceColor = balance === 0 ? 'text-green-600' : 'text-blue-600';

          return (
            <Card key={collaborator.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="hover:underline">
                  <Link href={`/collaborators/${collaborator.id}`}>{collaborator.name}</Link>
                </CardTitle>
                <CardDescription>{collaborator.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{collaborator.phone}</p>
                 <div className="mt-4">
                    <p className="text-sm font-medium">حالة الرصيد</p>
                    <p className={`text-lg font-bold ${balanceColor}`}>
                      {Math.abs(balance).toLocaleString()} د.م. <span className="text-sm font-normal">({balanceStatus})</span>
                    </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/collaborators/${collaborator.id}`}>عرض التفاصيل</Link>
                 </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href={`/collaborators/${collaborator.id}/edit`}><Edit className="h-4 w-4" /></Link>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(collaborator.id)}>
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
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المتعاون؟</AlertDialogTitle>
            <AlertDialogDescription>
             لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المتعاون وجميع البيانات المرتبطة به بشكل دائم.
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

    