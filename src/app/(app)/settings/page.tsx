
'use client';

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
import { PageHeader } from '@/components/app/page-header';
import { useTheme } from '@/components/app/theme-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="الإعدادات" />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المظهر</CardTitle>
            <CardDescription>
              قم بتخصيص مظهر التطبيق. قم بالتبديل بين الوضع الفاتح والداكن.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="theme">السمة</Label>
              <Select value={theme} onValueChange={setTheme} dir="rtl">
                <SelectTrigger id="theme" className="w-full md:w-[280px]">
                  <SelectValue placeholder="اختر سمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">فاتح</SelectItem>
                  <SelectItem value="dark">داكن</SelectItem>
                  <SelectItem value="system">النظام</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button>حفظ التغييرات</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>التفضيلات العامة</CardTitle>
            <CardDescription>إدارة الإعدادات العامة للتطبيق.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Select defaultValue="mad" dir="rtl">
                <SelectTrigger id="currency" className="w-full md:w-[280px]">
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mad">MAD - درهم مغربي</SelectItem>
                  <SelectItem value="usd">USD - دولار أمريكي</SelectItem>
                  <SelectItem value="eur">EUR - يورو</SelectItem>
                  <SelectItem value="sar">SAR - ريال سعودي</SelectItem>
                  <SelectItem value="aed">AED - درهم إماراتي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
           <CardFooter>
            <Button>حفظ التفضيلات</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
