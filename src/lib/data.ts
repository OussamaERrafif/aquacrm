
import type { Buyer, Seller, Fish, Invoice, Loan, Person } from './types';

export const parties: Person[] = [
  { id: 'P001', name: 'Global Seafoods Inc.', company: 'Global Seafoods Inc.', email: 'contact@globalseafoods.com', phone: '123-456-7890', address: '123 Ocean Ave, Seattle, WA' },
  { id: 'P002', name: 'The Fish Market', company: 'The Fish Market', email: 'orders@thefishmarket.com', phone: '234-567-8901', address: '456 Dock St, San Francisco, CA' },
  { id: 'P003', name: 'Ocean\'s Bounty', company: 'Ocean\'s Bounty', email: 'info@oceansbounty.net', phone: '345-678-9012', address: '789 Port Rd, Miami, FL' },
  { id: 'P004', name: 'Deep Sea Fishers', company: 'Deep Sea Fishers', email: 'sales@dsfishers.com', phone: '456-789-0123', address: '1 Fishery Ln, Anchorage, AK' },
  { id: 'P005', name: 'Captain Rodriguez', company: 'Captain Rodriguez', email: 'contact@rodriguezcatch.com', phone: '567-890-1234', address: '2 Shrimp Blvd, New Orleans, LA' },
  { id: 'P006', name: 'Ocean Fresh', company: 'Ocean Fresh', email: 'fleet@oceanfresh.com', phone: '678-901-2345', address: '3 Tuna Pier, San Diego, CA' },
];

export const buyers: Buyer[] = parties.slice(0, 3);
export const sellers: Seller[] = parties.slice(3, 6);

export const fish: Fish[] = [
  { 
    id: 'F001', 
    name: 'Atlantic Salmon', 
    category: 'Fresh Fish', 
    status: 'In Stock', 
    price: 12.50, 
    stock: 150, 
    minStock: 50, 
    supplier: 'Deep Sea Fishers',
    imageUrl: 'https://picsum.photos/seed/salmon/600/400',
    imageHint: 'atlantic salmon'
  },
  { 
    id: 'F002', 
    name: 'Pacific Tuna', 
    category: 'Fresh Fish', 
    status: 'Low Stock', 
    price: 18.75, 
    stock: 25, 
    minStock: 30, 
    supplier: 'Captain Rodriguez',
    imageUrl: 'https://picsum.photos/seed/tuna/600/400',
    imageHint: 'pacific tuna'
  },
  { 
    id: 'F003', 
    name: 'Fresh Shrimp', 
    category: 'Shellfish', 
    status: 'In Stock', 
    price: 22.00, 
    stock: 80, 
    minStock: 40, 
    supplier: 'Ocean Fresh',
    imageUrl: 'https://picsum.photos/seed/shrimp/600/400',
    imageHint: 'fresh shrimp'
  },
  { 
    id: 'F004', 
    name: 'Atlantic Cod', 
    category: 'Fresh Fish',
    status: 'In Stock',
    price: 9.50,
    stock: 120,
    minStock: 40,
    supplier: 'Deep Sea Fishers',
    imageUrl: 'https://picsum.photos/seed/cod/600/400',
    imageHint: 'atlantic cod'
  },
  { 
    id: 'F005', 
    name: 'Mahi-mahi', 
    category: 'Exotic Fish',
    status: 'Out of Stock',
    price: 25.00,
    stock: 0,
    minStock: 20,
    supplier: 'Captain Rodriguez',
    imageUrl: 'https://picsum.photos/seed/mahi/600/400',
    imageHint: 'mahi mahi'
  },
  { 
    id: 'F006', 
    name: 'Red Snapper', 
    category: 'Fresh Fish',
    status: 'Low Stock',
    price: 15.00,
    stock: 30,
    minStock: 25,
    supplier: 'Ocean Fresh',
    imageUrl: 'https://picsum.photos/seed/snapper/600/400',
    imageHint: 'red snapper'
  },
];


