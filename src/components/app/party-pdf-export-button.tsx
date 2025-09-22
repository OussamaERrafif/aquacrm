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
    const pdf = new jsPDF('p', 'mm', 'a4');

// Add Amiri font
// pdf.addFileToVFS('Amiri-Regular.ttf', amiriFont);
// pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
// pdf.setFont('Amiri');

// Debugging logs for amiriFont and logoDataUrl
console.debug('amiriFont:', amiriFont);

    // Add Logo
    const logoUrl = 'https://i.imgur.com/R81Lg2b.png';
    const logoResponse = await fetch(logoUrl);
    const logo = await logoResponse.blob();
    // Fix for Base64 encoding of the logo
    const logoDataUrl = await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = logoUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Canvas context is null'));
          }
        } catch (error) {
          reject(error);
        }
      };
      // Fix for img.onerror type issue
      img.onerror = (err) => {
        if (err instanceof Event) {
          reject(new Error('Failed to load logo image due to an event error.'));
        } else {
          reject(new Error(`Failed to load logo image: ${err}`));
        }
      };
    });

    // Debugging log for logoDataUrl
    console.debug('logoDataUrl:', logoDataUrl);

    // Ensure amiriFont is properly Base64 encoded
    if (!amiriFont || typeof amiriFont !== 'string' || !/^data:font\/.*;base64,/.test(amiriFont)) {
      console.error('Invalid Amiri font data. Ensure the font is properly Base64 encoded and prefixed with "data:font/...;base64,".');
      return;
    }

    // Ensure logoDataUrl is properly Base64 encoded
    if (!logoDataUrl || typeof logoDataUrl !== 'string' || !/^data:image\/.*;base64,/.test(logoDataUrl)) {
      console.error('Invalid logo data URL. Ensure the logo is properly Base64 encoded and prefixed with "data:image/...;base64,".');
      return;
    }
    pdf.addImage(logoDataUrl, 'PNG', 10, 10, 40, 20);

    // Header
    pdf.setFontSize(18);
    pdf.text('AquaTrade CRM', 150, 20);
    pdf.setFontSize(10);
    pdf.text('123 Fishery Road, Ocean City, 12345', 150, 26);

    // Party Details
    pdf.setFontSize(12);
    pdf.text(`Party Report - ${party.name}`, 10, 40);
    pdf.text(`Company: ${party.company || 'N/A'}`, 10, 46);
    pdf.text(`Email: ${party.email || 'N/A'}`, 10, 52);
    pdf.text(`Phone: ${party.phone || 'N/A'}`, 10, 58);
    pdf.text(`Address: ${party.address || 'N/A'}`, 10, 64);

    // Transaction History
    const tableColumn = ["Date", "Description", "Debit", "Credit", "Balance"];
    // Handle empty table rows gracefully
    const tableRows: (string | number)[][] = [];
    let currentBalance = 0; // Initialize at the top of the function
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
          new Date(inv.date).toLocaleDateString(),
          `Invoice #${inv.invoiceNumber}`,
          debit > 0 ? `${debit.toFixed(2)} MAD` : '-',
          credit > 0 ? `${credit.toFixed(2)} MAD` : '-',
          `${currentBalance.toFixed(2)} MAD`
        ];
        tableRows.push(transactionData);
      });
    } else {
      tableRows.push(['-', '-', '-', '-', '-']);
    }

    autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { font: 'Amiri', halign: 'center' },
        columnStyles: { 1: { halign: 'left' } },
    });

    // Final Balance
    const finalY = (pdf as any).lastAutoTable.finalY || 130;
    pdf.setFontSize(14);
    pdf.text('Final Balance:', 140, finalY + 10);
    // Update the final balance section
    pdf.text(`${currentBalance.toFixed(2)} MAD`, 170, finalY + 10);

    pdf.save(`party-${party.name}-report.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
