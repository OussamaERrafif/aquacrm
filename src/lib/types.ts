export type NavItem = {
  title: string;
  href?: string;
  // icons are React components (ElementType) so they can be rendered as <Icon />
  icon: React.ElementType;
  active?: boolean;
  items?: NavItem[];
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
  total?: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  type: 'buy' | 'sell';
  date: string | Date;
  dueDate: string | Date;
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
  disbursementDate: string | Date;
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

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type Charge = {
  id: string;
  title: string;
  price: number;
};

export type ChargesInvoice = {
  id: string;
  invoiceNumber: string;
  date: string | Date;
  totalAmount: number;
  status: 'Paid' | 'Unpaid';
  collaborator: Collaborator;
  charges: Charge[];
};