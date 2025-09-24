'use client';

import { Button } from '@/components/ui/button';
import { amiriFont } from '@/lib/fonts';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { ChargesInvoice } from '@/lib/types';

interface ChargesInvoicePDFExportButtonProps {
  chargesInvoice: ChargesInvoice;
  cardId?: string;
}

// Extend jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function ChargesInvoicePDFExportButton({ chargesInvoice }: ChargesInvoicePDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Création de la facture de frais PDF professionnelle...');
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

    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('FACTURE DE FRAIS', pageWidth - 15, 25, { align: 'right' });
    
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

    // Charges Invoice Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détails de la facture de frais:', 15, 68);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Numéro de facture: ${chargesInvoice.invoiceNumber}`, 15, 76);
    pdf.text(`Date de facture: ${new Date(chargesInvoice.date).toLocaleDateString('fr-FR')}`, 15, 82);

    // Collaborator Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Collaborateur:', pageWidth - 15, 68, { align: 'right' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(chargesInvoice.collaborator.name, pageWidth - 15, 76, { align: 'right' });
    if (chargesInvoice.collaborator.address) {
      pdf.text(chargesInvoice.collaborator.address, pageWidth - 15, 82, { align: 'right' });
    }
    if (chargesInvoice.collaborator.email) {
      pdf.text(chargesInvoice.collaborator.email, pageWidth - 15, 88, { align: 'right' });
    }

    // Charges Table
    const tableColumn = ["Description", "Montant"];
    const tableRows: (string | number)[][] = [];

    chargesInvoice.charges.forEach(charge => {
        const chargeData = [
            charge.title,
            `${charge.price.toFixed(2)} MAD`,
        ];
        tableRows.push(chargeData);
    });

    // Validate tableRows
    if (tableRows.length === 0) {
      console.error('Aucun frais disponible pour la facture.');
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
          0: { halign: 'left', cellWidth: 130 },
          1: { halign: 'right', cellWidth: 55 },
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
    
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Total:', pageWidth - 60, totalsStartY + 20);
    pdf.text(`${chargesInvoice.totalAmount.toFixed(2)} MAD`, pageWidth - 15, totalsStartY + 20, { align: 'right' });

    // Save the PDF
    pdf.save(`facture-frais-${chargesInvoice.invoiceNumber}.pdf`);
    console.log('Facture de frais PDF générée avec succès!');
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
