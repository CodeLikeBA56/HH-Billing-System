export interface Client {
  uid?: string;
  name: string;
  phone: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Product {
  uid?: string;
  name: string;
  designNumber: string;
  price: number;
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