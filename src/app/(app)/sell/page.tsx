
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
import { invoices, buyers } from '@/lib/data';
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


export default function SellPage() {
  const sellInvoices = invoices.filter((inv) => inv.type === 'sell');
  const totalRevenue = sellInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingAmount = sellInvoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string | null>(null);

  const handleDelete = () => {
    if (selectedInvoiceId) {
      console.log(`Deleting invoice with id: ${selectedInvoiceId}`);
      setShowDeleteDialog(false);
      setSelectedInvoiceId(null);
    }
  };
  
  const openDeleteDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="لوحة تحكم البيع"
        action={
          <Button asChild>
            <Link href="/invoices/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إنشاء فاتورة بيع
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات (بيع)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">من الفواتير المدفوعة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المبلغ المعلق</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAmount.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">من الفواتير غير المدفوعة والمتأخرة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشترين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyers.length}</div>
            <p className="text-xs text-muted-foreground">حسابات المشترين النشطة</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>فواتير البيع</CardTitle>
            <CardDescription>
              جميع فواتير الأسماك المباعة للمشترين.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>المشتري</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>
                    <span className="sr-only">الإجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <Link href={`/invoices/${invoice.id}`} className="hover:underline">{invoice.invoiceNumber}</Link>
                    </TableCell>
                    <TableCell>{invoice.party.name}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
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
