
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fish } from '@/lib/data';

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Our Products" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fish.map((f) => (
          <Card key={f.id}>
            <CardHeader>
              <CardTitle>{f.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Type: {f.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
