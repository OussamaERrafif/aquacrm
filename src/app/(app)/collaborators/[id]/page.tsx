
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CollaboratorPDFExportButton } from '@/components/app/collaborator-pdf-export-button'; // Will create this component
import type { Collaborator, ChargesInvoice } from '@/lib/types';
import { useEffect, useState } from 'react';

interface CollaboratorWithRelations extends Collaborator {
  chargesInvoices: ChargesInvoice[];
}

export default function CollaboratorDetailsPage() {
  const params = useParams<{ id: string }>();
    const [collaborator, setCollaborator] = useState<CollaboratorWithRelations | null>(null);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
            async function fetchCollaborator() {
                const res = await fetch(`/api/collaborators/${params.id}?include_charges_invoices=true`);
                if (res.ok) {
                    const data = await res.json();
                    setCollaborator(data);
                } else if (res.status === 404) {
                    setError('Collaborator not found');
                } else {
                    setError('Failed to load collaborator');
                }
            }
      fetchCollaborator();
    }
  }, [params.id]);

    if (error) return <div className="p-6">{error}</div>;

    if (!collaborator) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

  return (
    <>
      <PageHeader 
        title={collaborator.name} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/collaborators"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى المتعاونين</Link>
                </Button>
                <Button asChild>
                    <Link href={`/collaborators/${collaborator.id}/edit`}><Edit className="ml-2 h-4 w-4" />تعديل المتعاون</Link>
                </Button>
                <CollaboratorPDFExportButton collaborator={collaborator} />
            </div>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
            <Card id="collaborator-details-card">
                <CardHeader>
                <CardTitle>معلومات المتعاون</CardTitle>
                <CardDescription>تفاصيل الاتصال.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</h3>
                        <p>{collaborator.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">الهاتف</h3>
                        <p>{collaborator.phone}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">العنوان</h3>
                        <p>{collaborator.address}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card id="collaborator-charges-invoices-card">
                <CardHeader>
                    <CardTitle>فواتير المصاريف</CardTitle>
                    <CardDescription>قائمة بجميع فواتير المصاريف لهذا المتعاون.</CardDescription>
                </CardHeader>
                <CardContent>
                                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>رقم الفاتورة</TableHead>
                                <TableHead>التاريخ</TableHead>
                                <TableHead className="text-left">المبلغ الإجمالي</TableHead>
                                <TableHead className="text-left">الحالة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {collaborator.chargesInvoices.map((ci) => (
                                <TableRow key={ci.id}>
                                    <TableCell>
                                        <Link href={`/chargesinvoices/${ci.id}`} className="hover:underline">
                                            {ci.invoiceNumber}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{new Date(ci.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-left">{ci.totalAmount.toFixed(2)} د.م.</TableCell>
                                    <TableCell className="text-left">{ci.status}</TableCell>
                                </TableRow>
                            ))}
                             {collaborator.chargesInvoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">لم يتم العثور على فواتير مصاريف.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
