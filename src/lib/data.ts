import { prisma } from '@/lib/prisma';
import type { Invoice, Loan } from './types';

// This file is now empty as the application is connected to the database.
// The data is fetched from the API routes which use Prisma.
// The data is fetched from the API routes which use Prisma.

export const parties: Person[] = [];
export const buyers: Buyer[] = [];
export const sellers: Seller[] = [];
export const fish: Fish[] = [];
export const invoices: Invoice[] = [];
export const loans: Loan[] = [];


export async function getInvoices() {
    return prisma.invoice.findMany({
        include: {
            party: true,
            items: {
                include: {
                    fish: true
                }
            }
        },
        orderBy: {
            date: 'desc',
        }
    });
}

export async function getLoans() {
    return prisma.loan.findMany({
        include: {
            fisher: true
        },
        orderBy: {
            disbursementDate: 'desc'
        }
    });
}
