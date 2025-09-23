
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
import { InvoicePDFExportButton } from '@/components/app/invoice-pdf-export-button';
import type { Invoice } from '@/lib/types';

export default function InvoiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
        async function fetchInvoice() {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`/api/invoices/${params.id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (res.ok) {
                const data = await res.json();
                setInvoice(data);
            } else if (res.status === 401) {
                // token missing/invalid/expired
                if (typeof window !== 'undefined') localStorage.removeItem('token');
                router.push('/login');
            } else if (res.status === 404) {
                setError('Invoice not found');
            } else {
                setError('Failed to load invoice');
            }
        }
        fetchInvoice();
    }
  }, [params.id]);

    if (error) {
        return <div className="p-6">{error}</div>;
    }

    if (!invoice) {
        return <div>Loading...</div>; // Or a skeleton loader
    }
  
  const backUrl = invoice.type === 'buy' ? '/buy' : '/sell';
  const statusArabic = invoice.status === 'Paid' ? 'مدفوعة' : invoice.status === 'Overdue' ? 'متأخرة' : 'غير مدفوعة';


  return (
    <>
      <PageHeader 
        title={`فاتورة ${invoice.invoiceNumber}`} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href={backUrl}><ArrowRight className="ml-2 h-4 w-4" />العودة إلى القائمة</Link>
                </Button>
    <Button asChild>
        <Link href={`/invoices/${invoice.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل</Link>
    </Button>
    <InvoicePDFExportButton invoice={invoice} cardId="invoice-card" />
</div>
        }
      />
      
      <Card id="invoice-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AquaTrade CRM</h1>
              <p className="text-muted-foreground">123 Fishery Road, Ocean City, 12345</p>
            </div>
            <div className="text-right md:text-left">
                <h2 className="text-xl font-semibold">فاتورة {invoice.invoiceNumber}</h2>
                <Badge variant={invoice.status === 'Paid' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'outline'}>
                    {statusArabic}
                </Badge>
            </div>
          </div>
           <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1">فاتورة إلى</h3>
                    <p className="text-sm text-muted-foreground">
                        {invoice.party.name}<br/>
                        {invoice.party.company}<br/>
                        {invoice.party.address}<br/>
                        {invoice.party.email}
                    </p>
                </div>
                <div className="text-left">
                    <h3 className="font-semibold mb-1">تاريخ الفاتورة</h3>
                    <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                    <h3 className="font-semibold mb-1 mt-2">تاريخ الاستحقاق</h3>
                    <p className="text-sm text-muted-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
           </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>البند</TableHead>
                        <TableHead className="text-center">الطول</TableHead>
                        <TableHead className="text-center">الوزن (كغ)</TableHead>
                        <TableHead className="text-left">السعر/كغ</TableHead>
                        <TableHead className="text-left">الإجمالي</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoice.items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.fish.name} ({item.fish.category})</TableCell>
                            <TableCell className="text-center uppercase">{item.length}</TableCell>
                            <TableCell className="text-center">{item.weight}</TableCell>
                            <TableCell className="text-left">{item.pricePerKilo.toFixed(2)} د.م.</TableCell>
                            <TableCell className="text-left">{(item.weight * item.pricePerKilo).toFixed(2)} د.م.</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Separator className="my-4" />
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-left">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{invoice.totalAmount.toFixed(2)} د.م.</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">الضريبة (0%)</span>
                        <span>0.00 د.م.</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>الإجمالي</span>
                        <span>{invoice.totalAmount.toFixed(2)} د.م.</span>
                    </div>
                </div>
             </div>
        </CardContent>
         <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">شكراً لتعاملكم معنا!</p>
            {invoice.status !== 'Paid' && <Button>وضع علامة كمدفوع</Button>}
        </CardFooter>
      </Card>
    </>
  );
}
