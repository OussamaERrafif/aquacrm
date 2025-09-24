"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import type { Collaborator, ChargesInvoice, Charge } from "@/lib/types";

const chargeSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب."),
  price: z.coerce.number().min(0.01, "السعر مطلوب."),
});

const chargesInvoiceSchema = z.object({
  collaboratorId: z.string().min(1, "الرجاء اختيار متعاون."),
  charges: z.array(chargeSchema).min(1, "الرجاء إضافة بند مصاريف واحد على الأقل."),
});

type ChargesInvoiceFormValues = z.infer<typeof chargesInvoiceSchema>;

export default function EditChargesInvoicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [collaboratorList, setCollaboratorList] = React.useState<Collaborator[]>([]);
  const [chargesInvoice, setChargesInvoice] = React.useState<ChargesInvoice | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const form = useForm<ChargesInvoiceFormValues>({
    resolver: zodResolver(chargesInvoiceSchema),
  });

  useEffect(() => {
    async function fetchData() {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const resCollaborators = await fetch(`${baseUrl}/api/collaborators`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (resCollaborators.ok) {
          setCollaboratorList(await resCollaborators.json());
        } else {
          console.error('Failed to fetch collaborators');
        }

      if (params.id) {
      const resChargesInvoice = await fetch(`${baseUrl}/api/chargesinvoices/${params.id}?include_collaborator=true&include_charges=true`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (resChargesInvoice.ok) {
        const chargesInvoiceData: ChargesInvoice = await resChargesInvoice.json();
        setChargesInvoice(chargesInvoiceData);
        form.reset({
          collaboratorId: chargesInvoiceData.collaborator.id,
          charges: chargesInvoiceData.charges.map(charge => ({
            title: charge.title,
            price: charge.price,
          })),
        });
      } else if (resChargesInvoice.status === 404) {
        setError('Charges Invoice not found');
      } else if (resChargesInvoice.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        router.push('/login');
        return;
      } else {
        console.error('Failed to load charges invoice, status:', resChargesInvoice.status);
        setError('Failed to load charges invoice');
      }
    }
    }
    fetchData();
  }, [params.id, form]);

  const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({
    control: form.control,
    name: "charges",
  });

  const onSubmit = async (data: ChargesInvoiceFormValues) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`/api/chargesinvoices/${params.id}`, {
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
      console.error('Failed to save charges invoice, status:', res.status);
      setError('Failed to save charges invoice');
      return;
    }
    router.push(`/chargesinvoices/${params.id}`);
    router.refresh();
  };
  
  const totalAmount = (form.watch("charges") || []).reduce((acc, charge) => {
    return acc + (charge.price || 0);
  }, 0);

  if (!chargesInvoice) {
  if (error) return <div className="p-6">{error}</div>;
  return <div>Loading...</div>;
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title={`تعديل فاتورة المصاريف ${chargesInvoice.invoiceNumber}`} />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل فاتورة المصاريف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="collaboratorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المتعاون</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر متعاونًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collaboratorList.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

             <div className="space-y-4">
                <h3 className="text-lg font-medium">بنود المصاريف</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>العنوان</TableHead>
                            <TableHead>السعر</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chargeFields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <FormField control={form.control} name={`charges.${index}.title`} render={({ field }) => <Input {...field} placeholder="مثال: أتعاب المحاسب" />} />
                                </TableCell>
                                <TableCell>
                                    <FormField control={form.control} name={`charges.${index}.price`} render={({ field }) => <Input {...field} type="number" placeholder="0.00" className="text-right" />} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCharge(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button type="button" variant="outline" size="sm" onClick={() => appendCharge({ title: "", price: 0 })}><PlusCircle className="ml-2 h-4 w-4" />إضافة بند مصاريف</Button>
             </div>
             
             <Separator />
             
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-left">
                    <div className="flex justify-between font-semibold text-lg">
                        <span>الإجمالي</span>
                        <span>{Number(totalAmount).toFixed(2)} د.م.</span>
                    </div>
                </div>
             </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href={`/chargesinvoices/${params.id}`}>إلغاء</Link></Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    </>
  );
}
