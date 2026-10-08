import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { money, PIZZAS } from '../data/menu';
import { useConcierge } from '../hooks/useConcierge';
import OrderTracker from './OrderTracker';

export default function ChatConcierge({ externalCart, signalKey }: { externalCart: string[]; signalKey: number }) {
  const c = useConcierge(externalCart, signalKey);
  const [input, setInput] = useState('');
  const [pulse, setPulse] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (c.open) setPulse(false);
    else if (c.messages.length) {
      const t = window.setTimeout(() => setPulse(true), 2500);
      return () => window.clearTimeout(t);
    }
  }, [c.open, c.messages.length]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' });
  }, [c.messages, c.typing]);

  const send = () => {
    if (!input.trim()) return;
    c.handleFreeText(input.trim());
    setInput('');
  };

  return (
    <>
      <motion.button
        onClick={() => c.setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[100] place-items-center rounded-full bg-gradient-to-br from-brasao to-gold-deep p-4 shadow-ember"
        style={{ width: 60, height: 60, display: 'grid' }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        animate={pulse && !c.open ? { scale: [1, 1.12, 1] } : {}}
        transition={pulse ? { repeat: Infinity, duration: 1.6 } : {}}
        aria-label="Abrir concierge"
      >
        {c.open ? <X size={22} /> : <MessageCircle size={22} />}
        {!c.open && c.messages.length > 0 && (
          <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-noir">1</span>
        )}
      </motion.button>

      <AnimatePresence>
        {c.open && (
          <motion.aside
            initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }}
            className="fixed bottom-24 right-4 z-[100] flex h-[min(620px,72vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-noir-soft/95 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-brasao/20 to-gold/10 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15"><Sparkles size={18} className="text-gold" /></span>
              <div className="flex-1">
                <p className="font-display text-base leading-none">AI Concierge</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> online · forno a 450°C</p>
              </div>
              <button onClick={() => c.setOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X size={16} /></button>
            </div>

            <div ref={body} className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
              {c.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from === 'user' ? 'rounded-br-md bg-gold text-noir' : 'rounded-bl-md border border-white/10 bg-white/[0.06]'}`}>
                    <p>{m.text}</p>
                    {m.pizzas && (
                      <div className="mt-2 space-y-1.5">
                        {m.pizzas.map((p) => (
                          <button key={p.id} onClick={() => c.handleOption(p.name)} className="flex w-full items-center gap-2 rounded-xl bg-noir p-1.5 text-left hover:ring-1 hover:ring-gold/60">
                            <img src={p.image} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                            <span className="flex-1 text-xs">{p.name}</span>
                            <span className="text-xs text-gold-soft">{money(p.price)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {m.tracking && <div className="mt-2"><OrderTracker orderId={m.tracking.orderId} status={m.tracking.status} eta={m.tracking.etaMinutes} /></div>}
                    {m.options && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.options.map((o) => (
                          <button key={o} onClick={() => c.handleOption(o)} className="rounded-full border border-gold/40 px-3 py-1 text-[11px] text-gold-soft transition hover:bg-gold hover:text-noir">{o}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {c.step === 'tracking' && c.orderId && <OrderTracker orderId={c.orderId} status={c.track.status} eta={c.track.eta} />}
              {c.typing && <p className="text-xs italic text-smoke">Concierge a polvilhar farinha…</p>}
              {c.cart.length > 0 && c.step !== 'tracking' && (
                <p className="rounded-xl bg-noir px-3 py-2 text-center text-[11px] text-gold-soft">
                  {c.cart.length} item(ns) · {c.dough} · {money(c.cartTotal)}
                </p>
              )}
              {c.cart.length > 0 && (
                <p className="text-center text-[10px] text-smoke">{c.cart.map((id) => PIZZAS.find((p) => p.id === id)?.name.split(' ')[0]).join(' + ')}</p>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 p-3">
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Escreve Nome | Telefone | Morada…"
                className="flex-1 rounded-full bg-white/[0.06] px-4 py-2.5 text-sm outline-none placeholder:text-smoke/60 focus:ring-1 focus:ring-gold/60"
              />
              <button onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-gold text-noir transition hover:brightness-110"><Send size={16} /></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
