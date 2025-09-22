export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

export type Person = {
  id: string;
  name: string;
  company?: string;
  email:string;
  phone?: string;
  address?: string;
};

export type Buyer = Person;
export type Seller = Person;

export type Fish = {
  id: string;
  name: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  imageUrl: string;
  imageHint: string;
};

export type InvoiceItem = {
  id: string;
  fish: Fish;
  length: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  weight: number;
  pricePerKilo: number;
  total: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  type: 'buy' | 'sell';
  date: string;
  dueDate: string;
  party: Person;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
};

export type Loan = {
  id: string;
  loanId: string;
  fisher: Person;
  amount: number;
  disbursementDate: string;
  repaymentSchedule: string;
  outstandingBalance: number;
  status: 'Active' | 'Paid Off' | 'Defaulted';
};

export type Party = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
};

export interface PartyWithRelations extends Party {
  invoices: Invoice[];
}
