
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageHeader } from '@/components/app/page-header';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { Party } from '@/lib/types';


const loanSchema = z.object({
  fisherId: z.string().min(1, 'الرجاء اختيار صياد.'),
  amount: z.coerce.number().min(1, 'يجب أن يكون المبلغ أكبر من 0.'),
  disbursementDate: z.date({
    required_error: "تاريخ الصرف مطلوب.",
  }),
  repaymentSchedule: z.string().min(1, 'جدول السداد مطلوب.'),
});

type LoanFormValues = z.infer<typeof loanSchema>;

export default function NewLoanPage() {
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      fisherId: '',
      amount: 0,
      repaymentSchedule: 'Monthly',
    },
  });

  useEffect(() => {
    async function fetchParties() {
        const res = await fetch('/api/parties');
        const data = await res.json();
        setParties(data);
    }
    fetchParties();
  }, []);

  const onSubmit = async (data: LoanFormValues) => {
    await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    router.push('/loans');
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="إنشاء قرض جديد" />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل القرض</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fisherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصياد</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر صيادًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parties.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="disbursementDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الصرف</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-right font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>اختر تاريخًا</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repaymentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>جدول السداد</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر جدولًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monthly">شهري</SelectItem>
                        <SelectItem value="Quarterly">ربع سنوي</SelectItem>
                        <SelectItem value="Annually">سنوي</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href="/loans">إلغاء</Link></Button>
            <Button type="submit">حفظ القرض</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
