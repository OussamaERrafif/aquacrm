import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/app/page-header';
import { invoices } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const buyInvoices = invoices.filter(inv => inv.type === 'buy');
  const sellInvoices = invoices.filter(inv => inv.type === 'sell');

  const renderInvoiceTable = (invoiceList: typeof invoices) => (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Party</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoiceList.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.party.name}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={invoice.status === 'Paid' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'outline'}>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <PageHeader
        title="Invoices"
        action={
          <Link href="/invoices/new" legacyBehavior passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        }
      />
      <Tabs defaultValue="sell">
        <TabsList>
          <TabsTrigger value="sell">Sell Invoices</TabsTrigger>
          <TabsTrigger value="buy">Buy Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="sell">
          <Card>
            <CardHeader>
              <CardTitle>Sell Invoices</CardTitle>
              <CardDescription>All invoices for fish sold to buyers.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderInvoiceTable(sellInvoices)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="buy">
          <Card>
            <CardHeader>
              <CardTitle>Buy Invoices</CardTitle>
               <CardDescription>All invoices for fish purchased from sellers.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderInvoiceTable(buyInvoices)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
