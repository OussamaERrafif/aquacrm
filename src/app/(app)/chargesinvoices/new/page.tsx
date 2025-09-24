
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
import React, { useEffect } from "react";
import type { Collaborator } from "@/lib/types";
import { useRouter } from "next/navigation";

const chargeSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب."),
  price: z.coerce.number().min(0.01, "السعر مطلوب."),
});

const chargesInvoiceSchema = z.object({
  collaboratorId: z.string().min(1, "الرجاء اختيار متعاون."),
  charges: z.array(chargeSchema).min(1, "الرجاء إضافة بند مصاريف واحد على الأقل."),
});

type ChargesInvoiceFormValues = z.infer<typeof chargesInvoiceSchema>;

export default function NewChargesInvoicePage() {
    const router = useRouter();
    const [collaboratorList, setCollaboratorList] = React.useState<Collaborator[]>([]);

    useEffect(() => {
        async function fetchData() {
            const resCollaborators = await fetch('/api/collaborators');
            if (resCollaborators.ok) {
              const collaboratorsData = await resCollaborators.json();
              setCollaboratorList(collaboratorsData);
            } else {
              console.error('Failed to fetch collaborators');
            }
        }
        fetchData();
    }, []);

  const form = useForm<ChargesInvoiceFormValues>({
    resolver: zodResolver(chargesInvoiceSchema),
    defaultValues: {
      collaboratorId: "",
      charges: [],
    },
  });

  const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({
    control: form.control,
    name: "charges",
  });

  const onSubmit = async (data: ChargesInvoiceFormValues) => {
    await fetch('/api/chargesinvoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/chargesinvoices');
    router.refresh();
  };

  const totalAmount = form.watch("charges").reduce((acc, charge) => {
    return acc + (charge.price || 0);
  }, 0);

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="إنشاء فاتورة مصاريف جديدة" />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل فاتورة المصاريف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Button variant="outline" type="button" asChild><Link href={'/chargesinvoices'}>إلغاء</Link></Button>
            <Button type="submit">حفظ فاتورة المصاريف</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    </>
  );
}
