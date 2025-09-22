'use client';

import { Button } from '@/components/ui/button';
import { amiriFont } from '@/lib/fonts';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Invoice } from '@/lib/types';

interface InvoicePDFExportButtonProps {
  invoice: Invoice;
}

// Extend jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function InvoicePDFExportButton({ invoice }: InvoicePDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Attempting to create new jsPDF instance...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    console.log('jsPDF instance created:', pdf);

    // Add Amiri font - Temporarily commented out for debugging
    // const base64AmiriFont = amiriFont.replace(/^data:font\/ttf;base64,/, '');
    // pdf.addFileToVFS('Amiri-Regular.ttf', base64AmiriFont);
    // pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    // pdf.setFont('Amiri');

    // Add Logo - Temporarily commented out for debugging
    // const logoUrl = 'https://i.imgur.com/R81Lg2b.png';
    // const logoResponse = await fetch(logoUrl);
    // const logo = await logoResponse.blob();
    // const logoDataUrl = await new Promise<string>(resolve => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result as string);
    //     reader.readAsDataURL(logo);
    // });
    // pdf.addImage(logoDataUrl, 'PNG', 10, 10, 40, 20);

    console.log('Setting font size for header...');
    pdf.setFontSize(18);
    pdf.text('AquaTrade CRM', 150, 20);
    pdf.setFontSize(10);
    pdf.text('123 Fishery Road, Ocean City, 12345', 150, 26);

    // Invoice Details
    pdf.setFontSize(12);
    pdf.text(`Invoice #${invoice.invoiceNumber}`, 10, 40);
    pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 10, 46);
    pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 10, 52);

    // Bill To
    pdf.text('Bill To:', 10, 62);
    pdf.text(invoice.party.name, 10, 68);
    pdf.text(invoice.party.company || '', 10, 74);
    pdf.text(invoice.party.address || '', 10, 80);

    // Table
    const tableColumn = ["Item", "Length", "Weight (kg)", "Price/kg", "Total"];
    const tableRows: (string | number)[][] = [];

    invoice.items.forEach(item => {
        const itemData = [
            `${item.fish.name} (${item.fish.category})`,
            item.length,
            item.weight,
            `${item.pricePerKilo.toFixed(2)} MAD`,
            (item.weight * item.pricePerKilo).toFixed(2) + ' MAD'
        ];
        tableRows.push(itemData);
    });

    // Debugging: Log tableColumn and tableRows
    console.log('Table Columns:', tableColumn);
    console.log('Table Rows:', tableRows);

    // Validate tableRows
    if (tableRows.length === 0) {
      console.error('No data available for the table.');
      return;
    }

    try {
      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { font: 'Amiri', halign: 'center' },
        columnStyles: { 0: { halign: 'left' } },
      });
    } catch (error) {
      console.error('Error generating table with autoTable:', error);
      return;
    }

    // Total
    const finalY = (pdf as any).lastAutoTable.finalY || 140;
    pdf.setFontSize(12);
    pdf.text('Subtotal:', 150, finalY + 10);
    pdf.text(`${invoice.totalAmount.toFixed(2)} MAD`, 180, finalY + 10);
    pdf.text('Tax (0%):', 150, finalY + 16);
    pdf.text('0.00 MAD', 180, finalY + 16);
    pdf.setFontSize(14);
    pdf.text('Total:', 150, finalY + 22);
    pdf.text(`${invoice.totalAmount.toFixed(2)} MAD`, 180, finalY + 22);

    // Footer
    pdf.setFontSize(10);
    pdf.text('Thank you for your business!', 10, pdf.internal.pageSize.height - 10);

    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
