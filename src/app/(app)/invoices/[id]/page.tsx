
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { invoices } from '@/lib/data';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const invoice = invoices.find((inv) => inv.id === params.id);

  if (!invoice) {
    notFound();
  }
  
  const backUrl = invoice.type === 'buy' ? '/buy' : '/sell';

  return (
    <>
      <PageHeader 
        title={`Invoice ${invoice.invoiceNumber}`} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href={backUrl}><ArrowLeft className="mr-2 h-4 w-4" />Back to List</Link>
                </Button>
                <Button asChild>
                    <Link href={`/invoices/${invoice.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                </Button>
                 <Button variant="outline"><Printer className="mr-2 h-4 w-4" />Print</Button>
            </div>
        }
      />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AquaTrade CRM</h1>
              <p className="text-muted-foreground">123 Fishery Road, Ocean City, 12345</p>
            </div>
            <div className="text-left md:text-right">
                <h2 className="text-xl font-semibold">Invoice {invoice.invoiceNumber}</h2>
                <Badge variant={invoice.status === 'Paid' ? 'secondary' : invoice.status === 'Overdue' ? 'destructive' : 'outline'}>
                    {invoice.status}
                </Badge>
            </div>
          </div>
           <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1">Bill To</h3>
                    <p className="text-sm text-muted-foreground">
                        {invoice.party.name}<br/>
                        {invoice.party.company}<br/>
                        {invoice.party.address}<br/>
                        {invoice.party.email}
                    </p>
                </div>
                <div className="text-right">
                    <h3 className="font-semibold mb-1">Invoice Date</h3>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    <h3 className="font-semibold mb-1 mt-2">Due Date</h3>
                    <p className="text-sm text-muted-foreground">{invoice.dueDate}</p>
                </div>
           </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Length (cm)</TableHead>
                        <TableHead className="text-center">Weight (kg)</TableHead>
                        <TableHead className="text-right">Price/kg</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoice.items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.fish.name} ({item.fish.category})</TableCell>
                            <TableCell className="text-center">{item.length}</TableCell>
                            <TableCell className="text-center">{item.weight}</TableCell>
                            <TableCell className="text-right">${item.pricePerKilo.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Separator className="my-4" />
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${invoice.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${invoice.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
             </div>
        </CardContent>
         <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">Thank you for your business!</p>
            {invoice.status !== 'Paid' && <Button>Mark as Paid</Button>}
        </CardFooter>
      </Card>
    </>
  );
}
