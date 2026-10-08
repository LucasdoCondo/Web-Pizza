import { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HorizontalMenu from './components/HorizontalMenu';
import StickyCards from './components/StickyCards';
import ConciergeSection from './components/ConciergeSection';
import ChatConcierge from './components/ChatConcierge';
import { useLenis } from './hooks/useSmoothScroll';
import useBackgroundMorph from './hooks/useBackgroundMorph';

export default function App() {
  useLenis(true);
  const shell = useRef<HTMLDivElement>(null);
  useBackgroundMorph(shell);
  const [signal, setSignal] = useState<{ id: string; n: number } | null>(null);

  const addFromMenu = (id: string) => {
    setSignal({ id, n: Date.now() });
  };

  return (
    <div ref={shell} className="grain min-h-screen bg-noir text-cream">
      <Navbar />
      <main>
        <Hero />
        <HorizontalMenu onAdd={addFromMenu} />
        <StickyCards />
        <ConciergeSection onSummon={() => document.querySelector('#concierge')?.scrollIntoView({ behavior: 'smooth' })} />
      </main>
      <footer className="border-t border-white/5 px-5 py-10 text-center text-xs text-smoke md:px-8">
        <p className="font-display text-2xl text-cream">Bella Notte</p>
        <p className="mt-2 uppercase tracking-lux">Forno a lenha · Lisboa · 18h — 23h30</p>
      </footer>
      <ChatConcierge key="concierge" externalCart={signal ? [signal.id] : []} signalKey={signal?.n ?? 0} />
    </div>
  );
}
