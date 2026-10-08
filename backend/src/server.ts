import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- Catálogo (espelha o frontend) ---------- */
const MENU: Record<string, { name: string; price: number }> = {
  notte: { name: 'Bella Notte', price: 18.9 },
  diavola: { name: 'Diavola Oro', price: 16.5 },
  margherita: { name: 'Margherita D.O.P.', price: 12.9 },
  tartufo: { name: 'Tartufo Nero', price: 21.9 },
  marina: { name: 'Marinara Antica', price: 11.9 },
  quattro: { name: 'Quattro Formaggi', price: 17.5 }
};
const DOUGH_DELTA: Record<string, number> = { '48h': 0, integral: 1.5, gluten: 2.5 };

type Status = 'RECEBIDO' | 'A_PREPARAR' | 'NO_FORNO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE';
interface Order {
  id: string; items: { pizzaId: string; qty: number }[];
  dough: string; name: string; phone: string; address: string;
  subtotal: number; deliveryFee: number; total: number;
  status: Status; etaMinutes: number; createdAt: number;
}
const orders = new Map<string, Order>();
const listeners = new Map<string, Set<(o: Order) => void>>();

function totals(items: { pizzaId: string; qty: number }[], dough: string) {
  const subtotal = items.reduce((s, i) => s + (MENU[i.pizzaId]?.price ?? 0) * i.qty, 0)
    + (DOUGH_DELTA[dough] ?? 0);
  const deliveryFee = subtotal >= 30 ? 0 : 2.9;
  return { subtotal: +subtotal.toFixed(2), deliveryFee, total: +(subtotal + deliveryFee).toFixed(2) };
}

function setStatus(order: Order, status: Status, eta: number) {
  order.status = status; order.etaMinutes = eta;
  listeners.get(order.id)?.forEach((fn) => fn(order));
}

/* ---------- 1) Chat / pré-atendimento ---------- */
app.post('/api/chat', (req, res) => {
  const { message = '', step = 'welcome' } = req.body as { message: string; step: string };
  const msg = message.toLowerCase();
  const has = (...words: string[]) => words.some((w) => msg.includes(w));

  if (step === 'welcome' || has('olá', 'ola', 'oi', 'menu', 'cardápio', 'cardapio', 'começar', 'comecar')) {
    return res.json({
      reply: 'Buonasera! Sou o Concierge Bella Notte. Queres explorar o cardápio horizontal ou monto contigo a pizza perfeita?',
      options: ['Ver cardápio em destaque', 'Montar pizza com o concierge'],
      nextStep: 'intent'
    });
  }
  if (step === 'intent') {
    if (has('cardápio', 'cardapio', 'ver', 'destaque')) {
      return res.json({ reply: 'Perfeito — desliza a galeria horizontal acima. Quando escolheres, diz-me os sabores e trato do resto.', options: ['Montar pizza com o concierge'], nextStep: 'dough' });
    }
    return res.json({
      reply: 'Ottimo! Primeiro: qual massa abraça melhor a tua fome? A 48h é a nossa alma.',
      options: ['Fermentação Natural 48h', 'Integral Rústica', 'Sem Glúten'],
      nextStep: 'dough'
    });
  }
  if (step === 'dough') {
    return res.json({
      reply: 'Escolha sublime. Agora diz-me 1 ou 2 sabores (ex: "1x Bella Notte + 1x Diavola"). Portes grátis acima de €30.',
      options: ['Bella Notte', 'Diavola Oro', 'Tartufo Nero', 'Margherita D.O.P.'],
      nextStep: 'flavours'
    });
  }
  return res.json({ reply: 'Estou contigo — continua no widget que trato do pedido e do forno a lenha.', nextStep: step });
});

/* ---------- 2) Pedidos ---------- */
app.post('/api/orders', (req, res) => {
  const { items, dough, name, phone, address } = req.body as Order & { items: { pizzaId: string; qty: number }[] };
  if (!items?.length || !name || !address) return res.status(400).json({ error: 'Pedido incompleto.' });
  const { subtotal, deliveryFee, total } = totals(items, dough);
  const id = uuid().slice(0, 8).toUpperCase();
  const order: Order = { id, items, dough, name, phone, address, subtotal, deliveryFee, total, status: 'RECEBIDO', etaMinutes: 35, createdAt: Date.now() };
  orders.set(id, order);

  // Simulação de cozinha: RECEBIDO -> A_PREPARAR (4s) -> NO_FORNO (9s) -> ENTREGUE path (16s / 24s)
  setTimeout(() => setStatus(order, 'A_PREPARAR', 30), 4000);
  setTimeout(() => setStatus(order, 'NO_FORNO', 22), 9000);
  setTimeout(() => setStatus(order, 'SAIU_PARA_ENTREGA', 12), 16000);
  setTimeout(() => setStatus(order, 'ENTREGUE', 0), 30000);

  res.status(201).json({ orderId: id, subtotal, deliveryFee, total, etaMinutes: 35 });
});

app.get('/api/orders/:id', (req, res) => {
  const o = orders.get(req.params.id.toUpperCase());
  if (!o) return res.status(404).json({ error: 'Pedido não encontrado.' });
  res.json({ orderId: o.id, status: o.status, etaMinutes: o.etaMinutes, total: o.total });
});

/* ---------- 3) SSE — tracking em tempo real ---------- */
app.get('/api/orders/:id/stream', (req, res) => {
  const id = req.params.id.toUpperCase();
  const order = orders.get(id);
  if (!order) return res.status(404).end();
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  const push = (o: Order) => res.write(`data: ${JSON.stringify({ status: o.status, etaMinutes: o.etaMinutes })}\n\n`);
  push(order);
  if (!listeners.has(id)) listeners.set(id, new Set());
  listeners.get(id)!.add(push);
  req.on('close', () => listeners.get(id)?.delete(push));
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[bella-notte] API em http://localhost:${PORT}`));
