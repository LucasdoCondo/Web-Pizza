import type { DoughOption, Pizza } from '../types';

export const DOUGHS: DoughOption[] = [
  { id: '48h', label: 'Fermentação Natural 48h', detail: 'A assinatura — alveolada, leve, digestiva', delta: 0 },
  { id: 'integral', label: 'Integral Rústica', detail: 'Farinha stone-milled + mel de castanha', delta: 1.5 },
  { id: 'gluten', label: 'Sem Glúten', detail: 'Blend de arroz + grão-de-bico, forno dedicado', delta: 2.5 }
];

export const PIZZAS: Pizza[] = [
  {
    id: 'notte',
    name: 'Bella Notte',
    tagline: 'A assinatura da casa',
    description: 'Fior di latte DOP, San Marzano, presunto 24 meses, rúcula selvagem, azeite trufado.',
    price: 18.9,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    badge: 'Assinatura',
    tags: ['Forno a lenha', 'Trufa']
  },
  {
    id: 'diavola',
    name: 'Diavola Oro',
    tagline: 'Fogo elegante',
    description: "Salame piccante, mel de malagueta, stracciatella, pesto de manjericão.",
    price: 16.5,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80',
    badge: 'Picante',
    tags: ['Mel picante', 'Stracciatella']
  },
  {
    id: 'margherita',
    name: 'Margherita D.O.P.',
    tagline: 'O clássico absoluto',
    description: 'San Marzano, fior di latte, basilico genovese, azeite monocultivar.',
    price: 12.9,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80',
    tags: ['Vegetariana', 'D.O.P.']
  },
  {
    id: 'tartufo',
    name: 'Tartufo Nero',
    tagline: 'Luxo subterrâneo',
    description: 'Creme de trufa negra, fontina, cogumelos porcini, parmesão 36 meses.',
    price: 21.9,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=900&q=80',
    badge: 'Edição luxo',
    tags: ['Trufa negra']
  },
  {
    id: 'marina',
    name: 'Marinara Antica',
    tagline: 'Nápoles, 1734',
    description: 'Tomate, alho confitado, orégãos de Pantelleria, azeite — sem queijo.',
    price: 11.9,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=80',
    tags: ['Vegana', 'Receita original']
  },
  {
    id: 'quattro',
    name: 'Quattro Formaggi',
    tagline: 'Quatro almas',
    description: 'Gorgonzola dolce, fontina, parmesão, mozzarella — mel de castanha.',
    price: 17.5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    tags: ['Queijos italianos']
  }
];

export const STATUS_LABEL: Record<string, string> = {
  RECEBIDO: 'Recebido',
  A_PREPARAR: 'A Preparar',
  NO_FORNO: 'No Forno a Lenha',
  SAIU_PARA_ENTREGA: 'Saiu para Entrega',
  ENTREGUE: 'Entregue'
};

export const money = (v: number) =>
  v.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
