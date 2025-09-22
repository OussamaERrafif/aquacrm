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

const tracabilitySchema = z.object({
  codeMareyeur: z.string().min(1, 'الرمز مطلوب.'),
  nomMareyeur: z.string().min(1, 'الاسم مطلوب.'),
  poidsAchete: z.coerce.number().min(0, 'الوزن المشترى يجب أن يكون رقمًا موجبًا.'),
  poidsVendu: z.coerce.number().min(0, 'الوزن المباع يجب أن يكون رقمًا موجبًا.'),
});

type TracabilityFormValues = z.infer<typeof tracabilitySchema>;

export default function NewTracabilityPage() {
  const router = useRouter();
  const form = useForm<TracabilityFormValues>({
    resolver: zodResolver(tracabilitySchema),
    defaultValues: {
      codeMareyeur: '',
      nomMareyeur: '',
      poidsAchete: 0,
      poidsVendu: 0,
    },
  });

  const onSubmit = async (data: TracabilityFormValues) => {
    await fetch('/api/tracability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    router.push('/tracability');
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="إضافة عملية جديدة" />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل العملية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="codeMareyeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كود الموريور</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomMareyeur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الموريور</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poidsAchete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوزن المشترى</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poidsVendu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوزن المباع</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/tracability">إلغاء</Link>
            </Button>
            <Button type="submit">حفظ</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
