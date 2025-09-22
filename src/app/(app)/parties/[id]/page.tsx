
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { parties } from '@/lib/data';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function PartyDetailsPage({ params }: { params: { id: string } }) {
  const party = parties.find((p) => p.id === params.id);

  if (!party) {
    notFound();
  }

  return (
    <>
      <PageHeader 
        title={party.name} 
        action={
            <div className="flex gap-2">
                <Link href="/parties" passHref>
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Back to Parties</Button>
                </Link>
                <Link href={`/parties/${party.id}/edit`} passHref>
                    <Button><Edit className="mr-2 h-4 w-4" />Edit Party</Button>
                </Link>
            </div>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Party Information</CardTitle>
          <CardDescription>Details for {party.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
              <p>{party.company}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{party.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{party.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p>{party.address}</p>
            </div>
             <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credit Limit</h3>
              <p>${party.credit.limit.toLocaleString()}</p>
            </div>
             <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credit Balance</h3>
              <p>${party.credit.balance.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
