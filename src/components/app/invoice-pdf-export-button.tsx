'use client';

import { Button } from '@/components/ui/button';
import { amiriFont } from '@/lib/fonts';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Invoice } from '@/lib/types';

interface InvoicePDFExportButtonProps {
  invoice: Invoice;
  cardId?: string;
}

// Extend jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function InvoicePDFExportButton({ invoice }: InvoicePDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Création de la facture PDF professionnelle...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Add Amiri font - commented out
    // try {
    //   const base64AmiriFont = amiriFont.replace(/^data:font\/ttf;base64,/, '');
    //   pdf.addFileToVFS('Amiri-Regular.ttf', base64AmiriFont);
    //   pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    //   pdf.setFont('Amiri');
    // } catch (error) {
    //   console.warn('Could not load Amiri font, using default font');
    //   pdf.setFont('helvetica');
    // }
    pdf.setFont('helvetica');

    // Logo section (commented out as requested)
    // const logoUrl = 'https://i.imgur.com/R81Lg2b.png';
    // const logoResponse = await fetch(logoUrl);
    // const logo = await logoResponse.blob();
    // const logoDataUrl = await new Promise<string>(resolve => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result as string);
    //     reader.readAsDataURL(logo);
    // });
    // pdf.addImage(logoDataUrl, 'PNG', 15, 15, 35, 18);

    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('FACTURE', pageWidth - 15, 25, { align: 'right' });
    
    // Company Information
    pdf.setFontSize(16);
    pdf.text('AquaTrade CRM', 15, 25);
    pdf.setFontSize(10);
    pdf.text('123 Rue de la Pêcherie', 15, 32);
    pdf.text('Océan City, 12345', 15, 37);
    pdf.text('Téléphone: +212 XXX XXX XXX', 15, 42);
    pdf.text('Email: info@aquatrade.ma', 15, 47);

    // Draw header separator line
    pdf.setLineWidth(0.5);
    pdf.line(15, 55, pageWidth - 15, 55);

    // Invoice Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détails de la facture:', 15, 68);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Numéro de facture: ${invoice.invoiceNumber}`, 15, 76);
    pdf.text(`Date de facture: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 15, 82);
    pdf.text(`Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, 15, 88);

    // Bill To Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Facturer à:', pageWidth - 15, 68, { align: 'right' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(invoice.party.name, pageWidth - 15, 76, { align: 'right' });
    if (invoice.party.company) {
      pdf.text(invoice.party.company, pageWidth - 15, 82, { align: 'right' });
    }
    if (invoice.party.address) {
      pdf.text(invoice.party.address, pageWidth - 15, 88, { align: 'right' });
    }

    // Items Table
    const tableColumn = ["Description", "Longueur", "Poids (kg)", "Prix/kg", "Montant"];
    const tableRows: (string | number)[][] = [];

    invoice.items.forEach(item => {
        const itemData = [
            `${item.fish.name} (${item.fish.category})`,
            `${item.length} cm`,
            item.weight.toFixed(2),
            `${item.pricePerKilo.toFixed(2)} MAD`,
            `${(item.weight * item.pricePerKilo).toFixed(2)} MAD`
        ];
        tableRows.push(itemData);
    });

    // Validate tableRows
    if (tableRows.length === 0) {
      console.error('Aucun article disponible pour la facture.');
      return;
    }

    try {
      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        theme: 'grid',
        headStyles: { 
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.5,
          lineColor: [0, 0, 0]
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.1,
          lineColor: [128, 128, 128]
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        columnStyles: { 
          0: { halign: 'left', cellWidth: 60 },
          1: { halign: 'center', cellWidth: 25 },
          2: { halign: 'center', cellWidth: 30 },
          3: { halign: 'right', cellWidth: 35 },
          4: { halign: 'right', cellWidth: 35 }
        },
        styles: {
          fontSize: 9,
          cellPadding: 4
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du tableau avec autoTable:', error);
      return;
    }

    // Calculate totals section position
    const finalY = (pdf as any).lastAutoTable.finalY || 140;
    const totalsStartY = finalY + 15;

    // Draw line above totals
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth - 80, totalsStartY - 5, pageWidth - 15, totalsStartY - 5);

    // Totals Section
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Subtotal
    pdf.text('Sous-total:', pageWidth - 60, totalsStartY);
    pdf.text(`${invoice.totalAmount.toFixed(2)} MAD`, pageWidth - 15, totalsStartY, { align: 'right' });
    
    // Tax
    pdf.text('Taxe (0%):', pageWidth - 60, totalsStartY + 8);
    pdf.text('0,00 MAD', pageWidth - 15, totalsStartY + 8, { align: 'right' });
    
    // Draw line above total
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth - 80, totalsStartY + 12, pageWidth - 15, totalsStartY + 12);
    
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Total:', pageWidth - 60, totalsStartY + 20);
    pdf.text(`${invoice.totalAmount.toFixed(2)} MAD`, pageWidth - 15, totalsStartY + 20, { align: 'right' });

    // Footer with stamp and signature boxes
    pdf.setLineWidth(0.3);
    pdf.line(15, pageHeight - 60, pageWidth - 15, pageHeight - 60);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Merci pour votre confiance !', pageWidth / 2, pageHeight - 50, { align: 'center' });
    
    // Stamp box
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.rect(15, pageHeight - 40, 60, 25);
    pdf.text('Cachet de l\'entreprise', 45, pageHeight - 35, { align: 'center' });
    
    // Signature box
    pdf.rect(pageWidth - 75, pageHeight - 40, 60, 25);
    pdf.text('Signature', pageWidth - 45, pageHeight - 35, { align: 'center' });

    // Save the PDF
    pdf.save(`facture-${invoice.invoiceNumber}.pdf`);
    console.log('Facture PDF générée avec succès!');
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}