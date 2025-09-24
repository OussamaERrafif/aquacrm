
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
import type { ChargesInvoice, Collaborator, Charge } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ChargesInvoiceWithRelations extends ChargesInvoice {
    collaborator: Collaborator;
    charges: Charge[];
}

export default function ChargesInvoicesPage() {
  const router = useRouter();
  const [chargesInvoices, setChargesInvoices] = React.useState<ChargesInvoiceWithRelations[]>([]);
  const [query, setQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'invoiceNumber:asc' | 'invoiceNumber:desc' | 'totalAmount:asc' | 'totalAmount:desc'>('invoiceNumber:asc');
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedChargesInvoiceId, setSelectedChargesInvoiceId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const resChargesInvoices = await fetch('/api/chargesinvoices?include_collaborator=true&include_charges=true');
      if (resChargesInvoices.ok) {
        const chargesInvoicesData = await resChargesInvoices.json();
        setChargesInvoices(chargesInvoicesData);
      } else {
        console.error('Failed to fetch charges invoices');
      }
    }
    fetchData();
  }, []);

  const filteredChargesInvoices = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = chargesInvoices.filter((ci) => {
      if (!q) return true;
      return (
        ci.invoiceNumber.toLowerCase().includes(q) ||
        (ci.collaborator?.name || "").toLowerCase().includes(q)
      );
    });

    switch (sortBy) {
      case 'invoiceNumber:asc':
        list.sort((a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber));
        break;
      case 'invoiceNumber:desc':
        list.sort((a, b) => b.invoiceNumber.localeCompare(a.invoiceNumber));
        break;
      case 'totalAmount:asc':
        list.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case 'totalAmount:desc':
        list.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
    }

    return list;
  }, [chargesInvoices, query, sortBy]);
  

  const handleDelete = async () => {
    if (selectedChargesInvoiceId) {
      await fetch(`/api/chargesinvoices/${selectedChargesInvoiceId}`, {
        method: 'DELETE',
      });
      setChargesInvoices(chargesInvoices.filter(ci => ci.id !== selectedChargesInvoiceId));
      setShowDeleteDialog(false);
      setSelectedChargesInvoiceId(null);
    }
  };
  
  const openDeleteDialog = (chargesInvoiceId: string) => {
    setSelectedChargesInvoiceId(chargesInvoiceId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="فواتير المصاريف"
        action={
          <Button asChild>
            <Link href="/chargesinvoices/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة فاتورة مصاريف
            </Link>
          </Button>
        }
      />
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Input placeholder="ابحث برقم الفاتورة أو اسم المتعاون" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-[240px]" />
        <div className="ml-auto">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoiceNumber:asc">رقم الفاتورة (صاعد)</SelectItem>
              <SelectItem value="invoiceNumber:desc">رقم الفاتورة (تنازلي)</SelectItem>
              <SelectItem value="totalAmount:asc">المبلغ الإجمالي (صاعد)</SelectItem>
              <SelectItem value="totalAmount:desc">المبلغ الإجمالي (تنازلي)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredChargesInvoices.map((chargesInvoice) => {
          return (
            <Card key={chargesInvoice.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="hover:underline">
                  <Link href={`/chargesinvoices/${chargesInvoice.id}`}>{chargesInvoice.invoiceNumber}</Link>
                </CardTitle>
                <CardDescription>{chargesInvoice.collaborator?.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">المبلغ الإجمالي: {chargesInvoice.totalAmount.toLocaleString()} د.م.</p>
                <p className="text-sm text-muted-foreground">الحالة: {chargesInvoice.status}</p>
                <p className="text-sm text-muted-foreground">التاريخ: {new Date(chargesInvoice.date).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/chargesinvoices/${chargesInvoice.id}`}>عرض التفاصيل</Link>
                 </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href={`/chargesinvoices/${chargesInvoice.id}/edit`}><Edit className="h-4 w-4" /></Link>
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(chargesInvoice.id)}>
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
            <AlertDialogTitle>هل أنت متأكد من حذف فاتورة المصاريف هذه؟</AlertDialogTitle>
            <AlertDialogDescription>
             لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف فاتورة المصاريف وجميع البيانات المرتبطة بها بشكل دائم.
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
