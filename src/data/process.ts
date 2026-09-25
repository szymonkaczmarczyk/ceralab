
export interface ProcessStep {
  title: string;
  lead: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Potrzeby skóry',
    lead: 'Zaczynamy od skóry, nie od trendów.',
    body: 'Każdy produkt powstaje z myślą o skórze wrażliwej i suchej. Najpierw definiujemy problem, który ma rozwiązać, i dopiero wtedy szukamy składników.',
  },
  {
    title: 'Formulacja',
    lead: 'Ceramidy w roli głównej.',
    body: 'W laboratorium dobieramy składniki aktywne i ich proporcje tak, aby wspierały naturalną barierę skóry. Krótkie składy, bez zbędnych dodatków.',
  },
  {
    title: 'Testy i bezpieczeństwo',
    lead: 'Najpierw pewność, potem półka.',
    body: 'Każda receptura przechodzi ocenę bezpieczeństwa i testy stabilności wymagane przed wprowadzeniem kosmetyku do obrotu.',
  },
  {
    title: 'Opakowanie',
    lead: 'Szkło i metal zamiast zbędnego plastiku.',
    body: 'Szklane butelki i słoiki chronią formułę, a precyzyjne pompki i pipety pozwalają dozować dokładnie tyle, ile potrzebujesz.',
  },
  {
    title: 'Produkcja i kontrola',
    lead: 'Każda partia pod kontrolą.',
    body: 'Produkujemy w małych partiach i sprawdzamy surowce oraz gotowe produkty, zanim trafią do wysyłki.',
  },
  {
    title: 'Twój rytuał',
    lead: 'Trzy kroki, codziennie.',
    body: 'Oczyść, odbuduj, zabezpiecz. Prosty rytuał, który łatwo wpleść w poranną i wieczorną pielęgnację.',
  },
];
