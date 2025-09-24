
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
import { ProductSelectionModal } from "@/components/app/product-selection-modal";
import { PartySelectionModal } from '@/components/app/party-selection-modal';
import React, { useEffect } from "react";
import type { Fish, Party } from "@/lib/types";
import { useRouter } from "next/navigation";

const invoiceItemSchema = z.object({
  fishId: z.string().min(1, "الرجاء اختيار سمكة."),
  length: z.enum(["xs", "s", "m", "l", "xl", "xxl"]),
  weight: z.coerce.number().min(1, "الوزن مطلوب."),
  pricePerKilo: z.coerce.number().min(0.01, "السعر مطلوب."),
});

const chargeSchema = z.object({
  description: z.string().min(1, "الوصف مطلوب."),
  type: z.enum(["fixed", "percentage"]),
  value: z.coerce.number().min(0.01, "القيمة مطلوبة."),
});

const invoiceSchema = z.object({
  type: z.enum(["buy", "sell"]),
  partyId: z.string().min(1, "الرجاء اختيار طرف."),
  items: z.array(invoiceItemSchema).min(1, "الرجاء إضافة عنصر واحد على الأقل."),
  charges: z.array(chargeSchema).optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const sizeOptions: z.infer<typeof invoiceItemSchema.shape.length>[] = ["xs", "s", "m", "l", "xl", "xxl"];

export default function NewInvoicePage() {
    const router = useRouter();
  const [productModalOpen, setProductModalOpen] = React.useState(false);
  const [partyModalOpen, setPartyModalOpen] = React.useState(false);
  const [partyList, setPartyList] = React.useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = React.useState<Party | null>(null);
    const [fishList, setFishList] = React.useState<Fish[]>([]);

    useEffect(() => {
        async function fetchData() {
            const resParties = await fetch('/api/parties');
                if (resParties.ok) {
                  const partiesData = await resParties.json();
                  setPartyList(partiesData);
                } else {
                  console.error('Failed to fetch parties');
                }
            
            const resFish = await fetch('/api/products');
            if (resFish.ok) {
              const fishData = await resFish.json();
              setFishList(fishData);
            } else {
              console.error('Failed to fetch products');
            }
        }
        fetchData();
    }, []);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      type: "sell",
      partyId: "",
      items: [],
      charges: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({
    control: form.control,
    name: "charges",
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const redirectUrl = data.type === 'buy' ? '/buy' : '/sell';
    router.push(redirectUrl);
    router.refresh();
  };

  const handleSelectProducts = (selectedProducts: { fishId: string; length: string; price: number }[]) => {
    const currentItems = form.getValues('items');

    selectedProducts.forEach((p) => {
      const exists = currentItems.some((it: any) => it.fishId === p.fishId && it.length === p.length);
      if (!exists) {
        append({ fishId: p.fishId, length: p.length as any, weight: 0, pricePerKilo: p.price });
      }
    });
  };

  const subtotal = form.watch("items").reduce((acc, item) => {
    return acc + (item.weight || 0) * (item.pricePerKilo || 0);
  }, 0);

  const totalCharges = form.watch("charges")?.reduce((acc, charge) => {
    if (charge.type === 'fixed') {
        return acc + (charge.value || 0);
    }
    if (charge.type === 'percentage') {
        return acc + (subtotal * (charge.value || 0) / 100);
    }
    return acc;
  }, 0) || 0;
  
  const totalAmount = subtotal - totalCharges;

  return (
    <>
    <ProductSelectionModal 
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSelectProducts={handleSelectProducts}
    />
    <PartySelectionModal
      isOpen={partyModalOpen}
      onClose={() => setPartyModalOpen(false)}
      onSelect={(p) => {
        setSelectedParty(p);
        form.setValue('partyId', p.id);
      }}
    />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="إنشاء فاتورة جديدة" />
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الفاتورة</FormLabel>
                     <FormControl>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={field.value === 'sell' ? 'default' : 'outline'}
                            className="w-full"
                            onClick={() => field.onChange('sell')}
                          >
                            فاتورة بيع
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'buy' ? 'default' : 'outline'}
                            className="w-full"
                            onClick={() => field.onChange('buy')}
                          >
                            فاتورة شراء
                          </Button>
                        </div>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطرف</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Button type="button" onClick={() => setPartyModalOpen(true)} className="w-full text-right">
                          {selectedParty ? `${selectedParty.name} ${selectedParty.company ? `(${selectedParty.company})` : ''}` : 'اختر طرفًا أو ابحث عنه'}
                        </Button>
                        <input type="hidden" name={field.name} value={field.value} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">بنود الفاتورة</h3>
                 <Button variant="outline" size="sm" type="button" onClick={() => setProductModalOpen(true)}>
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
                          {/* Show name-length preview */}
                          <div className="text-sm text-muted-foreground mt-1">
                            {(() => {
                              const f = fishList.find(x => x.id === form.getValues(`items.${index}.fishId`));
                              const len = form.getValues(`items.${index}.length`);
                              return f ? `${f.name}-${(len || 'm').toUpperCase()}` : null;
                            })()}
                          </div>
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

             <div className="space-y-4">
                <h3 className="text-lg font-medium">الضرائب والرسوم الأخرى</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الوصف</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>القيمة</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chargeFields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <FormField control={form.control} name={`charges.${index}.description`} render={({ field }) => <Input {...field} placeholder="مثال: ضريبة القيمة المضافة" />} />
                                </TableCell>
                                <TableCell>
                                     <FormField
                                        control={form.control}
                                        name={`charges.${index}.type`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                                            <FormControl>
                                                <SelectTrigger>
                                                <SelectValue placeholder="النوع" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                                                <SelectItem value="percentage">نسبة مئوية</SelectItem>
                                            </SelectContent>
                                            </Select>
                                        </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormField control={form.control} name={`charges.${index}.value`} render={({ field }) => <Input {...field} type="number" placeholder="0" />} />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCharge(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button type="button" variant="outline" size="sm" onClick={() => appendCharge({ description: "", type: 'fixed', value: 0 })}><PlusCircle className="ml-2 h-4 w-4" />إضافة خصم أو رسم</Button>
             </div>
             
             <Separator />
             
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-left">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{subtotal.toFixed(2)} د.م.</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">إجمالي الخصومات والرسوم</span>
                        <span>-{Number(totalCharges).toFixed(2)} د.م.</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>الإجمالي</span>
                        <span>{Number(totalAmount).toFixed(2)} د.م.</span>
                    </div>
                </div>
             </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" asChild><Link href={form.getValues('type') === 'buy' ? '/buy' : '/sell'}>إلغاء</Link></Button>
            <Button type="submit">حفظ الفاتورة</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
    </>
  );
}
