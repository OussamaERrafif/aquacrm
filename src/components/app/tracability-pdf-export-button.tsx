
'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Tracability } from '@prisma/client';

// Local extended type to include the new `tracabilityDate` field until Prisma client types are fully in sync
type TracabilityWithDate = Tracability & { tracabilityDate?: Date | string | null };

interface TracabilityPDFExportButtonProps {
  tracabilityEntries: TracabilityWithDate[];
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function TracabilityPDFExportButton({ tracabilityEntries }: TracabilityPDFExportButtonProps) {
  const handleExport = async () => {
    console.log('Attempting to create new jsPDF instance...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    console.log('jsPDF instance created:', pdf);

    // Add Amiri font - Temporarily commented out for debugging
    // pdf.addFileToVFS('Amiri-Regular.ttf', amiriFont.split(',')[1]);
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

    // Title
    pdf.setFontSize(14);
    pdf.text('Traceability Report', 10, 40);

    // Table
  const tableColumn = ["Mareyeur Code", "Mareyeur Name", "Date", "Weight Purchased", "Weight Sold"];
    const tableRows: (string | number)[][] = [];

  tracabilityEntries.forEach(entry => {
    const entryData = [
      entry.codeMareyeur,
      entry.nomMareyeur,
      entry.tracabilityDate ? new Date(entry.tracabilityDate).toLocaleDateString() : '',
      entry.poidsAchete,
      entry.poidsVendu
    ];
    tableRows.push(entryData);
  });

    autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { font: 'Amiri', halign: 'center' },
    });

    pdf.save(`tracability-report.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
