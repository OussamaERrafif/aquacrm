"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageHeader } from '@/components/app/page-header';
import Link from 'next/link';
import type { Fish } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب.'),
  category: z.string().min(1, 'الفئة مطلوبة.'),
  status: z.string().min(1, 'الحالة مطلوبة.'),
  price: z.coerce.number().min(0, 'السعر يجب أن يكون رقمًا.'),
  stock: z.coerce.number().min(0, 'المخزون يجب أن يكون رقمًا.'),
  minStock: z.coerce.number().min(0, 'الحد الأدنى للمخزون يجب أن يكون رقمًا.'),
  supplier: z.string().optional(),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      status: 'In Stock',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: '',
      imageUrl: '',
      imageHint: '',
    },
  });

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/products/${params.id}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data: Fish = await res.json();
        form.reset({
          name: data.name,
          category: data.category,
          status: data.status,
          price: data.price,
          stock: data.stock,
          minStock: data.minStock,
          supplier: data.supplier,
          imageUrl: data.imageUrl,
          imageHint: data.imageHint,
        });
      } else if (res.status === 404) {
        setError('Product not found');
      } else if (res.status === 401) {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to load product');
      }
    }
    fetchProduct();
  }, [params.id]);

  const onSubmit = async (data: ProductFormValues) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`/api/products/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (res.status === 401) {
      if (typeof window !== 'undefined') localStorage.removeItem('token');
      router.push('/login');
      return;
    }
    if (!res.ok) {
      setError('Failed to save product');
      return;
    }
    router.push('/products');
    router.refresh();
  };

  if (error) return <div className="p-6">{error}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="تعديل المنتج" />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>الحالة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر لكل كيلو</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem>
                  <FormLabel>المخزون</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="minStock" render={({ field }) => (
                <FormItem>
                  <FormLabel>الحد الأدنى للمخزون</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="supplier" render={({ field }) => (
                <FormItem>
                  <FormLabel>المورد</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الصورة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="imageHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>تلميح الصورة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href="/products">إلغاء</Link></Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
