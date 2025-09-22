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
import { DashboardChart } from '@/components/app/dashboard-chart';
import { invoices, loans } from '@/lib/data';
import { ArrowUpRight, DollarSign, Landmark, Receipt } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const totalRevenue = invoices
    .filter((inv) => inv.type === 'sell' && inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const outstandingLoans = loans
    .filter((loan) => loan.status === 'Active')
    .reduce((sum, loan) => sum + loan.outstandingBalance, 0);

  const recentTransactions = invoices.slice(0, 5);
  
  return (
    <>
      <PageHeader title="لوحة التحكم" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">20.1% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القروض المستحقة</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outstandingLoans.toLocaleString()} د.م.</div>
            <p className="text-xs text-muted-foreground">180.1% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فواتير جديدة</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">19% من الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النشطون الآن</CardTitle>
             <div className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">201+ منذ الساعة الماضية</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DashboardChart />
        </div>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>المعاملات الأخيرة</CardTitle>
            <CardDescription>
              لقد قمت بـ {invoices.length} معاملات هذا الشهر.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead className="text-left">المبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.party.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.party.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      {invoice.totalAmount.toLocaleString()} د.م.
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
