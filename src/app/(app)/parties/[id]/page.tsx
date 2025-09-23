
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { PartyPDFExportButton } from '@/components/app/party-pdf-export-button';
import type { Party, Invoice } from '@/lib/types';
import TableFilters, { FilterValue } from '@/components/ui/table-filters';
import { useEffect, useState } from 'react';

interface PartyWithRelations extends Party {
  invoices: Invoice[];
}

export default function PartyDetailsPage() {
  const params = useParams<{ id: string }>();
    const [party, setParty] = useState<PartyWithRelations | null>(null);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
            async function fetchParty() {
                const res = await fetch(`/api/parties/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setParty(data);
                } else if (res.status === 404) {
                    setError('Party not found');
                } else {
                    setError('Failed to load party');
                }
            }
      fetchParty();
    }
  }, [params.id]);

    // Keep hooks in a stable order: declare all hooks before any early returns.
    const [filters, setFilters] = useState<FilterValue | null>(null);
    const partyInvoices: Invoice[] = party?.invoices ?? [];

    if (error) return <div className="p-6">{error}</div>;

    if (!party) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

        // Safely compute categories from invoices, guarding against missing items/fish
        const categories: string[] = Array.from(
            new Set(
                partyInvoices.flatMap((i) => (i.items ?? []).map((it) => it.fish?.category).filter(Boolean) as string[])
            )
        );

        const filteredTransactions = partyInvoices.filter((inv) => {
            if (!filters) return true;
            const q = (filters.q || "").toLowerCase();
            const from = filters.from ? new Date(filters.from) : null;
            const to = filters.to ? new Date(filters.to) : null;
            if (from && new Date(inv.date) < from) return false;
            if (to && new Date(inv.date) > to) return false;
            if (filters.category) {
                return inv.items.some((it) => it.fish.category === filters.category);
            }
            if (q) {
                return inv.invoiceNumber.toLowerCase().includes(q) || inv.items.some(it => it.fish.name.toLowerCase().includes(q));
            }
            return true;
        });
  let currentBalance = 0;
  const transactions = partyInvoices.map(inv => {
      let debit = 0;
      let credit = 0;
      
      if (inv.type === 'sell') {
          debit = inv.totalAmount;
          currentBalance += debit;
      } else { 
          credit = inv.totalAmount;
          currentBalance -= credit;
      }

      return {
          date: inv.date,
          description: `فاتورة ${inv.invoiceNumber}`,
          debit,
          credit,
          balance: currentBalance,
          id: inv.id,
      }
  });


  return (
    <>
      <PageHeader 
        title={party.name} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/parties"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى الأطراف</Link>
                </Button>
                <Button asChild>
                    <Link href={`/parties/${party.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل الطرف</Link>
                </Button>
                <PartyPDFExportButton party={party} />
            </div>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
            <Card id="party-details-card">
                <CardHeader>
                <CardTitle>معلومات الطرف</CardTitle>
                <CardDescription>تفاصيل الاتصال والشركة.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">الشركة</h3>
                        <p>{party.company}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</h3>
                        <p>{party.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">الهاتف</h3>
                        <p>{party.phone}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">العنوان</h3>
                        <p>{party.address}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card id="party-transactions-card">
                <CardHeader>
                    <CardTitle>سجل المعاملات</CardTitle>
                    <CardDescription>سجل بجميع الديون والائتمانات مع هذا الطرف.</CardDescription>
                </CardHeader>
                <CardContent>
                                        <div className="mb-4">
                                                                    <TableFilters categories={categories} onChange={(v) => setFilters(v)} />
                                                                </div>
                                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>التاريخ</TableHead>
                                <TableHead>الوصف</TableHead>
                                <TableHead className="text-left">مدين</TableHead>
                                <TableHead className="text-left">دائن</TableHead>
                                <TableHead className="text-left">الرصيد</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Link href={`/invoices/${t.id}`} className="hover:underline">
                                            {t.description}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-left">{t.debit > 0 ? t.debit.toFixed(2) : '-'} د.م.</TableCell>
                                    <TableCell className="text-left">{t.credit > 0 ? t.credit.toFixed(2) : '-'} د.م.</TableCell>
                                    <TableCell className="text-left">{t.balance.toFixed(2)} د.م.</TableCell>
                                </TableRow>
                            ))}
                             {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">لم يتم العثور على معاملات.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                     <Separator className="my-4" />
                     <div className="flex justify-end font-bold text-lg">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between">
                                <span>الرصيد النهائي</span>
                                <span>{currentBalance.toFixed(2)} د.م.</span>
                             </div>
                              <p className="text-sm text-muted-foreground text-left">
                                {currentBalance > 0 ? "الطرف مدين لك." : currentBalance < 0 ? "أنت مدين للطرف." : "تمت التسوية."}
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
