export interface Client {
  uid?: string;
  name: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
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