import { useEffect, useRef } from 'react';
import { ConciergeBell, MousePointerClick } from 'lucide-react';
import { gsap } from '../hooks/useSmoothScroll';

export default function ConciergeSection({ onSummon }: { onSummon: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.concierge-card', {
        y: 80, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const steps = [
    { n: '01', t: 'Massa', d: '48h, integral ou sem glúten.' },
    { n: '02', t: 'Sabores', d: 'Preço dinâmico em tempo real.' },
    { n: '03', t: 'Entrega', d: 'Morada + contacto, portes grátis +€30.' },
    { n: '04', t: 'Forno', d: 'Tracking vivo até à porta.' }
  ];

  return (
    <section id="concierge" ref={root} className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <p className="text-[11px] uppercase tracking-lux text-gold">05 — Auto-atendimento</p>
      <h2 className="font-display mt-2 max-w-2xl text-4xl md:text-6xl">
        O concierge <span className="gold-text italic">guia-te</span> até ao forno
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="concierge-card rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="font-display text-3xl text-gold/70">{s.n}</p>
            <p className="mt-2 text-lg">{s.t}</p>
            <p className="mt-1 text-sm text-smoke">{s.d}</p>
          </div>
        ))}
      </div>
      <button onClick={onSummon} className="mt-10 flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-bold text-noir shadow-lux transition hover:brightness-110">
        <ConciergeBell size={17} /> Chamar o concierge <MousePointerClick size={15} />
      </button>
    </section>
  );
}
