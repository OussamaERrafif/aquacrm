"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import type { Party } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const newPartySchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب.'),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['BUYER', 'SELLER']).optional(),
});

type NewPartyValues = z.infer<typeof newPartySchema>;

interface PartySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (party: Party) => void;
}

export function PartySelectionModal({ isOpen, onClose, onSelect }: PartySelectionModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [parties, setParties] = React.useState<Party[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [createMode, setCreateMode] = React.useState(false);

  const form = useForm<NewPartyValues>({
    resolver: zodResolver(newPartySchema),
    defaultValues: { name: '', company: '', email: '', phone: '', address: '', type: 'BUYER' },
  });

  React.useEffect(() => {
    if (isOpen) {
      async function fetchParties() {
        const res = await fetch('/api/parties');
        if (res.ok) {
          const data = await res.json();
          setParties(data);
        }
      }
      fetchParties();
      setSelectedId(null);
      setCreateMode(false);
    }
  }, [isOpen]);

  const filtered = parties.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    const party = parties.find(p => p.id === selectedId);
    if (party) {
      onSelect(party);
      onClose();
    }
  };

  const onCreate = async (values: NewPartyValues) => {
    const res = await fetch('/api/parties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (res.ok) {
      const newParty = await res.json();
      setParties(prev => [newParty, ...prev]);
      form.reset();
      setCreateMode(false);
      setSelectedId(newParty.id);
      // auto-select newly created
      onSelect(newParty);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>اختيار الطرف</DialogTitle>
          <DialogDescription>ابحث عن طرف موجود أو أنشئ طرفًا جديدًا.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="بحث عن طرف..." className="pr-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {!createMode && (
            <ScrollArea className="h-[300px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الشركة</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>النوع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelectedId(p.id)}>
                      <TableCell>
                        <Checkbox checked={selectedId === p.id} onCheckedChange={() => setSelectedId(selectedId === p.id ? null : p.id)} />
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.company}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{(p as any).type ?? ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {createMode && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreate)} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الشركة (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الهاتف (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>النوع</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الطرف" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUYER">مشتر</SelectItem>
                            <SelectItem value="SELLER">بائع</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>العنوان (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => { form.reset(); setCreateMode(false); }}>إلغاء</Button>
                  <Button type="submit">إنشاء الطرف</Button>
                </div>
              </form>
            </Form>
          )}
        </div>

        <DialogFooter>
          {!createMode && (
            <>
              <Button variant="outline" onClick={onClose}>إلغاء</Button>
              <div className="flex gap-2">
                <Button onClick={() => setCreateMode(true)}>إنشاء طرف جديد</Button>
                <Button onClick={handleSelect} disabled={!selectedId}>اختيار الطرف</Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
