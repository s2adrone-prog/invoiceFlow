export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  total: number;
}
