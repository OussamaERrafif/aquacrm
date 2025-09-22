
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fish } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { PlusCircle, Search, Filter, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProductsPage() {

  const getStatusColor = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
    }
  }

  const getStatusArabic = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    switch (status) {
      case 'In Stock':
        return 'متوفر';
      case 'Low Stock':
        return 'مخزون منخفض';
      case 'Out of Stock':
        return 'نفذ المخزون';
    }
  }
  
  const categories = [...new Set(fish.map(f => f.category))];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];


  return (
    <>
      <PageHeader 
        title="كتالوج المنتجات"
        action={
            <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة منتج
            </Button>
        }
       >
        <p className="text-sm text-muted-foreground mt-2">تصفح وأدر مخزونك من المأكولات البحرية</p>
      </PageHeader>

      <Card className="mb-6">
        <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="بحث عن منتجات..." className="pr-10" />
                </div>
                <div className="flex gap-4">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full md:w-auto">
                                <Filter className="ml-2 h-4 w-4" />
                                كل الفئات
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {categories.map(c => <DropdownMenuCheckboxItem key={c}>{c}</DropdownMenuCheckboxItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="outline" className="w-full md:w-auto">
                                <Filter className="ml-2 h-4 w-4" />
                                كل الحالات
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {statuses.map(s => <DropdownMenuCheckboxItem key={s}>{getStatusArabic(s as any)}</DropdownMenuCheckboxItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fish.map((f, index) => (
          <Card key={f.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
                <Link href={`/products/${f.id}`} className="block relative h-48 w-full">
                    <Image 
                        src={f.imageUrl} 
                        alt={f.name} 
                        fill
                        className="object-cover"
                        data-ai-hint={f.imageHint}
                    />
                </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold hover:underline">
                        <Link href={`/products/${f.id}`}>{f.name}</Link>
                    </h3>
                    {index % 2 === 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-yellow-500" />}
                </div>
              <p className="text-sm text-muted-foreground">{f.category}</p>
              
              <div className="flex justify-between items-center mt-4">
                <Badge className={cn("text-xs", getStatusColor(f.status))}>{getStatusArabic(f.status)}</Badge>
                <p className="text-lg font-semibold">{f.price.toFixed(2)} د.م./كغ</p>
              </div>

               <div className="text-sm text-muted-foreground mt-2 space-y-1">
                    <p>المخزون: {f.stock} كغ</p>
                    <p>الحد الأدنى: {f.minStock} كغ</p>
                    <p>المورد: {f.supplier}</p>
                </div>

            </CardContent>
             <CardFooter className="p-4 bg-muted/50">
                 <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link href={`/products/${f.id}`}>عرض التفاصيل <ArrowLeft className="mr-2 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
