import { prisma } from '@/lib/prisma';
import type { Invoice, Loan, Party, Person, Buyer, Seller, Fish, Collaborator, ChargesInvoice } from './types';
import { PartyType } from '@prisma/client';

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

export async function getParty(id: string) {
    return prisma.party.findUnique({
        where: { id },
        include: {
            invoices: {
                orderBy: {
                    date: 'desc'
                }
            },
            loans: {
                orderBy: {
                    disbursementDate: 'desc'
                }
            },
        }
    });
}

export async function getParties(includeInvoices = false, type?: PartyType) {
    return prisma.party.findMany({
        where: {
            ...(type && { type: type }),
        },
        include: {
            invoices: includeInvoices,
        }
    });
}

export async function getCollaborators(includeChargesInvoices = false) {
    return prisma.collaborator.findMany({
        include: {
            chargesInvoices: includeChargesInvoices,
        }
    });
}

export async function getCollaborator(id: string) {
    return prisma.collaborator.findUnique({
        where: { id },
        include: {
            chargesInvoices: {
                include: {
                    charges: true,
                },
                orderBy: {
                    date: 'desc'
                }
            },
        }
    });
}