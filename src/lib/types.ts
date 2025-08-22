
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  discountPercentage: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  invoiceDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  gstRate: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  customerPhone?: string;
}
