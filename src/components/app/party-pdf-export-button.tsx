'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { amiriFont } from '@/lib/fonts';
import { Party, Invoice } from '@/lib/types';

interface PartyWithRelations extends Party {
    invoices: Invoice[];
}

interface PartyPDFExportButtonProps {
  party: PartyWithRelations;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function PartyPDFExportButton({ party }: PartyPDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Création du rapport client PDF professionnel...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Add Amiri font - commented out
    // pdf.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    // pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    // pdf.setFont('Amiri');
    pdf.setFont('helvetica');

    // Logo section (commented out as requested)
    // const logoUrl = 'https://i.imgur.com/R81Lg2b.png';
    // const logoResponse = await fetch(logoUrl);
    // const logo = await logoResponse.blob();
    // const logoDataUrl = await new Promise<string>((resolve, reject) => {
    //   const img = new Image();
    //   img.crossOrigin = 'Anonymous';
    //   img.src = logoUrl;
    //   img.onload = () => {
    //     try {
    //       const canvas = document.createElement('canvas');
    //       canvas.width = img.width;
    //       canvas.height = img.height;
    //       const ctx = canvas.getContext('2d');
    //       if (ctx) {
    //         ctx.drawImage(img, 0, 0);
    //         resolve(canvas.toDataURL('image/png'));
    //       } else {
    //         reject(new Error('Canvas context is null'));
    //       }
    //     } catch (error) {
    //       reject(error);
    //     }
    //   };
    //   img.onerror = (err) => {
    //     if (err instanceof Event) {
    //       reject(new Error('Failed to load logo image due to an event error.'));
    //     } else {
    //       reject(new Error(`Failed to load logo image: ${err}`));
    //     }
    //   };
    // });
    // pdf.addImage(logoDataUrl, 'PNG', 15, 15, 35, 18);

    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 0);
    pdf.text('RAPPORT CLIENT', pageWidth - 15, 25, { align: 'right' });
    
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

    // Client Details Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Informations du client:', 15, 68);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Nom: ${party.name}`, 15, 76);
    pdf.text(`Entreprise: ${party.company || 'N/A'}`, 15, 82);
    pdf.text(`Email: ${party.email || 'N/A'}`, 15, 88);
    pdf.text(`Téléphone: ${party.phone || 'N/A'}`, 15, 94);
    pdf.text(`Adresse: ${party.address || 'N/A'}`, 15, 100);

    // Transaction History Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Historique des transactions:', 15, 115);

    // Transaction History Table
    const tableColumn = ["Date", "Description", "Débit", "Crédit", "Solde"];
    const tableRows: (string | number)[][] = [];
    let currentBalance = 0;

    if (party.invoices.length > 0) {
      party.invoices.forEach(inv => {
        let debit = 0;
        let credit = 0;
        if (inv.type === 'sell') {
          debit = inv.totalAmount;
          currentBalance += debit;
        } else {
          credit = inv.totalAmount;
          currentBalance -= credit;
        }
        const transactionData = [
          new Date(inv.date).toLocaleDateString('fr-FR'),
          `Facture #${inv.invoiceNumber}`,
          debit > 0 ? `${debit.toFixed(2)} MAD` : '-',
          credit > 0 ? `${credit.toFixed(2)} MAD` : '-',
          `${currentBalance.toFixed(2)} MAD`
        ];
        tableRows.push(transactionData);
      });
    } else {
      tableRows.push(['Aucune transaction', '-', '-', '-', '0,00 MAD']);
    }

    // Validate tableRows
    if (tableRows.length === 0) {
      console.error('Aucune transaction disponible pour ce client.');
      return;
    }

    try {
      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 125,
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
          0: { halign: 'center', cellWidth: 25 },
          1: { halign: 'left', cellWidth: 60 },
          2: { halign: 'right', cellWidth: 30 },
          3: { halign: 'right', cellWidth: 30 },
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

    // Calculate final balance section position
    const finalY = (pdf as any).lastAutoTable.finalY || 160;
    const balanceStartY = finalY + 15;

    // Draw line above balance
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth - 80, balanceStartY - 5, pageWidth - 15, balanceStartY - 5);

    // Final Balance Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Solde final:', pageWidth - 70, balanceStartY);
    pdf.text(`${currentBalance.toFixed(2)} MAD`, pageWidth - 15, balanceStartY, { align: 'right' });

    // Summary Section
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Nombre total de transactions: ${party.invoices.length}`, 15, balanceStartY + 15);
    
    const totalDebit = party.invoices
      .filter(inv => inv.type === 'sell')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCredit = party.invoices
      .filter(inv => inv.type !== 'sell')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    pdf.text(`Total débité: ${totalDebit.toFixed(2)} MAD`, 15, balanceStartY + 22);
    pdf.text(`Total crédité: ${totalCredit.toFixed(2)} MAD`, 15, balanceStartY + 29);

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
    pdf.save(`rapport-client-${party.name}.pdf`);
    console.log('Rapport client PDF généré avec succès!');
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}