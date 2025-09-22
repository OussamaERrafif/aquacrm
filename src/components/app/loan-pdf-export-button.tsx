
'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Loan } from '@/lib/types';

interface LoanPDFExportButtonProps {
  loan: Loan;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function LoanPDFExportButton({ loan }: LoanPDFExportButtonProps) {
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

    // Loan Details
    pdf.setFontSize(12);
    pdf.text(`Loan #${loan.loanId}`, 10, 40);
    pdf.text(`Fisher: ${loan.fisher.name}`, 10, 46);
    pdf.text(`Amount: ${loan.amount.toLocaleString()} MAD`, 10, 52);
    pdf.text(`Disbursement Date: ${new Date(loan.disbursementDate).toLocaleDateString()}`, 10, 58);
    pdf.text(`Repayment Schedule: ${loan.repaymentSchedule}`, 10, 64);
    pdf.text(`Outstanding Balance: ${loan.outstandingBalance.toLocaleString()} MAD`, 10, 70);
    pdf.text(`Status: ${loan.status}`, 10, 76);

    // Repayment History
    pdf.setFontSize(14);
    pdf.text('Repayment History', 10, 90);
    pdf.setFontSize(12);
    pdf.text('No repayment history available yet.', 10, 96);

    pdf.save(`loan-${loan.loanId}.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Printer className="ml-2 h-4 w-4" />
      طباعة
    </Button>
  );
}
