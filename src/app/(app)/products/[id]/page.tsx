
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { fish } from '@/lib/data';
import { ArrowLeft, Edit, Package, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = fish.find((f) => f.id === params.id);

  if (!product) {
    notFound();
  }

  const getStatusColor = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
    }
  };

  const stockPercentage = product.stock > 0 ? (product.stock / (product.stock + product.minStock * 1.5)) * 100 : 0;


  return (
    <>
      <PageHeader 
        title={product.name} 
        action={
            <div className="flex gap-2">
                <Button variant="outline" asChild>
                    <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" />Back to Products</Link>
                </Button>
                <Button>
                    <Edit className="mr-2 h-4 w-4" />Edit Product
                </Button>
            </div>
        }
      >
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <Package className="h-4 w-4" /> 
            {product.category}
        </p>
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
             <Card className="overflow-hidden">
                <div className="relative h-80 w-full">
                    <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                        data-ai-hint={product.imageHint}
                    />
                </div>
                <CardFooter className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground w-full text-center">Image of {product.name}</p>
                </CardFooter>
            </Card>
        </div>
        <div className="md:col-span-2">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>Product Details</CardTitle>
                        {product.id === 'F002' ? <TrendingUp className="h-6 w-6 text-green-500" /> : <TrendingDown className="h-6 w-6 text-yellow-500" />}
                    </div>
                    <CardDescription>All information about this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Price per kg</h3>
                            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                            <Badge className={cn("text-base", getStatusColor(product.status))}>{product.status}</Badge>
                        </div>
                    </div>
                     <Separator />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Inventory Details</h3>
                        <div className="space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Stock</span>
                                <span>{product.stock} kg</span>
                            </div>
                            <Progress value={stockPercentage} />
                             <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0 kg</span>
                                <span>Minimum Stock: {product.minStock} kg</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Supplier Information</h3>
                         <p className="text-sm">
                            <span className="text-muted-foreground">Supplier: </span>
                            {product.supplier}
                         </p>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
