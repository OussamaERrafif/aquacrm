
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
import { fish } from '@/lib/data';
import type { Fish } from '@/lib/types';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducts: (selectedProducts: Fish[]) => void;
}

export function ProductSelectionModal({
  isOpen,
  onClose,
  onSelectProducts,
}: ProductSelectionModalProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProducts, setSelectedProducts] = React.useState<Fish[]>([]);

  const filteredProducts = fish.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product: Fish) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleAddProducts = () => {
    onSelectProducts(selectedProducts);
    setSelectedProducts([]);
    onClose();
  };

  const isProductSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
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
                  <TableHead>المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead className="text-left">السعر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} onClick={() => handleSelect(product)} className="cursor-pointer">
                    <TableCell>
                      <Checkbox
                        checked={isProductSelected(product.id)}
                        onCheckedChange={() => handleSelect(product)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-left">
                      {product.price.toFixed(2)} د.م.
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
          <Button onClick={handleAddProducts} disabled={selectedProducts.length === 0}>
            إضافة المحدد ({selectedProducts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
