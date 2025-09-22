import type { Buyer, Seller, Fish, Invoice, Loan, Person } from './types';

export const parties: Person[] = [
  { id: 'P001', name: 'Global Seafoods Inc.', company: 'Global Seafoods Inc.', email: 'contact@globalseafoods.com', phone: '123-456-7890', address: '123 Ocean Ave, Seattle, WA' },
  { id: 'P002', name: 'The Fish Market', company: 'The Fish Market', email: 'orders@thefishmarket.com', phone: '234-567-8901', address: '456 Dock St, San Francisco, CA' },
  { id: 'P003', name: 'Ocean\'s Bounty', company: 'Ocean\'s Bounty', email: 'info@oceansbounty.net', phone: '345-678-9012', address: '789 Port Rd, Miami, FL' },
  { id: 'P004', name: 'Alaskan King Fishery', company: 'Alaskan King Fishery', email: 'sales@akfishery.com', phone: '456-789-0123', address: '1 Fishery Ln, Anchorage, AK' },
  { id: 'P005', name: 'Gulf Coast Catch', company: 'Gulf Coast Catch', email: 'contact@gulfcatch.com', phone: '567-890-1234', address: '2 Shrimp Blvd, New Orleans, LA' },
  { id: 'P006', name: 'Pacific Tuna Fleet', company: 'Pacific Tuna Fleet', email: 'fleet@pacifictuna.com', phone: '678-901-2345', address: '3 Tuna Pier, San Diego, CA' },
];

export const buyers: Buyer[] = parties.slice(0, 3);
export const sellers: Seller[] = parties.slice(3, 6);

export const fish: Fish[] = [
  { id: 'F001', name: 'Salmon', type: 'King' },
  { id: 'F002', name: 'Tuna', type: 'Bluefin' },
  { id: 'F003', name: 'Cod', type: 'Atlantic' },
  { id: 'F004', name: 'Halibut', type: 'Pacific' },
  { id: 'F005', name: 'Mahi-mahi', type: 'Common' },
  { id: 'F006', name: 'Snapper', type: 'Red' },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-001', invoiceNumber: '2024-001', type: 'sell', date: '2024-07-15', dueDate: '2024-08-14', party: parties[0],
    items: [
      { id: 'I001', fish: fish[0], length: 75, weight: 10, pricePerKilo: 25, total: 250 },
      { id: 'I002', fish: fish[1], length: 150, weight: 50, pricePerKilo: 40, total: 2000 },
    ],
    totalAmount: 2250, status: 'Paid',
  },
  {
    id: 'INV-002', invoiceNumber: '2024-002', type: 'buy', date: '2024-07-18', dueDate: '2024-08-17', party: parties[4],
    items: [
      { id: 'I003', fish: fish[5], length: 40, weight: 5, pricePerKilo: 15, total: 75 },
    ],
    totalAmount: 75, status: 'Unpaid',
  },
  {
    id: 'INV-003', invoiceNumber: '2024-003', type: 'sell', date: '2024-07-20', dueDate: '2024-08-19', party: parties[1],
    items: [
      { id: 'I004', fish: fish[2], length: 60, weight: 8, pricePerKilo: 18, total: 144 },
    ],
    totalAmount: 144, status: 'Unpaid',
  },
  {
    id: 'INV-004', invoiceNumber: '2024-004', type: 'sell', date: '2024-06-10', dueDate: '2024-07-10', party: parties[2],
    items: [
      { id: 'I005', fish: fish[3], length: 120, weight: 30, pricePerKilo: 22, total: 660 },
    ],
    totalAmount: 660, status: 'Overdue',
  },
   {
    id: 'INV-005', invoiceNumber: '2024-005', type: 'buy', date: '2024-05-01', dueDate: '2024-05-31', party: parties[3],
    items: [
      { id: 'I006', fish: fish[0], length: 80, weight: 12, pricePerKilo: 23, total: 276 },
    ],
    totalAmount: 276, status: 'Paid',
  },
];

export const loans: Loan[] = [
  { id: 'L001', loanId: 'LN-2024-001', fisher: sellers[0], amount: 15000, disbursementDate: '2024-01-15', repaymentSchedule: 'Monthly', outstandingBalance: 8500, status: 'Active' },
  { id: 'L002', loanId: 'LN-2024-002', fisher: sellers[2], amount: 25000, disbursementDate: '2024-03-01', repaymentSchedule: 'Monthly', outstandingBalance: 21000, status: 'Active' },
  { id: 'L003', loanId: 'LN-2023-010', fisher: sellers[1], amount: 10000, disbursementDate: '2023-09-01', repaymentSchedule: 'Monthly', outstandingBalance: 0, status: 'Paid Off' },
];
