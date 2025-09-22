
'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Fish } from '@/lib/types';
import { amiriFont } from '@/lib/fonts';

interface ProductPDFExportButtonProps {
  products: Fish[];
}


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function ProductPDFExportButton({ products }: ProductPDFExportButtonProps) {
  const handleExport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    // Add Amiri font
    pdf.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    pdf.setFont('Amiri');
    pdf.setFont('Amiri');

    // Add Logo
    const logoUrl = 'https://i.imgur.com/R81Lg2b.png';
    const logoResponse = await fetch(logoUrl);
    const logo = await logoResponse.blob();
    const logoDataUrl = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logo);
    });
    pdf.addImage(logoDataUrl, 'PNG', 10, 10, 40, 20);

    // Header
    pdf.setFontSize(18);
    pdf.text('AquaTrade CRM', 150, 20);
    pdf.setFontSize(10);
    pdf.text('123 Fishery Road, Ocean City, 12345', 150, 26);

    // Title
    pdf.setFontSize(14);
    pdf.text('Products Catalog', 10, 40);

    // Table
    const tableColumn = ["Name", "Category", "Price", "Stock", "Status"];
    const tableRows: (string | number)[][] = [];

    products.forEach(product => {
        const productData = [
            product.name,
            product.category,
            `${product.price.toFixed(2)} MAD`,
            `${product.stock} kg`,
            product.status
        ];
        tableRows.push(productData);
    });

    autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { font: 'Amiri', halign: 'center' },
    });

    pdf.save(`products-catalog.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
