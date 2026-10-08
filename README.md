# Bella Notte — Pizzaria Artesanal de Luxo

Web app imersiva (Awwwards level) + Concierge de pré-atendimento com tracking em tempo real.

## Estrutura
```
WEB-PIZZA/
├── package.json              # orquestra frontend+backend (concurrently)
├── frontend/                 # React 18 + TS + Vite + Tailwind + GSAP + Lenis
│   └── src/
│       ├── components/       # Navbar, Hero, HorizontalMenu, StickyCards, ConciergeSection, ChatConcierge, OrderTracker
│       ├── hooks/            # useSmoothScroll (Lenis+GSAP), useBackgroundMorph, useConcierge
│       ├── data/menu.ts      # catálogo + massas + formatação € (pt-PT)
│       ├── lib/api.ts        # cliente REST + SSE
│       ├── App.tsx           # shell + morph de background
│       └── index.css         # tokens (#0b0b0c / #d4af37 / #e63946), grain, gold-text
└── backend/                  # Express + TS — chat, pedidos, SSE
    └── src/server.ts
```

## Instalação (primeira vez)
```powershell
cd "c:\Users\Administrador\Documents\LDC\PROJETOS\WEB-PIZZA"
npm install
npm run install:all
```

## Executar (2 terminais ou 1 comando)
```powershell
# tudo de uma vez (recomendado): API :4000 + Web :5173
npm run dev

# ou separado:
npm run dev:backend    # http://localhost:4000/api/health
npm run dev:frontend   # http://localhost:5173
```

## Efeitos implementados
1. **Scroll horizontal rotativo** — `HorizontalMenu.tsx`: pin + scrub GSAP converte scroll vertical em galeria horizontal.
2. **Card stacking sticky** — `StickyCards.tsx`: 3 cartões colam no topo e escalam/blur com scrub.
3. **Text reveal scrubado** — `Hero.tsx`: máscaras linha-a-linha + fades ligados ao scroll.
4. **Zoom espacial 3D** — `Hero.tsx`: pizza avança em Z/scale/rotate + parallax de cursor (perspective 1200px).
5. **Background morph** — `useBackgroundMorph.ts`: `#0b0b0c → #140f0a → #1a0f10 → #12100a`.

## Fluxo do Concierge (5 passos)
1. Auto-mensagem aos 1.5s → 2. Intenção (cardápio vs guiado) → 3. Massa → 4. Sabores (preço dinâmico) → 5. `Nome | Telefone | Morada` → confirmação → tracker SSE (`RECEBIDO → A_PREPARAR → NO_FORNO → SAIU_PARA_ENTREGA → ENTREGUE`). Portes grátis acima de €30.

## API
- `POST /api/chat` { message, step } → { reply, options?, nextStep? }
- `POST /api/orders` { items[{pizzaId,qty}], dough, name, phone, address } → { orderId, subtotal, deliveryFee, total, etaMinutes }
- `GET /api/orders/:id` · `GET /api/orders/:id/stream` (SSE) · `GET /api/health`

## Performance
Lenis (lerp 0.09) + ScrollTrigger scrub, `will-change` só nos carrosséis, imagens lazy + Unsplash `w=900&q=80`, SSE em vez de polling, `invalidateOnRefresh` no pin horizontal.

