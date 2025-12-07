export interface Client {
  uid?: string;
  name: string;
  phone: string;
  location?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type size = "XS" | "S" | "M" | "L" | "XL"

export interface Product {
  uid?: string;
  name: string;
  price: number;
  designNumber: string;
  sizeAvailable?: size[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface InvoiceItem {
  productId: string; // reference to Product.uid
  productName: string;
  designNumber: string;
  size: string; // Changed to string to allow custom sizes like "S-L", "16-32", etc.
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  uid?: string;
  billNo: string;
  customerId: string; // reference to Client.uid
  items: InvoiceItem[];
  grandTotal: number;
  paidAmount: number;
  remainingBalance: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type ActiveLinkOptions = "client" | "product" | "invoice"
export type NotificationType = "success" | "error" | "warning" | "info";

export type MessageStyleProp = {
  icon: string;
  className: string;
};

export type MessageTypeProp = Record<NotificationType, MessageStyleProp>;

export interface NotificationObj {
  id: string;
  type: NotificationType;
  message: string;
}