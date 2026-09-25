
export interface Ingredient {
  name: string;
  role: string;
}

export interface Property {
  label: string;
  value: string;
}

export interface Product {
  id: 'cleanse' | 'serum' | 'cream';
  step: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  ingredients: Ingredient[];
  properties: Property[];
  volume: string;
  price: string;
  image: string;
  imageAlt: string;

  imageZoom?: number;
  colorVar: string;
}

export const products: Product[] = [
  {
    id: 'cleanse',
    step: 'Oczyść',
    name: 'Skin Revive Cleanser',
    category: 'Żel oczyszczający',
    tagline: 'Oczyszcza, nie wysusza.',
    description:
      'Delikatna formuła, która usuwa zanieczyszczenia i makijaż, nie naruszając naturalnej bariery ochronnej skóry. Pierwszy krok rytuału.',
    ingredients: [
      { name: 'Ceramidy NP / AP / EOP', role: 'wspierają barierę hydrolipidową' },
      { name: 'Gliceryna', role: 'wiąże wodę w naskórku' },
      { name: 'Niacynamid', role: 'wyrównuje koloryt i koi' },
    ],
    properties: [
      { label: 'Typ skóry', value: 'wrażliwa, sucha' },
      { label: 'Konsystencja', value: 'lekki żel' },
      { label: 'Stosowanie', value: 'rano i wieczorem' },
    ],
    volume: '100 ml',
    price: '59 zł',
    image: 'cleanser',
    imageAlt: 'Skin Revive Cleanser — żel oczyszczający CeraLab w szklanej butelce ze złotą pompką, 100 ml',

    imageZoom: 0.93,
    colorVar: 'var(--color-cleanse)',
  },
  {
    id: 'serum',
    step: 'Odbuduj',
    name: 'Radiance Serum',
    category: 'Serum rozświetlające',
    tagline: 'Bariera w skoncentrowanej formie.',
    description:
      'Skoncentrowane serum o lekkiej, szybko wchłaniającej się konsystencji. Nawilża, przywraca skórze blask i przygotowuje ją na krem.',
    ingredients: [
      { name: 'Ceramidy', role: 'odbudowują warstwę ochronną' },
      { name: 'Kwas hialuronowy', role: 'nawilża na kilku poziomach' },
      { name: 'Pantenol', role: 'łagodzi i regeneruje' },
    ],
    properties: [
      { label: 'Typ skóry', value: 'każdy, także wrażliwa' },
      { label: 'Konsystencja', value: 'lekkie serum' },
      { label: 'Stosowanie', value: '3–4 krople, rano i wieczorem' },
    ],
    volume: '50 ml',
    price: '89 zł',
    image: 'serum',
    imageAlt: 'Radiance Serum — serum rozświetlające CeraLab w szklanej butelce z pipetą, 50 ml',
    colorVar: 'var(--color-serum)',
  },
  {
    id: 'cream',
    step: 'Zabezpiecz',
    name: 'Ceramide Barrier Cream',
    category: 'Krem barierowy',
    tagline: 'Komfort dla wrażliwej skóry przez cały dzień.',
    description:
      'Bogaty, ale nieobciążający krem, który zamyka rytuał. Tworzy na skórze ochronną warstwę i ogranicza utratę wody.',
    ingredients: [
      { name: 'Ceramidy', role: 'uzupełniają lipidy naskórka' },
      { name: 'Skwalan', role: 'natłuszcza bez uczucia ciężkości' },
      { name: 'Cholesterol', role: 'wzmacnia strukturę bariery' },
    ],
    properties: [
      { label: 'Typ skóry', value: 'sucha, wrażliwa' },
      { label: 'Konsystencja', value: 'kremowa emulsja' },
      { label: 'Stosowanie', value: 'ostatni krok pielęgnacji' },
    ],
    volume: '30 ml',
    price: '79 zł',
    image: 'cream',
    imageAlt: 'Ceramide Barrier Cream — krem barierowy CeraLab w szklanym słoiku ze złotą nakrętką, 30 ml',
    colorVar: 'var(--color-cream)',
  },
];
