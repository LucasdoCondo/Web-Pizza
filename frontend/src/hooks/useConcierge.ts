import { useCallback, useEffect, useRef, useState } from 'react';
import { DOUGHS, PIZZAS, money } from '../data/menu';
import { api } from '../lib/api';
import type { ChatMessage, ChatStep } from '../types';

const uid = () => Math.random().toString(36).slice(2, 9);

export function useConcierge(externalCart: string[], signalKey = 0) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<ChatStep>('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [dough, setDough] = useState(DOUGHS[0].label);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [track, setTrack] = useState({ status: 'RECEBIDO', eta: 35 });
  const booted = useRef(false);

  const push = useCallback((m: Omit<ChatMessage, 'id'>) => {
    setMessages((p) => [...p, { ...m, id: uid() }]);
  }, []);

  const botSay = useCallback((text: string, extra?: Partial<ChatMessage>, delay = 650) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ from: 'bot', text, ...extra });
    }, delay);
  }, [push]);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const t = window.setTimeout(() => {
      setOpen(true);
      botSay(
        'Olá, bem-vindo à Bella Notte! Gostaria de montar a sua pizza artesanal perfeita ou ver o cardápio em destaque?',
        { options: ['Ver cardápio em destaque', 'Montar pizza com o concierge'] },
        900
      );
      setStep('intent');
    }, 1500);
    return () => window.clearTimeout(t);
  }, [botSay]);

  useEffect(() => {
    if (externalCart.length && signalKey > 0) {
      setCart((prev) => [...prev, ...externalCart]);
      setOpen(true);
      const names = externalCart.map((id) => PIZZAS.find((p) => p.id === id)?.name).join(', ');
      botSay(`Adicionei ${names} ao teu pedido. Escolhemos a massa?`, {
        options: ['Escolher massa', 'Ver total']
      });
      setStep('dough');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalKey]);

  useEffect(() => {
    if (!orderId) return;
    return api.streamOrder(orderId, (s) => {
      setTrack({ status: s.status, eta: s.etaMinutes });
      if (s.status === 'NO_FORNO') botSay('O seu pedido entrou no forno a lenha! 450°C de pura magia.', {}, 400);
      if (s.status === 'SAIU_PARA_ENTREGA') botSay('Saiu para entrega! O estafeta já vai a caminho.', {}, 400);
      if (s.status === 'ENTREGUE') botSay('Buon appetito! Pedido entregue.', { options: ['Montar outra pizza'] }, 400);
    });
  }, [orderId, botSay]);

  const cartTotal = cart.reduce((s, id) => s + (PIZZAS.find((p) => p.id === id)?.price ?? 0), 0)
    + (DOUGHS.find((d) => d.label === dough)?.delta ?? 0);

  const handleOption = useCallback(async (opt: string) => {
    push({ from: 'user', text: opt });
    const low = opt.toLowerCase();
    if (low.includes('cardápio') || low.includes('destaque')) {
      document.querySelector('#cardapio')?.scrollIntoView({ behavior: 'smooth' });
      botSay('Galeria aberta acima — toca em Adicionar e eu trato do resto.', { options: ['Montar pizza com o concierge'] });
      return;
    }
    if (low.includes('montar') || low.includes('outra')) {
      setStep('dough');
      botSay('Ottimo! Qual massa?', { options: DOUGHS.map((d) => d.label) });
      return;
    }
    if (low.includes('massa') || low.includes('escolher')) {
      setStep('dough');
      botSay('Escolhe a massa:', { options: DOUGHS.map((d) => d.label) });
      return;
    }
    const doughHit = DOUGHS.find((d) => d.label === opt);
    if ((step === 'intent' || step === 'dough') && (doughHit || low.includes('48h') || low.includes('glúten') || low.includes('integral'))) {
      const d = doughHit ?? DOUGHS[0];
      setDough(d.label);
      setStep('flavours');
      botSay(`Massa ${d.label}. Agora os sabores:`, { options: PIZZAS.slice(0, 4).map((p) => p.name), pizzas: PIZZAS.slice(0, 4) });
      return;
    }
    if (low.includes('total')) {
      botSay(`Parcial: ${money(cartTotal)} (${cart.length} itens + ${dough}). Avançamos?`, { options: ['Continuar para entrega'] });
      return;
    }
    if (low.includes('entrega') || low.includes('continuar')) {
      setStep('delivery');
      botSay('Escreve: Nome | Telefone | Morada. Ex: Maria | 912345678 | Rua das Flores 12, Lisboa.');
      return;
    }
    const pizzaHit = PIZZAS.find((x) => x.name === opt);
    if (pizzaHit && step === 'flavours') {
      setCart((prev) => [...prev, pizzaHit.id]);
      botSay(`${pizzaHit.name} adicionada (${money(pizzaHit.price)}). Mais alguma?`, { options: [...PIZZAS.slice(0, 4).map((x) => x.name), 'Continuar para entrega'] });
      return;
    }
    if (low.includes('confirmar')) {
      try {
        const res = await api.createOrder({ items: cart.map((pizzaId) => ({ pizzaId, qty: 1 })), dough, name: form.name, phone: form.phone, address: form.address });
        setOrderId(res.orderId);
        setTrack({ status: 'RECEBIDO', eta: res.etaMinutes });
        setStep('tracking');
        push({ from: 'bot', text: `Pedido ${res.orderId} confirmado — ${money(res.total)}.`, tracking: { orderId: res.orderId, status: 'RECEBIDO', etaMinutes: res.etaMinutes } });
      } catch { botSay('Falha de rede — confirma que a API corre em :4000 e tenta de novo.'); }
      return;
    }
    if (low.includes('alterar')) {
      setStep('delivery');
      botSay('Sem problema — reescreve: Nome | Telefone | Morada.');
      return;
    }
    try {
      const r = await api.chat(opt, step);
      if (r.nextStep) setStep(r.nextStep as ChatStep);
      botSay(r.reply, { options: r.options });
    } catch { botSay('Recebido! Diz o sabor ou escreve Continuar para entrega.'); }
  }, [botSay, push, step, cart, cartTotal, dough, form]);

  const handleFreeText = useCallback((text: string) => {
    if (step === 'delivery' && text.includes('|')) {
      push({ from: 'user', text });
      const [name, phone, address] = text.split('|').map((s) => s.trim());
      setForm({ name, phone, address });
      setStep('confirm');
      botSay(`Confirma: ${cart.length} pizza(s), ${dough}, ${money(cartTotal)} para ${name} em ${address}?`, { options: ['Confirmar pedido', 'Alterar dados'] });
      return;
    }
    handleOption(text);
  }, [push, step, cart, dough, cartTotal, botSay, handleOption]);

  return { open, setOpen, typing, messages, step, cart, dough, cartTotal, track, orderId, handleOption, handleFreeText };
}

