
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  return (
    <>
      <PageHeader title="حسابي" />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ملف التعريف</CardTitle>
            <CardDescription>قم بتحديث معلومات ملفك الشخصي هنا.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" defaultValue="مستخدم AquaTrade" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" defaultValue="user@aquatrade.com" disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button>حفظ التغييرات</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>كلمة المرور</CardTitle>
            <CardDescription>قم بتغيير كلمة المرور الخاصة بك. يوصى باستخدام كلمة مرور قوية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">كلمة المرور الحالية</Label>
              <Input id="current-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <Input id="new-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>تغيير كلمة المرور</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
