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
import { PlusCircle, Trash2, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { ProductSelectionModal } from "@/components/app/product-selection-modal";
import type { Fish, Party, Invoice } from "@/lib/types";

const invoiceItemSchema = z.object({
  fishId: z.string().min(1, "الرجاء اختيار سمكة."),
  length: z.enum(["xs", "s", "m", "l", "xl", "xxl"]),
  weight: z.coerce.number().min(1, "الوزن مطلوب."),
  pricePerKilo: z.coerce.number().min(0.01, "السعر مطلوب."),
});

const invoiceSchema = z.object({
  type: z.enum(["buy", "sell"]),
  partyId: z.string().min(1, "الرجاء اختيار طرف."),
  status: z.enum(["Paid", "Unpaid", "Overdue"]),
  items: z.array(invoiceItemSchema).min(1, "الرجاء إضافة عنصر واحد على الأقل."),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;
const sizeOptions: z.infer<typeof invoiceItemSchema.shape.length>[] = ["xs", "s", "m", "l", "xl", "xxl"];

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [partyList, setPartyList] = React.useState<Party[]>([]);
  const [fishList, setFishList] = React.useState<Fish[]>([]);
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
  });

  useEffect(() => {
    async function fetchData() {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const resParties = await fetch(`${baseUrl}/api/parties`);
        setPartyList(await resParties.json());

        const resFish = await fetch(`${baseUrl}/api/products`);
        setFishList(await resFish.json());

        if (params.id) {
            const resInvoice = await fetch(`${baseUrl}/api/invoices/${params.id}`);
            if (resInvoice.ok) {
                const invoiceData: Invoice = await resInvoice.json();
                setInvoice(invoiceData);
                form.reset({
                    type: invoiceData.type,
                    partyId: invoiceData.party.id,
                    status: invoiceData.status,
                    items: invoiceData.items.map(item => ({
                        fishId: item.fish.id,
                        length: item.length,
                        weight: item.weight,
                        pricePerKilo: item.pricePerKilo
                    })),
                });
            } else {
                notFound();
            }
        }
    }
    fetchData();
  }, [params.id, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    await fetch(`/api/invoices/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push(`/invoices/${params.id}`);
    router.refresh();
  };
  
  const handleSelectProducts = (selectedProducts: Fish[]) => {
    const currentFishIds = new Set(form.getValues('items').map(item => item.fishId));
    const newProducts = selectedProducts.filter(product => !currentFishIds.has(product.id));

    newProducts.forEach(product => {
      append({
        fishId: product.id,
        length: 'm',
        weight: 0,
        pricePerKilo: product.price,
      });
    });
  };

  const totalAmount = form.watch("items").reduce((acc, item) => {
    return acc + (item.weight || 0) * (item.pricePerKilo || 0);
  }, 0);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <>
     <ProductSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProducts={handleSelectProducts}
    />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title={`تعديل الفاتورة ${invoice.invoiceNumber}`} />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الفاتورة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الفاتورة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sell">فاتورة بيع</SelectItem>
                        <SelectItem value="buy">فاتورة شراء</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطرف</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر طرفًا" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {partyList.map(p => (
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paid">مدفوعة</SelectItem>
                        <SelectItem value="Unpaid">غير مدفوعة</SelectItem>
                        <SelectItem value="Overdue">متأخرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">بنود الفاتورة</h3>
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(true)}>
                        <Package className="ml-2 h-4 w-4" />
                        اختيار المنتجات
                    </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>السمك</TableHead>
                    <TableHead>الطول</TableHead>
                    <TableHead>الوزن (كغ)</TableHead>
                    <TableHead>السعر/كغ</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const item = form.watch(`items.${index}`);
                    const itemTotal = (item.weight || 0) * (item.pricePerKilo || 0);

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`items.${index}.fishId`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="اختر سمكة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {fishList.map(f => <SelectItem key={f.id} value={f.id}>{f.name} ({f.category})</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.length`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="الحجم" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {sizeOptions.map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.weight`} render={({ field }) => <Input {...field} type="number" placeholder="0" className="text-right" />} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.pricePerKilo`} render={({ field }) => <Input {...field} type="number" placeholder="0.00" className="text-right" />} /></TableCell>
                        <TableCell>{itemTotal.toFixed(2)} د.م.</TableCell>
                        <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ fishId: "", length: 'm', weight: 0, pricePerKilo: 0 })}><PlusCircle className="ml-2 h-4 w-4" />إضافة بند</Button>
            </div>
            
             <Separator />
             
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-left">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{totalAmount.toFixed(2)} د.م.</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">الضريبة (0%)</span>
                        <span>0.00 د.م.</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>الإجمالي</span>
                        <span>{totalAmount.toFixed(2)} د.م.</span>
                    </div>
                </div>
             </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild><Link href={`/invoices/${params.id}`}>إلغاء</Link></Button>
            <Button type="submit">حفظ التغييرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    </>
  );
}
