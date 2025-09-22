
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/app/page-header';
import { parties } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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

export default function PartiesPage() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedPartyId, setSelectedPartyId] = React.useState<string | null>(null);

  const handleDelete = () => {
    if (selectedPartyId) {
      console.log(`Deleting party with id: ${selectedPartyId}`);
      // Here you would typically call an API to delete the party
      setShowDeleteDialog(false);
      setSelectedPartyId(null);
    }
  };
  
  const openDeleteDialog = (partyId: string) => {
    setSelectedPartyId(partyId);
    setShowDeleteDialog(true);
  }

  return (
    <>
      <PageHeader
        title="Parties"
        action={
          <Button asChild>
            <Link href="/parties/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Party
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Party Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parties.map((party) => (
                <TableRow key={party.id}>
                  <TableCell className="font-medium">
                     <Link href={`/parties/${party.id}`} className="hover:underline">{party.name}</Link>
                  </TableCell>
                  <TableCell>{party.company}</TableCell>
                  <TableCell>{party.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem asChild><Link href={`/parties/${party.id}`}>View Details</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href={`/parties/${party.id}/edit`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(party.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this party?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the party and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
