# Application Data Types

This document outlines the primary data structures used throughout the AquaTrade CRM application.

## `NavItem`

Represents a navigation item in the sidebar menu.

```typescript
export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};
```

## `Person`

Represents a person or a company that can be a trading partner. This is a base type for `Buyer` and `Seller`.

```typescript
export type Person = {
  id: string;
  name: string;
  company?: string;
  email:string;
  phone?: string;
  address?: string;
};
```

## `Buyer`

Represents a buyer, extending the `Person` type.

```typescript
export type Buyer = Person;
```

## `Seller`

Represents a seller, extending the `Person` type.

```typescript
export type Seller = Person;
```

## `Fish`

Represents a type of fish or seafood product available for trade.

```typescript
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
```

## `InvoiceItem`

Represents a single line item within an invoice.

```typescript
export type InvoiceItem = {
  id: string;
  fish: Fish;
  length: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  weight: number;
  pricePerKilo: number;
  total: number;
};
```

## `Invoice`

Represents a buy or sell invoice.

```typescript
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
```

## `Loan`

Represents a loan provided to a fisher.

```typescript
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
```
