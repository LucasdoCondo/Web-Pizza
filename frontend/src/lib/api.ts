const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${path} falhou: ${res.status}`);
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API ${path} falhou: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  chat: (message: string, step: string, context?: Record<string, unknown>) =>
    post<{ reply: string; options?: string[]; nextStep?: string }>(`/api/chat`, {
      message,
      step,
      context
    }),
  createOrder: (payload: {
    items: { pizzaId: string; qty: number }[];
    dough: string;
    name: string;
    phone: string;
    address: string;
  }) => post<{ orderId: string; subtotal: number; deliveryFee: number; total: number; etaMinutes: number }>(`/api/orders`, payload),
  trackOrder: (orderId: string) => get<{ orderId: string; status: string; etaMinutes: number }>(`/api/orders/${orderId}`),
  streamOrder: (orderId: string, onEvent: (s: { status: string; etaMinutes: number }) => void) => {
    const src = new EventSource(`${API}/api/orders/${orderId}/stream`);
    src.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data));
      } catch {
        /* noop */
      }
    };
    return () => src.close();
  }
};
