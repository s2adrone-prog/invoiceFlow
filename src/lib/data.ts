import type { Invoice } from './types';

const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerName: 'Acme Inc.',
    customerEmail: 'contact@acme.com',
    invoiceDate: '2024-06-01',
    status: 'Paid',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 1, price: 5000, discountPercentage: 0 },
      { id: '2', description: 'Hosting (1 year)', quantity: 1, price: 300, discountPercentage: 10 },
    ],
    gstRate: 18,
    total: 6136,
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customerName: 'Stark Industries',
    customerEmail: 'tony@stark.com',
    invoiceDate: '2024-05-15',
    status: 'Pending',
    items: [
      { id: '1', description: 'Mark 42 Armor Repair', quantity: 1, price: 100000, discountPercentage: 10 },
    ],
    gstRate: 18,
    total: 106200,
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    customerName: 'Wayne Enterprises',
    customerEmail: 'bruce@wayne.com',
    invoiceDate: '2024-04-01',
    status: 'Overdue',
    items: [
      { id: '1', description: 'Grappling Hook', quantity: 5, price: 1000, discountPercentage: 0 },
      { id: '2', description: 'Batarangs (Pack of 10)', quantity: 10, price: 500, discountPercentage: 0 },
    ],
    gstRate: 12,
    total: 11200,
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    customerName: 'Cyberdyne Systems',
    customerEmail: 'info@cyberdyne.com',
    invoiceDate: '2024-05-20',
    status: 'Paid',
    items: [
      { id: '1', description: 'Neural Net Processor', quantity: 1, price: 75000, discountPercentage: 5 },
    ],
    gstRate: 18,
    total: 83925,
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    customerName: 'Oscorp',
    customerEmail: 'norman@oscorp.com',
    invoiceDate: '2024-06-10',
    status: 'Pending',
    items: [
      { id: '1', description: 'Performance Enhancers', quantity: 100, price: 250, discountPercentage: 0 },
    ],
    gstRate: 28,
    total: 32000,
  },
  {
    id: '6',
    invoiceNumber: 'INV-006',
    customerName: 'Globex Corporation',
    customerEmail: 'hank@globex.com',
    invoiceDate: '2024-03-12',
    status: 'Paid',
    items: [
      { id: '1', description: 'Consulting Services', quantity: 40, price: 200, discountPercentage: 0 },
    ],
    gstRate: 0,
    total: 8000,
  },
  {
    id: '7',
    invoiceNumber: 'INV-007',
    customerName: 'Initech',
    customerEmail: 'bill@initech.com',
    invoiceDate: '2024-02-28',
    status: 'Overdue',
    items: [
      { id: '1', description: 'TPS Reports Cover Sheets', quantity: 500, price: 2.5, discountPercentage: 10 },
    ],
    gstRate: 5,
    total: 1181.25,
  }
];

// Simulate API calls
export async function getInvoices(): Promise<Invoice[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(invoices);
    }, 500);
  });
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(invoices.find((invoice) => invoice.id === id));
    }, 300);
  });
}
