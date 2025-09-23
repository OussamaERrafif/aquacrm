'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
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
import { TracabilityPDFExportButton } from '@/components/app/tracability-pdf-export-button';
import type { Tracability } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function TracabilityPage() {
  const router = useRouter();
  const [tracabilityEntries, setTracabilityEntries] = React.useState<Tracability[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/tracability');
      if (res.ok) {
        const data = await res.json();
        setTracabilityEntries(data);
      } else {
        console.error('Failed to fetch tracability entries');
      }
    }
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedId) {
      await fetch(`/api/tracability/${selectedId}`, {
        method: 'DELETE',
      });
      setTracabilityEntries(tracabilityEntries.filter(t => t.id !== selectedId));
      setShowDeleteDialog(false);
      setSelectedId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedId(id);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <PageHeader
        title="الأسماك المشتراة"
        action={
          <div className="flex gap-2">
          <Button asChild>
            <Link href="/tracability/new">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة
            </Link>
          </Button>
        <TracabilityPDFExportButton tracabilityEntries={tracabilityEntries} />
        </div>
        }
      />
      <Table id="tracability-table">
        <TableHeader>
          <TableRow>
            <TableHead>كود الموريور</TableHead>
            <TableHead>اسم الموريور</TableHead>
            <TableHead>الوزن المشترى</TableHead>
            <TableHead>الوزن المباع</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracabilityEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.codeMareyeur}</TableCell>
              <TableCell>{entry.nomMareyeur}</TableCell>
              <TableCell>{entry.poidsAchete}</TableCell>
              <TableCell>{entry.poidsVendu}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/tracability/${entry.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(entry.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا العنصر؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف العنصر والبيانات المرتبطة به بشكل دائم.
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
