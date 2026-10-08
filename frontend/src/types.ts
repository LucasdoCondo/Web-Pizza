export interface Pizza {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  tags: string[];
}

export interface DoughOption {
  id: string;
  label: string;
  detail: string;
  delta: number;
}

export interface ChatMessage {
  id: string;
  from: 'bot' | 'user';
  text: string;
  options?: string[];
  pizzas?: Pizza[];
  orderSummary?: OrderSummary;
  tracking?: OrderTracking;
}

export interface OrderSummary {
  items: { pizzaId: string; name: string; qty: number; unitPrice: number }[];
  dough: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  name: string;
  phone: string;
}

export type OrderStatus =
  | 'RECEBIDO'
  | 'A_PREPARAR'
  | 'NO_FORNO'
  | 'SAIU_PARA_ENTREGA'
  | 'ENTREGUE';

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  etaMinutes: number;
}

export type ChatStep =
  | 'welcome'
  | 'intent'
  | 'dough'
  | 'flavours'
  | 'delivery'
  | 'confirm'
  | 'tracking';