export const invoices: Invoice[] = [
  {
    id: 'INV-001', invoiceNumber: '2024-001', type: 'sell', date: '2024-07-15', dueDate: '2024-08-14', party: parties[0],
    items: [
      { id: 'I001', fish: fish[0], length: 'm', weight: 10, pricePerKilo: 25, total: 250 },
      { id: 'I002', fish: fish[1], length: 'xl', weight: 50, pricePerKilo: 40, total: 2000 },
    ],
    totalAmount: 2250, status: 'Paid',
  },
  {
    id: 'INV-002', invoiceNumber: '2024-002', type: 'buy', date: '2024-07-18', dueDate: '2024-08-17', party: parties[4],
    items: [
      { id: 'I003', fish: fish[5], length: 's', weight: 5, pricePerKilo: 15, total: 75 },
    ],
    totalAmount: 75, status: 'Unpaid',
  },
  {
    id: 'INV-003', invoiceNumber: '2024-003', type: 'sell', date: '2024-07-20', dueDate: '2024-08-19', party: parties[1],
    items: [
      { id: 'I004', fish: fish[3], length: 'm', weight: 8, pricePerKilo: 18, total: 144 },
    ],
    totalAmount: 144, status: 'Unpaid',
  },
  {
    id: 'INV-004', invoiceNumber: '2024-004', type: 'sell', date: '2024-06-10', dueDate: '2024-07-10', party: parties[2],
    items: [
      { id: 'I005', fish: fish[4], length: 'l', weight: 30, pricePerKilo: 22, total: 660 },
    ],
    totalAmount: 660, status: 'Overdue',
  },
   {
    id: 'INV-005', invoiceNumber: '2024-005', type: 'buy', date: '2024-05-01', dueDate: '2024-05-31', party: parties[3],
    items: [
      { id: 'I006', fish: fish[0], length: 'm', weight: 12, pricePerKilo: 23, total: 276 },
    ],
    totalAmount: 276, status: 'Paid',
  },
  {
    id: 'INV-006', invoiceNumber: '2024-006', type: 'sell', date: '2024-07-22', dueDate: '2024-08-21', party: parties[0],
    items: [
      { id: 'I007', fish: fish[2], length: 'l', weight: 20, pricePerKilo: 22, total: 440 },
    ],
    totalAmount: 440, status: 'Unpaid',
  },
  {
    id: 'INV-007', invoiceNumber: '2024-007', type: 'buy', date: '2024-07-25', dueDate: '2024-08-24', party: parties[0],
    items: [
      { id: 'I008', fish: fish[4], length: 's', weight: 15, pricePerKilo: 20, total: 300 },
    ],
    totalAmount: 300, status: 'Unpaid',
  },
  {
    id: 'INV-008', invoiceNumber: '2024-008', type: 'sell', date: '2024-07-28', dueDate: '2024-08-27', party: parties[0],
    items: [
      { id: 'I009', fish: fish[0], length: 'xl', weight: 25, pricePerKilo: 26, total: 650 },
    ],
    totalAmount: 650, status: 'Paid',
  },
  {
    id: 'INV-009', invoiceNumber: '2024-009', type: 'sell', date: '2024-08-01', dueDate: '2024-08-31', party: parties[0],
    items: [
      { id: 'I010', fish: fish[3], length: 'm', weight: 10, pricePerKilo: 10, total: 100 },
    ],
    totalAmount: 100, status: 'Unpaid',
  },
    {
    id: 'INV-010', invoiceNumber: '2024-010', type: 'buy', date: '2024-08-02', dueDate: '2024-09-01', party: parties[0],
    items: [
      { id: 'I011', fish: fish[5], length: 'l', weight: 18, pricePerKilo: 14, total: 252 },
    ],
    totalAmount: 252, status: 'Unpaid',
  },
];

export const loans: Loan[] = [
  { id: 'L001', loanId: 'LN-2024-001', fisher: sellers[0], amount: 15000, disbursementDate: '2024-01-15', repaymentSchedule: 'Monthly', outstandingBalance: 8500, status: 'Active' },
  { id: 'L002', loanId: 'LN-2024-002', fisher: sellers[2], amount: 25000, disbursementDate: '2024-03-01', repaymentSchedule: 'Monthly', outstandingBalance: 21000, status: 'Active' },
  { id: 'L003', loanId: 'LN-2023-010', fisher: sellers[1], amount: 10000, disbursementDate: '2023-09-01', repaymentSchedule: 'Monthly', outstandingBalance: 0, status: 'Paid Off' },
];
