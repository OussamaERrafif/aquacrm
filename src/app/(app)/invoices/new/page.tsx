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
import { parties, fish } from "@/lib/data";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const invoiceSchema = z.object({
  type: z.enum(["buy", "sell"]),
  partyId: z.string().min(1, "Please select a party."),
  items: z.array(
    z.object({
      fishId: z.string().min(1, "Please select a fish."),
      length: z.coerce.number().min(1, "Length is required."),
      weight: z.coerce.number().min(1, "Weight is required."),
      pricePerKilo: z.coerce.number().min(0.01, "Price is required."),
    })
  ).min(1, "Please add at least one item."),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function NewInvoicePage() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      type: "sell",
      partyId: "",
      items: [{ fishId: "", length: 0, weight: 0, pricePerKilo: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const invoiceType = form.watch("type");

  const partyList = parties;

  const onSubmit = (data: InvoiceFormValues) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };

  const totalAmount = form.watch("items").reduce((acc, item) => {
    return acc + (item.weight || 0) * (item.pricePerKilo || 0);
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader title="Create New Invoice" />
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sell">Sell Invoice</SelectItem>
                        <SelectItem value="buy">Buy Invoice</SelectItem>
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
                    <FormLabel>Party</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select a party`} />
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
            </div>
            
            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fish</TableHead>
                    <TableHead>Length (cm)</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Price/kg</TableHead>
                    <TableHead>Total</TableHead>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select fish" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {fish.map(f => <SelectItem key={f.id} value={f.id}>{f.name} ({f.type})</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.length`} render={({ field }) => <Input {...field} type="number" placeholder="0" />} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.weight`} render={({ field }) => <Input {...field} type="number" placeholder="0" />} /></TableCell>
                        <TableCell><FormField control={form.control} name={`items.${index}.pricePerKilo`} render={({ field }) => <Input {...field} type="number" placeholder="0.00" />} /></TableCell>
                        <TableCell>${itemTotal.toFixed(2)}</TableCell>
                        <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ fishId: "", length: 0, weight: 0, pricePerKilo: 0 })}><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
            </div>
            
             <Separator />
             
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>$0.00</span>
                    </div>
                     <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
             </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit">Save Invoice</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
