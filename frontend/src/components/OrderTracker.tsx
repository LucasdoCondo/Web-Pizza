import { useEffect, useRef } from 'react';
import { Flame, Timer, Bike } from 'lucide-react';
import { gsap } from '../hooks/useSmoothScroll';
import { STATUS_LABEL } from '../data/menu';

const STEPS = ['RECEBIDO', 'A_PREPARAR', 'NO_FORNO', 'SAIU_PARA_ENTREGA'] as const;

export default function OrderTracker({ orderId, status, eta }: { orderId: string; status: string; eta: number }) {
  const bar = useRef<HTMLDivElement>(null);
  const idx = Math.max(0, STEPS.indexOf(status as (typeof STEPS)[number]));

  useEffect(() => {
    gsap.to(bar.current, { width: `${((idx + 1) / STEPS.length) * 100}%`, duration: 0.9, ease: 'power3.out' });
  }, [idx]);

  return (
    <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-lux text-gold-soft">Pedido {orderId}</span>
        <span className="flex items-center gap-1.5 text-smoke"><Timer size={13} /> ~{eta} min</span>
      </div>
      <p className="font-display mt-2 flex items-center gap-2 text-xl">
        {status === 'NO_FORNO' ? <Flame size={18} className="text-brasao" /> : <Bike size={18} className="text-gold" />}
        {STATUS_LABEL[status] ?? status}
      </p>
      {status === 'NO_FORNO' && <p className="mt-1 text-sm text-gold-soft">O seu pedido entrou no forno a lenha!</p>}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div ref={bar} className="h-full w-0 rounded-full bg-gradient-to-r from-brasao via-gold to-gold-soft" />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-smoke">
        {STEPS.map((s) => <span key={s} className={STEPS.indexOf(s) <= idx ? 'text-gold-soft' : ''}>{STATUS_LABEL[s]}</span>)}
      </div>
    </div>
  );
}
