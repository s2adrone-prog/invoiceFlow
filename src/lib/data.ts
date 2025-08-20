
"use client"

import type { Invoice } from './types';
import { auth } from '@/lib/firebase';

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    customerName: 'Acme Inc.',
    customerEmail: 'contact@acme.com',
    customerPhone: '+1-202-555-0143',
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
    customerPhone: '+1-202-555-0185',
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
    customerPhone: '+1-202-555-0161',
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
    customerPhone: '+1-202-555-0158',
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
    customerPhone: '+1-202-555-0169',
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
    customerPhone: '+1-202-555-0132',
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
    customerPhone: '+1-202-555-0188',
    invoiceDate: '2024-02-28',
    status: 'Overdue',
    items: [
      { id: '1', description: 'TPS Reports Cover Sheets', quantity: 500, price: 2.5, discountPercentage: 10 },
    ],
    gstRate: 5,
    total: 1181.25,
  }
];

const getCurrentUserKey = (): string => {
  if (typeof window === 'undefined') return 'invoices_anonymous';
  const user = auth.currentUser;
  const key = user ? `invoices_${user.uid}` : 'invoices_anonymous';
  
  if (user && !localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialInvoices));
  }
  
  return key;
};

const getStoredInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const userKey = getCurrentUserKey();
  const data = localStorage.getItem(userKey);
  return data ? JSON.parse(data) : [];
};

const setStoredInvoices = (invoices: Invoice[]) => {
    if (typeof window === 'undefined') return;
    const userKey = getCurrentUserKey();
    localStorage.setItem(userKey, JSON.stringify(invoices));
}

// Simulate API calls
export async function getInvoices(): Promise<Invoice[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = getStoredInvoices();
      resolve([...invoices].sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()));
    }, 200);
  });
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
        const invoices = getStoredInvoices();
      resolve(invoices.find((invoice) => invoice.id === id) || null);
    }, 100);
  });
}

export async function saveInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'status'>): Promise<Invoice> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const invoices = getStoredInvoices();
            const latestInvoiceNumber = invoices.reduce((max, inv) => {
                const num = parseInt(inv.invoiceNumber.split('-')[1]);
                return num > max ? num : max;
            }, 0);

            const newInvoice: Invoice = {
                ...invoiceData,
                id: `${Date.now()}`,
                invoiceNumber: `INV-${(latestInvoiceNumber + 1).toString().padStart(3, '0')}`,
                status: 'Pending', 
                items: invoiceData.items.map((item, index) => ({ ...item, id: `${Date.now()}-${index}` })),
            };
            const updatedInvoices = [newInvoice, ...invoices];
            setStoredInvoices(updatedInvoices);
            resolve(newInvoice);
        }, 200);
    });
}
