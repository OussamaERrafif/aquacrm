
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Fish } from '@/lib/types';
import { Search } from 'lucide-react';
// image removed: we only display names with lengths

interface SelectedEntry {
  id: string; // entry id = `${fishId}-${length}`
  fishId: string;
  name: string;
  category: string;
  price: number;
  length: string;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // return array of selections with fishId and length
  onSelectProducts: (selectedProducts: { fishId: string; length: string; price: number }[]) => void;
}

export function ProductSelectionModal({
  isOpen,
  onClose,
  onSelectProducts,
}: ProductSelectionModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedEntries, setSelectedEntries] = React.useState<SelectedEntry[]>([]);
  const [allEntries, setAllEntries] = React.useState<SelectedEntry[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      async function fetchProducts() {
        const res = await fetch('/api/products');
        const data = await res.json();
        // flatten products into entries for each length so user can pick length at selection time
        const lengths = ['xs','s','m','l','xl','xxl'];
        const entries: SelectedEntry[] = data.flatMap((p: Fish) =>
          lengths.map(len => ({
            id: `${p.id}-${len}`,
            fishId: p.id,
            name: `${p.name}-${len}`,
            category: p.category,
            price: p.price,
            length: len,
          }))
        );
        setAllEntries(entries);
      }
      fetchProducts();
    }
  }, [isOpen]);

  const filteredEntries = allEntries.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (entry: SelectedEntry) => {
    setSelectedEntries((prev) => {
      const isSelected = prev.some((p) => p.id === entry.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== entry.id);
      } else {
        return [...prev, entry];
      }
    });
  };

  const handleAddProducts = () => {
    const mapped = selectedEntries.map(e => ({ fishId: e.fishId, length: e.length, price: e.price }));
    onSelectProducts(mapped);
    setSelectedEntries([]);
    onClose();
  };

  const isEntrySelected = (entryId: string) => {
    return selectedEntries.some((p) => p.id === entryId);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>اختيار المنتجات</DialogTitle>
          <DialogDescription>
            اختر المنتجات لإضافتها إلى الفاتورة.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتجات..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>المنتج (الطول)</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead className="text-left">السعر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} onClick={() => handleSelect(entry)} className="cursor-pointer">
                    <TableCell>
                      <Checkbox
                        checked={isEntrySelected(entry.id)}
                        onCheckedChange={() => handleSelect(entry)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{entry.name}</span>
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className="text-left">
                      {entry.price.toFixed(2)} د.م.
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
          <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleAddProducts} disabled={selectedEntries.length === 0}>
            إضافة المحدد ({selectedEntries.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
