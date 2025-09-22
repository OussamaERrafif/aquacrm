
'use client';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, Edit, Package, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import React from 'react';
import type { Fish } from '@/lib/types';

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<Fish | null>(null);

  React.useEffect(() => {
    async function fetchProduct() {
      if(params.id) {
        const res = await fetch(`/api/products/${params.id}`);
        if(res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          notFound();
        }
      }
    }
    fetchProduct();
  }, [params.id]);


  if (!product) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusArabic = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    switch (status) {
      case 'In Stock':
        return 'متوفر';
      case 'Low Stock':
        return 'مخزون منخفض';
      case 'Out of Stock':
        return 'نفذ المخزون';
    }
  }

  const stockPercentage = product.stock > 0 ? (product.stock / (product.stock + product.minStock * 1.5)) * 100 : 0;


  return (
    <>
      <PageHeader 
        title={product.name} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/products"><ArrowRight className="ml-2 h-4 w-4" />العودة إلى المنتجات</Link>
                </Button>
                <Button>
                    <Edit className="ml-2 h-4 w-4" />تعديل المنتج
                </Button>
            </div>
        }
      >
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Package className="h-4 w-4" /> 
            {product.category}
        </p>
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
             <Card className="overflow-hidden">
                <div className="relative h-80 w-full">
                    <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                        data-ai-hint={product.imageHint}
                    />
                </div>
                <CardFooter className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground w-full text-center">صورة {product.name}</p>
                </CardFooter>
            </Card>
        </div>
        <div className="md:col-span-2">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>تفاصيل المنتج</CardTitle>
                        {product.id === 'F002' ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-yellow-500" />}
                    </div>
                    <CardDescription>جميع المعلومات حول هذا المنتج.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">السعر لكل كيلو</h3>
                            <p className="text-2xl font-bold">{product.price.toFixed(2)} د.م.</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">الحالة</h3>
                            <Badge className={cn("text-base", getStatusColor(product.status))}>{getStatusArabic(product.status)}</Badge>
                        </div>
                    </div>
                     <Separator />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">تفاصيل المخزون</h3>
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">المخزون الحالي</span>
                                <span>{product.stock} كغ</span>
                            </div>
                            <Progress value={stockPercentage} dir="rtl" />
                             <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0 كغ</span>
                                <span>الحد الأدنى للمخزون: {product.minStock} كغ</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                     <div>
                        <h3 className="text-lg font-semibold mb-2">معلومات المورد</h3>
                         <p className="text-sm">
                            <span className="text-muted-foreground">المورد: </span>
                            {product.supplier}
                         </p>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
