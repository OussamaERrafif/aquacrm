
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parties, invoices } from '@/lib/data';
import { ArrowRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function PartyDetailsPage() {
  const params = useParams<{ id: string }>();
  const party = parties.find((p) => p.id === params.id);

  if (!party) {
    notFound();
  }

  const partyInvoices = invoices.filter(inv => inv.party.id === party.id);
  
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
                    <Link href="/parties"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى الأطراف</Link>
                </Button>
                <Button asChild>
                    <Link href={`/parties/${party.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل الطرف</Link>
                </Button>
            </div>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
            <Card>
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
            <Card>
                <CardHeader>
                    <CardTitle>سجل المعاملات</CardTitle>
                    <CardDescription>سجل بجميع الديون والائتمانات مع هذا الطرف.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {transactions.map((t, i) => (
                                <TableRow key={i}>
                                    <TableCell>{t.date}</TableCell>
                                    <TableCell>{t.description}</TableCell>
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

    
