
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Party } from '@/lib/types';

const partySchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب.'),
  company: z.string().optional(),
  email: z.string().email('عنوان بريد إلكتروني غير صالح.'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type PartyFormValues = z.infer<typeof partySchema>;

export default function EditPartyPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const form = useForm<PartyFormValues>({
      resolver: zodResolver(partySchema),
    });

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchParty() {
      const res = await fetch(`/api/parties/${params.id}`);
      if (res.ok) {
        const party: Party = await res.json();
        form.reset({
          name: party.name,
          company: party.company,
          email: party.email,
          phone: party.phone,
          address: party.address,
        });
      } else if (res.status === 404) {
        setError('Party not found');
      } else {
        setError('Failed to load party');
      }
    }
    fetchParty();
  }, [params.id, form]);

  const onSubmit = async (data: PartyFormValues) => {
    await fetch(`/api/parties/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    router.push(`/parties/${params.id}`);
    router.refresh();
  };

  const partyName = form.watch('name');

  if (error) return <div className="p-6">{error}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title={`تعديل ${partyName || '...'}`} />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الطرف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الشركة (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="Global Seafoods Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@globalseafoods.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الهاتف (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>العنوان (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Ocean Ave, Seattle, WA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href={`/parties/${params.id}`}>إلغاء</Link></Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
