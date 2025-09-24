
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
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const partySchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب.'),
  company: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['BUYER', 'SELLER'], { errorMap: () => ({ message: 'النوع مطلوب.' }) }),
});

type PartyFormValues = z.infer<typeof partySchema>;

export default function NewPartyPage() {
  const router = useRouter();
  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: PartyFormValues) => {
    await fetch('/api/parties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/parties');
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="إنشاء طرف جديد" />
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>النوع</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الطرف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BUYER">مشتر</SelectItem>
                        <SelectItem value="SELLER">بائع</SelectItem>
                      </SelectContent>
                    </Select>
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
            <Button variant="outline" asChild><Link href="/parties">إلغاء</Link></Button>
            <Button type="submit">حفظ الطرف</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
