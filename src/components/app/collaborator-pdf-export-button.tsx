'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { amiriFont } from '@/lib/fonts';
import { Collaborator, ChargesInvoice } from '@/lib/types';

interface CollaboratorWithRelations extends Collaborator {
    chargesInvoices: ChargesInvoice[];
}

interface CollaboratorPDFExportButtonProps {
  collaborator: CollaboratorWithRelations;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function CollaboratorPDFExportButton({ collaborator }: CollaboratorPDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Création du rapport collaborateur PDF professionnel...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Add Amiri font - commented out
    // pdf.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    // pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    // pdf.setFont('Amiri');
    pdf.setFont('helvetica');

    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('RAPPORT COLLABORATEUR', pageWidth - 15, 25, { align: 'right' });
    
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

    // Collaborator Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Informations du collaborateur:', 15, 68);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Nom: ${collaborator.name}`, 15, 76);
    pdf.text(`Email: ${collaborator.email || 'N/A'}`, 15, 82);
    pdf.text(`Téléphone: ${collaborator.phone || 'N/A'}`, 15, 88);
    pdf.text(`Adresse: ${collaborator.address || 'N/A'}`, 15, 94);

    // Charges Invoices History Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Historique des factures de frais:', 15, 109);

    // Charges Invoices History Table
    const tableColumn = ["Date", "Numéro de facture", "Montant total", "Statut"];
    const tableRows: (string | number)[][] = [];

    if (collaborator.chargesInvoices.length > 0) {
      collaborator.chargesInvoices.forEach(ci => {
        const chargesInvoiceData = [
          new Date(ci.date).toLocaleDateString('fr-FR'),
          ci.invoiceNumber,
          `${ci.totalAmount.toFixed(2)} MAD`,
          ci.status,
        ];
        tableRows.push(chargesInvoiceData);
      });
    } else {
      tableRows.push(['Aucune facture de frais', '-', '-', '-']);
    }

    // Validate tableRows
    if (tableRows.length === 0) {
      console.error('Aucune facture de frais disponible pour ce collaborateur.');
      return;
    }

    try {
      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 119,
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
          0: { halign: 'center', cellWidth: 35 },
          1: { halign: 'left', cellWidth: 60 },
          2: { halign: 'right', cellWidth: 45 },
          3: { halign: 'center', cellWidth: 45 },
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

    // Calculate final section position
    const finalY = (pdf as any).lastAutoTable.finalY || 160;

    // Footer with stamp and signature boxes
    pdf.setLineWidth(0.3);
    pdf.line(15, pageHeight - 60, pageWidth - 15, pageHeight - 60);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Rapport généré le ' + new Date().toLocaleDateString('fr-FR'), pageWidth / 2, pageHeight - 50, { align: 'center' });
    
    // Stamp box
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.rect(15, pageHeight - 40, 60, 25);
    pdf.text('Cachet de l\'entreprise', 45, pageHeight - 35, { align: 'center' });
    
    // Signature box
    pdf.rect(pageWidth - 75, pageHeight - 40, 60, 25);
    pdf.text('Signature', pageWidth - 45, pageHeight - 35, { align: 'center' });

    // Save the PDF
    pdf.save(`rapport-collaborateur-${collaborator.name}.pdf`);
    console.log('Rapport collaborateur PDF généré avec succès!');
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
