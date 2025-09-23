
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/app/page-header';
import { DollarSign, Receipt, Users, PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import type { Invoice } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function BuyPage() {
  const router = useRouter();
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [sellers, setSellers] = React.useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const resInvoices = await fetch('/api/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (resInvoices.ok) {
        const invoicesData: Invoice[] = await resInvoices.json();
        setInvoices(invoicesData.filter(inv => inv.type === 'buy'));
      } else {
        if (resInvoices.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        console.error('Failed to fetch invoices');
        console.log(resInvoices.status);
      }

      const resParties = await fetch('/api/parties');
      if (resParties.ok) {
        const partiesData: any[] = await resParties.json();
        // This is a simplification. In a real app, you'd filter parties who are sellers.
        setSellers(partiesData);
      } else {
        console.error('Failed to fetch parties');
      }
    }
    fetchData();
  }, []);

  const totalCost = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  
  const paidAmount = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleDelete = async () => {
    if (selectedInvoiceId) {
      await fetch(`/api/invoices/${selectedInvoiceId}`, { method: 'DELETE' });
      setInvoices(invoices.filter(inv => inv.id !== selectedInvoiceId));
      setShowDeleteDialog(false);
      setSelectedInvoiceId(null);
      // No need to call router.refresh() as we are managing state locally
    }
  };
  
  const openDeleteDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="لوحة تحكم الشراء"
        action={
          <Button asChild>
            <Link href="/invoices/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إنشاء فاتورة شراء
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التكلفة (شراء)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">من جميع فواتير الشراء</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدفوعات</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidAmount.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">المدفوعة للبائعين</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي البائعين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">حسابات البائعين النشطة</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>فواتير الشراء</CardTitle>
            <CardDescription>
              جميع فواتير الأسماك المشتراة من البائعين.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>البائع</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>
                    <span className="sr-only">الإجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <Link href={`/invoices/${invoice.id}`} className="hover:underline">{invoice.invoiceNumber}</Link>
                    </TableCell>
                    <TableCell>{invoice.party.name}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.totalAmount.toLocaleString()} د.م.</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'Paid' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'outline'}>
                         {invoice.status === 'Paid' ? 'مدفوعة' : invoice.status === 'Overdue' ? 'متأخرة' : 'غير مدفوعة'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">تبديل القائمة</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild><Link href={`/invoices/${invoice.id}`}>عرض التفاصيل</Link></DropdownMenuItem>
                           <DropdownMenuItem asChild><Link href={`/invoices/${invoice.id}/edit`}>تعديل</Link></DropdownMenuItem>
                          <DropdownMenuItem>وضع علامة كمدفوع</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(invoice.id)}>حذف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الفاتورة؟</AlertDialogTitle>
            <AlertDialogDescription>
               لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الفاتورة بشكل دائم.
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

    