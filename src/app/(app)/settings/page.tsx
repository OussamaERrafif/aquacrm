'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { suggestInvoiceArchiveTimeout } from '@/ai/flows/suggest-invoice-archive-timeout';
import { invoices } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ timeout: string; reasoning: string } | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [policy, setPolicy] = useState<string>('سياسة الشركة القياسية هي الاحتفاظ بالسجلات المالية لمدة 7 سنوات لأغراض الضرائب والمراجعة. يمكن أرشفة البيانات غير الهامة في وقت أقرب.');
  const [legalReqs, setLegalReqs] = useState<string>('تنطبق لوائح GDPR و CCPA على بيانات العملاء. يجب أن تمتثل بيانات المعاملات المالية لمتطلبات SOX.');

  const handleSuggestTimeout = async () => {
    if (!selectedInvoiceId) return;
    setLoading(true);
    setSuggestion(null);
    try {
      const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);
      if (!selectedInvoice) throw new Error("Invoice not found");

      const invoiceSummary = `Invoice #${selectedInvoice.invoiceNumber} for ${selectedInvoice.party.name}, dated ${selectedInvoice.date}, amount $${selectedInvoice.totalAmount}.`;

      const result = await suggestInvoiceArchiveTimeout({
        invoiceDataSummary: invoiceSummary,
        companyDataRetentionPolicy: policy,
        legalRequirements: legalReqs,
      });
      setSuggestion({ timeout: result.suggestedTimeout, reasoning: result.reasoning });
    } catch (error) {
      console.error('Failed to suggest timeout:', error);
      // Handle error display
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="الإعدادات" />
      <Card>
        <CardHeader>
          <CardTitle>أرشفة الفواتير بالذكاء الاصطناعي</CardTitle>
          <CardDescription>
            احصل على اقتراحات مدعومة بالذكاء الاصطناعي لفترات أرشفة الفواتير المثلى بناءً على سياسة الشركة والمتطلبات القانونية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invoice-select">اختر فاتورة لتحليلها</Label>
            <Select onValueChange={setSelectedInvoiceId} dir="rtl">
              <SelectTrigger id="invoice-select">
                <SelectValue placeholder="اختر فاتورة" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map(inv => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.party.name} (${inv.totalAmount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-policy">سياسة الاحتفاظ بالبيانات للشركة</Label>
            <Textarea id="company-policy" value={policy} onChange={(e) => setPolicy(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legal-reqs">المتطلبات القانونية</Label>
            <Textarea id="legal-reqs" value={legalReqs} onChange={(e) => setLegalReqs(e.target.value)} />
          </div>
          <Button onClick={handleSuggestTimeout} disabled={loading || !selectedInvoiceId}>
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            اقترح مهلة
          </Button>
          
          {suggestion && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">اقتراح الذكاء الاصطناعي:</h3>
              <div className="p-4 border rounded-md bg-muted/50 space-y-2">
                <p><strong>المهلة المقترحة:</strong> {suggestion.timeout}</p>
                <p><strong>السبب:</strong> {suggestion.reasoning}</p>
              </div>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">ملاحظة: هذا عرض توضيحي. يمكن تعديل السياسات في حقول النص.</p>
        </CardFooter>
      </Card>
    </>
  );
}
