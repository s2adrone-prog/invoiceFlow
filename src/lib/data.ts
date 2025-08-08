import type { Invoice } from './types';

const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerName: 'Acme Inc.',
    customerEmail: 'contact@acme.com',
    invoiceDate: '2024-06-01',
    dueDate: '2024-06-30',
    status: 'Paid',
    items: [
      { id: '1', description: 'Web Development Services', quantity: 1, price: 5000 },
      { id: '2', description: 'Hosting (1 year)', quantity: 1, price: 300 },
    ],
    total: 5300,
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    customerName: 'Stark Industries',
    customerEmail: 'tony@stark.com',
    invoiceDate: '2024-05-15',
    dueDate: '2024-06-15',
    status: 'Pending',
    items: [
      { id: '1', description: 'Mark 42 Armor Repair', quantity: 1, price: 100000 },
    ],
    total: 100000,
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    customerName: 'Wayne Enterprises',
    customerEmail: 'bruce@wayne.com',
    invoiceDate: '2024-04-01',
    dueDate: '2024-05-01',
    status: 'Overdue',
    items: [
      { id: '1', description: 'Grappling Hook', quantity: 5, price: 1000 },
      { id: '2', description: 'Batarangs (Pack of 10)', quantity: 10, price: 500 },
    ],
    total: 10000,
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    customerName: 'Cyberdyne Systems',
    customerEmail: 'info@cyberdyne.com',
    invoiceDate: '2024-05-20',
    dueDate: '2024-06-20',
    status: 'Paid',
    items: [
      { id: '1', description: 'Neural Net Processor', quantity: 1, price: 75000 },
    ],
    total: 75000,
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    customerName: 'Oscorp',
    customerEmail: 'norman@oscorp.com',
    invoiceDate: '2024-06-10',
    dueDate: '2024-07-10',
    status: 'Pending',
    items: [
      { id: '1', description: 'Performance Enhancers', quantity: 100, price: 250 },
    ],
    total: 25000,
  },
  {
    id: '6',
    invoiceNumber: 'INV-006',
    customerName: 'Globex Corporation',
    customerEmail: 'hank@globex.com',
    invoiceDate: '2024-03-12',
    dueDate: '2024-04-12',
    status: 'Paid',
    items: [
      { id: '1', description: 'Consulting Services', quantity: 40, price: 200 },
    ],
    total: 8000,
  },
  {
    id: '7',
    invoiceNumber: 'INV-007',
    customerName: 'Initech',
    customerEmail: 'bill@initech.com',
    invoiceDate: '2024-02-28',
    dueDate: '2024-03-28',
    status: 'Overdue',
    items: [
      { id: '1', description: 'TPS Reports Cover Sheets', quantity: 500, price: 2.5 },
    ],
    total: 1250,
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
