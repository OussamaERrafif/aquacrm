
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { ChargesInvoicePDFExportButton } from '@/components/app/charges-invoice-pdf-export-button'; // Will create this component
import type { ChargesInvoice } from '@/lib/types';

export default function ChargesInvoiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [chargesInvoice, setChargesInvoice] = useState<ChargesInvoice | null>(null);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
        async function fetchChargesInvoice() {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`/api/chargesinvoices/${params.id}?include_collaborator=true&include_charges=true`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (res.ok) {
                const data = await res.json();
                setChargesInvoice(data);
            } else if (res.status === 401) {
                // token missing/invalid/expired
                if (typeof window !== 'undefined') localStorage.removeItem('token');
                router.push('/login');
            } else if (res.status === 404) {
                setError('Charges Invoice not found');
            } else {
                setError('Failed to load charges invoice');
            }
        }
        fetchChargesInvoice();
    }
  }, [params.id]);

    if (error) {
        return <div className="p-6">{error}</div>;
    }

    if (!chargesInvoice) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
  
  const statusArabic = chargesInvoice.status === 'Paid' ? 'مدفوعة' : 'غير مدفوعة';

  return (
    <>
      <PageHeader 
        title={`فاتورة مصاريف ${chargesInvoice.invoiceNumber}`} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/chargesinvoices"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى القائمة</Link>
                </Button>
    <Button asChild>
        <Link href={`/chargesinvoices/${chargesInvoice.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل</Link>
    </Button>
    <ChargesInvoicePDFExportButton chargesInvoice={chargesInvoice} cardId="charges-invoice-card" />
</div>
        }
      />
      
      <Card id="charges-invoice-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AquaTrade CRM</h1>
              <p className="text-muted-foreground">123 Fishery Road, Ocean City, 12345</p>
            </div>
            <div className="text-left">
                <h2 className="text-xl font-semibold">فاتورة مصاريف {chargesInvoice.invoiceNumber}</h2>
                <Badge variant={chargesInvoice.status === 'Paid' ? 'secondary' : 'outline'}>
                    {statusArabic}
                </Badge>
            </div>
          </div>
           <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1">المتعاون</h3>
                    <p className="text-sm text-muted-foreground">
                        {chargesInvoice.collaborator.name}<br/>
                        {chargesInvoice.collaborator.address}<br/>
                        {chargesInvoice.collaborator.email}
                    </p>
                </div>
                <div className="text-left">
                    <h3 className="font-semibold mb-1">تاريخ الفاتورة</h3>
                    <p className="text-sm text-muted-foreground">{new Date(chargesInvoice.date).toLocaleDateString()}</p>
                </div>
           </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>البند</TableHead>
                        <TableHead className="text-left">السعر</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {chargesInvoice.charges.map(charge => (
                        <TableRow key={charge.id}>
                            <TableCell className="font-medium">{charge.title}</TableCell>
                            <TableCell className="text-left">{charge.price.toFixed(2)} د.م.</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Separator className="my-4" />
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-left">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>الإجمالي</span>
                        <span>{chargesInvoice.totalAmount.toFixed(2)} د.م.</span>
                    </div>
                </div>
             </div>
        </CardContent>
         <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">شكراً لتعاملكم معنا!</p>
        </CardFooter>
      </Card>
    </>
  );
}
