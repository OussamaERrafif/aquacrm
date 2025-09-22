import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function FinancingPage() {
  return (
    <>
      <PageHeader title="التمويل" />
      <Card className="text-center">
        <CardHeader>
          <CardTitle>إدارة التمويل والائتمan</CardTitle>
          <CardDescription>
            تتم إدارة خيارات التمويل وحدود الائتمan والشروط ضمن ملفات الأطراف الفردية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            يرجى الانتقال إلى قسم <Link href="/parties" className="text-primary underline">الأطراف</Link> لعرض أو تعديل تفاصيل التمويل.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
