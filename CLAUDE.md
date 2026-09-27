# CLAUDE.md — Strona marki CeraLab

Ten plik opisuje, jak zbudować i rozwijać stronę internetową marki kosmetycznej **CeraLab**. Czytaj go przed każdą zmianą w projekcie.

## Cel projektu

Jednostronicowa (one-page), w pełni animowana strona marki CeraLab, która przedstawia **trzy produkty**. Inspiracja wizualna: [bryhel.com](https://bryhel.com) (ciemna nawigacja-„pigułka”, łuki z produktami, sekcja procesu, pasek „Contact us” i ciemna stopka kontaktowa). Strona ma budować wizerunek marki „laboratoryjnej”: czystej, opartej na nauce i łagodnej dla skóry. Animacje prowadzą użytkownika przez historię marki i kolejne produkty, ale nie mogą utrudniać czytania ani spowalniać strony.

- Język treści: **polski** (`<html lang="pl">`).
- Grupa docelowa: osoby z wrażliwą lub suchą skórą, 20–45 lat, przeglądające głównie na telefonie.
- Główne wezwanie do działania (CTA): „Poznaj produkt” / „Kup teraz” (na razie linki-zaślepki `#`).

## Stos technologiczny

| Obszar | Wybór | Uwagi |
|---|---|---|
| Bundler / dev server | **Vite 8** | szablon `vanilla-ts` |
| Język | **TypeScript** (strict) | bez frameworka UI — strona jest statyczna |
| Style | **CSS** z custom properties | jeden plik tokenów + pliki per sekcja, bez Tailwinda |
| Animacje | **GSAP 3.15** + **ScrollTrigger** + **SplitText** | wszystkie wtyczki GSAP są darmowe od wersji 3.13 |
| Płynne przewijanie | **Lenis 1.3** | zsynchronizowane z ScrollTrigger |
| Grafika produktów | **AVIF + WebP** (720 i 1200 px) generowane przez **sharp** | źródła w `images/`, wynik w `public/images/` |
| Wideo hero | `videos/background-intro.mp4` → `public/videos/` | 6 s, 1920×1080, 24 fps, ~1,6 MB (~1,9 Mb/s), ma ścieżkę audio (zawsze `muted`) |
| Fonty | **hostowane lokalnie** przez `@fontsource/instrument-serif` i `@fontsource/inter` (`src/styles/fonts.css`, tylko podzbiory latin + latin-ext) | bez Google Fonts — IP odwiedzających nie trafia do Google (RODO); patrz „Typografia” |
| Strony | **MPA**: `/` (index.html), `/polityka-prywatnosci/`, `404.html` | `appType: 'mpa'`, wejścia w `build.rollupOptions.input` |

**HTML generowany w czasie budowania:** sekcje produktów, procesu i polityki oraz wspólne elementy (ikony SVG, nawigacja, stopka, kursor) są wstawiane do HTML przez wtyczkę w `vite.config.ts` (znaczniki `<!-- slot:nazwa -->` lub `<!-- slot:nazwa:argument -->`, np. `<!-- slot:nav:home -->` / `<!-- slot:nav:sub -->`) z funkcji w `src/components/templates.ts` i `src/components/layout.ts`. Nawigację i stopkę zmieniasz **tylko** w `layout.ts`. Dzięki temu dane są w jednym miejscu (`src/data/`), a treść jest widoczna bez JS. Nie wpisuj treści produktów ręcznie do `index.html`.

Nie dodawaj innych bibliotek animacji (Framer Motion, AOS, anime.js itp.) — cała choreografia ma iść przez GSAP, żeby był jeden zegar i jeden sposób wyłączania animacji.

## Komendy

```bash
npm install              # instalacja zależności
npm run dev              # serwer deweloperski (http://localhost:5173)
npm run build            # tsc + build produkcyjny do dist/
npm run preview          # podgląd builda
npm run typecheck        # tsc --noEmit
npm run optimize:images  # regeneruje public/images i public/videos z images/ i videos/
npm run test:e2e         # testy e2e + axe (Playwright) na świeżym buildzie produkcyjnym
npm run test:e2e:ui      # to samo w trybie UI Playwrighta
npm run test:e2e:report  # raport HTML z ostatniego przebiegu
```

Testy e2e: przed pierwszym uruchomieniem `npx playwright install chromium`. Konfiguracja buduje stronę do katalogu tymczasowego systemu i serwuje ją na porcie **4317** (nie 4173 - żeby nigdy nie testować starego `npm run preview`). Przy nietypowym środowisku można wskazać własny Chromium przez `PW_CHROMIUM_PATH`.

Po podmianie zdjęć w `images/products/` lub wideo w `videos/` zawsze uruchom `npm run optimize:images`. Poster wideo (`images/hero-poster.jpg`) to pierwsza klatka filmu — przy zmianie filmu trzeba go wyciągnąć ponownie.

## Struktura katalogów

```
CeraLab/
├── CLAUDE.md
├── index.html                 # strona główna: szkielet + sloty <!-- slot:... -->
├── 404.html                   # strona „nie znaleziono” (hosting serwuje ją automatycznie)
├── polityka-prywatnosci/
│   └── index.html             # /polityka-prywatnosci/
├── vite.config.ts             # sloty HTML, wejścia MPA, 404 ze statusem 404 w dev/preview
├── images/                    # ŹRÓDŁA (nie serwowane): logo/, products/*.jpg 2048², hero-poster.jpg
├── videos/                    # ŹRÓDŁO: background-intro.mp4
├── scripts/
│   └── optimize-images.mjs    # sharp: jpg → avif/webp, kopiuje wideo
├── public/                    # WYGENEROWANE przez optimize:images (+ favicon.svg)
└── src/
    ├── common.ts              # start każdej strony: fonty, style bazowe, Lenis, nawigacja, kursor, fontsReady
    ├── main.ts                # strona główna: preloader → sekcje → intro hero; obsługa wejścia z /#sekcja
    ├── pages/
    │   ├── not-found.ts       # animacje 404
    │   └── privacy.ts         # animacje polityki (spis treści, pasek postępu, wejścia sekcji)
    ├── data/
    │   ├── products.ts        # JEDYNE źródło danych o produktach
    │   ├── process.ts         # kroki sekcji „Proces”
    │   └── legal.ts           # dane administratora (zaślepki) + treść polityki prywatności
    ├── components/
    │   ├── layout.ts          # wspólne: sprite SVG, nawigacja (home/sub), stopka, kursor, PRIVACY_URL
    │   └── templates.ts       # sekcje z danych: łuki, produkty, postęp, proces, polityka, mini-łuki 404
    ├── animations/            # setup (mm, MQ, Lenis, kotwice, splitWords), preloader, hero, nav, products, process, contact, cursor
    └── styles/
        ├── fonts.css          # @fontsource — lokalne fonty
        ├── tokens.css, base.css
        ├── sections/          # global.css (nav, preloader, kursor, stopka), hero, products, process, contact
        └── pages/             # not-found.css, privacy.css
```

Zasada: **każda sekcja = jeden plik CSS + jeden moduł animacji** eksportujący funkcję `initNazwaSekcji(): void`. `main.ts` tylko je wywołuje. Media queries animacji dodawaj przez wspólne `mm.add(MQ.xxx, ...)` z `setup.ts`.

## Identyfikacja wizualna

### Logo

Logo (`images/logo/logo.jpg`) to podwójny otwarty znak „C” (dwa koncentryczne łuki) + słowo „CeraLab” w bezszeryfowym kroju. Na stronie znak jest odtworzony w SVG (`<symbol id="logo-mark">` w `index.html`, `public/favicon.svg`), a słowo jest składane Interem 500. Etykiety na opakowaniach używają tego samego układu.

### Kolory (`src/styles/tokens.css`)

Paleta wyprowadzona z **opakowań** (przezroczyste szkło + złote zamknięcia), **wideo intro** (ciepły beż skóry i szaro-beżowe tło) oraz **bryhel.com** (brzoskwinia + ciemna nawigacja/stopka).

```css
:root {
  --color-bg:        #F5F1EB;  /* porcelana — tło strony */
  --color-surface:   #FBF9F6;
  --color-studio:    #F1F0F1;  /* tło zdjęć produktów → wypełnienie łuków */
  --color-ink:       #1C1A17;  /* tekst główny, nawigacja, stopka */
  --color-ink-soft:  #564F47;  /* tekst drugorzędny */
  --color-line:      #D9D0C4;
  --color-gold:      #B8924F;  /* złoto opakowań — TYLKO dekoracja */
  --color-gold-ink:  #7A5C28;  /* złoto do tekstu */
  --color-blush:     #EBCBB9;  /* brzoskwinia — tło „Nasze produkty” */
  --color-dark:      #1C1A17;
  --color-on-dark:   #F5F1EB;

  /* kolor przewodni każdego produktu (tło przypiętej sekcji) */
  --color-cleanse:   #E6E1D8;
  --color-serum:     #F0DDB4;
  --color-cream:     #EDE3D3;
}
```

Kontrast sprawdzony (WCAG AA, min. 4.5:1): ink/bg 15.4, ink-soft/bg 6.2+, ink-soft/blush ≥ 4.6, gold-ink/bg 5.5, gold-ink/serum 4.6 (najciaśniejsze tło produktu), on-dark/dark 15.4, on-dark-soft/dark 7.8. `--color-gold` nie nadaje się na tekst.

### Typografia

- Nagłówki: **Instrument Serif** (400 + kursywa) — wąski, elegancki szeryf najbliższy krojowi z bryhel.com; ma polskie znaki.
- Tekst i UI: **Inter** 400 / 500 / 600 — zbliżony do kroju w logo.
- Skala płynna przez `clamp()` w `tokens.css` (`--fs-display`, `--fs-hero`, `--fs-h2`, `--fs-h3`, …).
- Akcent w nagłówkach: `<em>` w kursywie w kolorze `--color-gold-ink` (np. „*koi*”, „*gwarantuje sukces*”).

### Easingi i czasy (wspólne dla całej strony)

```css
:root {
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast:   0.3s;
  --dur-base:   0.8s;
  --dur-slow:   1.4s;
}
```

W GSAP używaj odpowiedników: `"expo.out"` / `"power3.out"` dla wejść, `"power2.inOut"` dla przejść między stanami. Nie używaj efektów `bounce` ani `elastic` — nie pasują do marki.

## Produkty

Dane wszystkich produktów trzymaj **wyłącznie** w `src/data/products.ts` (interfejs `Product`: `id`, `step`, `name`, `category`, `tagline`, `description`, `ingredients[] {name, role}`, `properties[] {label, value}`, `volume`, `price`, `image`, `imageAlt`, `colorVar`).

Nazwy i pojemności pochodzą **z etykiet na zdjęciach** produktów. Pozostałe pola to treści robocze — **do potwierdzenia przez właściciela marki**:

| # | id | Nazwa (z etykiety) | Pojemność | Kategoria* | Kluczowe składniki* | Cena* |
|---|---|---|---|---|---|---|
| 1 | `cleanse` | Skin Revive Cleanser | 100 ml | Żel oczyszczający | ceramidy NP/AP/EOP, gliceryna, niacynamid | 59 zł |
| 2 | `serum` | Radiance Serum | 50 ml | Serum rozświetlające | ceramidy, kwas hialuronowy, pantenol | 89 zł |
| 3 | `cream` | Ceramide Barrier Cream | 30 ml | Krem barierowy | ceramidy, skwalan, cholesterol | 79 zł |

\* zaślepka — `TODO: potwierdzić`.

Opakowania: cleanser — szklana butelka ze złotą pompką; serum — szklana butelka z pipetą i złotym kołnierzem; krem — szklany słoik ze złotą nakrętką. Zdjęcia: 2048×2048, jasnoszare studyjne tło (~`#F1F0F1`), bez przezroczystości — dlatego pokazujemy je w łukach wypełnionych `--color-studio`. Butelki mają na zdjęciach różną skalę — pole `imageZoom` w danych (zmienna CSS `--img-zoom`) wyrównuje odstęp produktu od dołu łuku. Cleanser: `0.93`. Przy nowych zdjęciach zmierz obrys produktu i dobierz wartość.

Produkty tworzą **rytuał w 3 krokach** (oczyść → odbuduj → zabezpiecz) — ta kolejność obowiązuje w całej stronie.

Nie wymyślaj twierdzeń medycznych ani wyników badań („usuwa AZS”, „98% badanych…”). Jeśli sekcja potrzebuje liczb, użyj oczywistych zaślepek oznaczonych `TODO: potwierdzić`.

## Sekcje strony i choreografia animacji

Kolejność ustalona z właścicielem (2026-09-25): **wideo → produkty → proces → kontakt**. Wszystkie teksty po polsku.

### 0. Preloader (`#preloader`)
- Widoczny tylko z JS. Dwa łuki znaku „C” rysowane obrysem (`stroke-dashoffset`) + licznik 0 → 100%.
- Czeka na fonty (maks. 2 s), potem kurtyna w górę (`yPercent: -100`, `expo.inOut`); intro hero startuje w połowie kurtyny.
- Pierwsza wizyta ~2,4 s, kolejne w sesji (`sessionStorage`) ~0,6 s. Przy `reduced-motion` tylko zanikanie.

### 1. Hero z wideo (`#hero`)
- Tło: `background-intro.mp4` (`autoplay muted loop playsinline`, poster WebP). Na desktopie tekst po lewej na jasnym gradiencie, na telefonie na dole (gradient od dołu), kadr przesunięty na twarz (`object-position: 68%`).
- Nagłówek „Nauka, która *koi* skórę.” — słowa wjeżdżają z maską (SplitText), potem lead i CTA „Poznaj produkty”.
- Przy scrollu (`scrub`): tekst odjeżdża i zanika, wideo zostaje **na pełnej szerokości** z lekką paralaksą (`yPercent`). Bez zwężania w ramkę — decyzja właściciela.
- Przycisk pauzy wideo (WCAG 2.2.2), wideo pauzuje się poza ekranem. Przy `reduced-motion` wideo startuje zatrzymane.

### 2. Produkty (`#products`)
- **Intro „Nasze produkty”** (tło `--color-blush`): ogromny nagłówek, na który nachodzą 3 łuki ze zdjęciami (jak na bryhel.com). Łuki wyjeżdżają spod nagłówka ze scrollem (`scrub`). Na telefonie przewijany poziomo pas łuków ze snapem. Kliknięcie łuku przewija do produktu.
- **Showcase** — desktop (≥ 900 px szer. i ≥ 720 px wys.): sekcja **przypięta**, produkty podmieniają się w miejscu: tło zmienia kolor na `colorVar`, stary łuk wyjeżdża w górę z obrotem, nowy wjeżdża od dołu, nazwa słowami przez maskę, reszta treści (Skład, Właściwości, cena, CTA) z `stagger`. Snap do produktów (`labelsDirectional`). Na dole nawigacja 01/02/03 (klik → `lenis.scrollTo`).
- Telefon / niski ekran: bez pinowania — produkty jeden pod drugim, każdy na swoim kolorze, wejście `y: 40 → 0`.
- To jedyna przypięta sekcja na stronie (zalecenie UI UX Pro Max: maks. 1–2 piny).

### 3. Proces (`#process`) — „Proces, który *gwarantuje sukces*”
- 6 kroków z `src/data/process.ts`: Potrzeby skóry → Formulacja → Testy i bezpieczeństwo → Opakowanie → Produkcja i kontrola → Twój rytuał (treści robocze, `TODO: potwierdzić` kroki 3 i 5).
- Desktop: lewa kolumna z nagłówkiem przyklejona (`position: sticky`, bez pinowania GSAP) + złoty pasek postępu (`scrub`); prawa kolumna z krokami.
- Każdy krok: linia rysuje się (`scaleX`), numer i tekst wjeżdżają; aktywny krok (środek ekranu) ma złoty numer i ciemną linię.

### 4. Kontakt (`#contact`)
- Ciemna sekcja z zaokrąglonymi górnymi rogami. Nieskończony pasek „SKONTAKTUJ SIĘ” (przyspiesza i odwraca kierunek razem ze scrollem, pauzuje poza ekranem).
- „Porozmawiajmy” + okrągły przycisk „Napisz do nas” (`mailto:`), pionowa linia, dane w dwóch rzędach: **e-mail + telefon**, **sklep + Instagram** (od 360 px; węższe ekrany — jeden pod drugim). Font `clamp(1.25rem, 2.2vw, 2.25rem)`, wartości nigdy się nie łamią (`white-space: nowrap`) — **zaślepki, `TODO: potwierdzić`**.
- Stopka (wspólna, `layout.ts`): „© CeraLab 2026” + link do `/polityka-prywatnosci/`.

### Strona 404 (`404.html`)
- „4 C 4” — zero to znak z logo rysowany obrysem i powoli obracający się; tytuł „Tej strony nie ma w naszej *recepturze*.” (słowa z maską), przyciski „Strona główna” i „Zobacz produkty” (wskazanie UI UX Pro Max: zawsze droga powrotu).
- Na dole trzy małe łuki z produktami unoszące się (`sine.inOut`, yoyo) + paralaksa za kursorem (desktop). `noindex`.
- Hosting (Netlify, Vercel, GitHub Pages, Cloudflare Pages) serwuje `404.html` automatycznie; na innym serwerze trzeba to skonfigurować (np. `ErrorDocument 404 /404.html`).

### Polityka prywatności (`/polityka-prywatnosci/`)
- Treść w `src/data/legal.ts` — **wzór oparty na RODO i polskich ustawach, do weryfikacji przez prawnika**. Dane administratora i dostawców to widoczne zaślepki (`.placeholder`, złote tło z przerywanym podkreśleniem).
- Układ: duży tytuł, karty „W skrócie”, spis treści przyklejony z boku (desktop) / zwijany (telefon), 12 sekcji, cele przetwarzania jako karty (nie tabela — czytelne na telefonie).
- Animacje: pasek postępu czytania u góry i w linii spisu treści (`scrub`), podświetlanie aktywnego punktu, subtelne wejścia tekstu (mały ruch ~12 px, 0,4 s — wytyczne UI UX Pro Max dla długich treści).
- Polityka opisuje stan „bez cookies, bez analityki, bez formularzy, wszystko hostowane lokalnie”. **Dodanie analityki, pikseli, newslettera, osadzonych filmów/map wymaga aktualizacji `legal.ts` i banera zgód** (art. 399 Prawa komunikacji elektronicznej).

### Elementy globalne
- **Nawigacja**: półprzezroczysta „pigułka” z rozmyciem tła (matowe szkło: porcelana 60% + `backdrop-filter: blur(18px)`, ciemny tekst); nad sekcją kontaktu przechodzi w przygaszony ciemny wariant (klasa `.is-on-dark`). Kolory przez zmienne `--nav-*` w `global.css`. Logo + Produkty / Proces / Kontakt + „Kup teraz”, chowa się przy scrollu w dół, wraca w górę i przy fokusie klawiatury. Na < 900 px przycisk „Menu” (`aria-expanded`, Escape zamyka). Aktywny link podkreślony wg sekcji w widoku.
- Kotwice przewijane przez Lenis, fokus przenoszony na sekcję docelową.
- **Własny kursor** (tylko `(pointer: fine)` bez reduced-motion): kółko z `mix-blend-mode: difference`, powiększa się nad linkami i przyciskami (także nad łukami produktów). **Bez etykiet typu „Zobacz”** — decyzja właściciela. Natywny kursor zostaje. Przyciski `[data-magnetic]` przyciągają się do kursora.

## Zasady pisania animacji

0. **Bez mignięć przy ładowaniu.** Każda strona ma w `<head>` krytyczny CSS (`renderCritical()` w `layout.ts`, slot `<!-- slot:critical -->`): tło, kolor, preloader od pierwszej klatki, ukryte `nav` i `main` do czasu klasy `is-ready`. Strona wywołuje `markReady()` (z `common.ts`) dopiero po ustawieniu stanów początkowych animacji; bezpiecznik w `<head>` dodaje `is-ready` po 4 s, gdyby JS się nie wczytał. Każdy inline `<svg>` ma atrybuty `width`/`height` (bez CSS SVG rozciąga się na całą szerokość). Rysowane obrysy mają `pathLength="1"` i są ukryte w krytycznym CSS.

1. **Animuj tylko `transform` i `opacity`** (oraz `clip-path` / `stroke-dashoffset` dla SVG). Nigdy `top`, `left`, `width`, `height`, `margin`.
2. Stan początkowy ustawiaj w GSAP (`gsap.set` / `from`), a treść w HTML ma być widoczna domyślnie — gdy JS się nie załaduje, strona musi być czytelna.
3. Aby uniknąć mignięcia przed startem JS, dodaj klasę `js` na `<html>` w inline skrypcie w `<head>` i ukrywaj elementy tylko pod `.js`.
4. Wszystkie animacje zależne od szerokości ekranu i preferencji twórz w **`gsap.matchMedia()`** w `animations/setup.ts`, żeby czyściły się automatycznie przy zmianie breakpointu.
5. **`prefers-reduced-motion: reduce`**: wyłącz Lenis, pinowanie, paralaksę, pętle i kursor; zostaw tylko krótkie zanikanie (`autoAlpha`, ≤ 0.3 s). To wymóg, nie opcja.
6. Lenis łącz z ScrollTrigger w jeden sposób:
   ```ts
   const lenis = new Lenis();
   lenis.on('scroll', ScrollTrigger.update);
   gsap.ticker.add((time) => lenis.raf(time * 1000));
   gsap.ticker.lagSmoothing(0);
   ```
7. Po załadowaniu fontów i obrazów wywołaj `ScrollTrigger.refresh()` (`document.fonts.ready` + `load`), inaczej pozycje pinów będą błędne.
8. `markers: true` tylko lokalnie — nie commituj.
9. Nie dodawaj globalnego `will-change` na wszystkie elementy; tylko na czas trwania animacji dla ciężkich warstw.
10. SplitText dziel na **słowa z maską** (`splitWords()` z `setup.ts`), nie na linie — słowa nie zmieniają się przy zmianie szerokości, więc animacja się nie psuje. Maski mają zapas na polskie ogonki (`.sw-mask` w `base.css`).
11. **Kolejność ScrollTriggerów a piny.** GSAP liczy triggery w kolejności tworzenia. Trigger sekcji leżącej **pod** przypiętą sekcją, a utworzony **przed** nią (np. w `initNav()`, które startuje w `bootCommon()` przed `initProducts()`), dostaje pozycje bez wysokości pina. Takie triggery muszą mieć `refreshPriority: -1` (stała `SECTIONS_AFTER_PINS` w `nav.ts`).

## Dostępność

- Semantyczny HTML: `header`, `nav`, `main`, `section` z nagłówkami `h1`–`h3` w poprawnej kolejności (jedno `h1` w hero).
- Każde zdjęcie produktu ma `alt` z nazwą i kategorią; dekoracyjne SVG mają `aria-hidden="true"`.
- Widoczny stan `:focus-visible` dla wszystkich interaktywnych elementów; własny kursor nie może ukrywać fokusu.
- Tekst dzielony przez SplitText musi zachować czytelność dla czytników ekranu (używaj opcji `aria: "auto"` lub `aria-label` na elemencie nadrzędnym).
- Nawigacja klawiaturą przez wszystkie 3 produkty musi działać także w wersji przypiętej.

## Wydajność

- Cel Lighthouse (mobile): **Performance ≥ 90, Accessibility ≥ 95**.
- Zdjęcia produktów: WebP/AVIF, maks. ~200 KB każde, `width`/`height` w HTML, `loading="lazy"` dla wszystkiego poniżej hero; obrazy hero z `fetchpriority="high"`.
- Fonty: tylko potrzebne wagi i podzbiory (latin, latin-ext), hostowane lokalnie — nie wracać do Google Fonts (RODO).
- Animacja ma działać płynnie (60 fps) na średniej klasy telefonie — sprawdzaj w DevTools z throttlingiem CPU 4×.

## Responsywność

Breakpointy (mobile-first):

```css
/* bazowo: < 768px   — telefon */
@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 1200px) { /* desktop */ }
```

Na telefonie: brak kursora, brak paralaksy od myszy, brak pinowania sekcji produktów, krótsze czasy animacji. Brak poziomego scrolla strony na żadnej szerokości.

## Definicja „gotowe”

Zmiana jest skończona, gdy:

- [ ] `npm run typecheck`, `npm run build` i `npm run test:e2e` przechodzą bez błędów,
- [ ] strona działa i wygląda poprawnie na 375 px, 768 px i 1440 px szerokości,
- [ ] wszystkie 3 produkty są widoczne i czytelne z włączonym `prefers-reduced-motion`,
- [ ] strona jest czytelna z wyłączonym JavaScriptem,
- [ ] brak błędów w konsoli przeglądarki,
- [ ] dane produktów pochodzą tylko z `src/data/products.ts`.

## Rozszerzenia (nie realizować bez prośby)

- Modele 3D butelek (`three` + pliki GLB, bez Reacta) obracane scrollem w sekcji produktów.
- Podstrony produktów z przejściami stron (View Transitions API).
- Integracja ze sklepem (Shopify / WooCommerce) i realny formularz newslettera.
- Wersja angielska.

## Narzędzia projektowe — UI UX Pro Max

Zainstalowany skill **UI UX Pro Max** v2.13.0 ([repo](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), commit `dcc40ff`, licencja MIT) w `.claude/skills/` (zakres projektu). Zawiera 7 skilli:

| Skill | Do czego |
|---|---|
| `ui-ux-pro-max` | główny: style, palety, pary fontów, wytyczne UX, presety GSAP, stosy |
| `design-system` | architektura tokenów (primitive → semantic → component) |
| `brand` | głos marki, identyfikacja, spójność |
| `design`, `banner-design`, `slides`, `ui-styling` | logo/CIP, banery, prezentacje, shadcn/Tailwind (poza zakresem tej strony — Tailwind nie jest używany) |

Wyszukiwarka (Python 3, bez zależności) — uruchamiaj z katalogu `CeraLab/`:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<zapytanie>" --design-system -p "CeraLab"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<zapytanie>" --domain ux      # też: style, color, typography, gsap, landing
```

**Hierarchia decyzji:** ten plik (`CLAUDE.md`) jest nadrzędny. Wyniki skilla traktuj jako rekomendacje i checklisty (dostępność, UX, animacje) — nie nadpisuj nimi kolorów, fontów ani stosu zdefiniowanych wyżej bez zgody właściciela. Przykład: próbne zapytanie zaproponowało styl „Liquid Glass” i fonty Cormorant/Montserrat — **odrzucone**; obowiązują paleta i fonty z sekcji „Identyfikacja wizualna”.

Aktualizacja skilla: sklonuj repo ponownie, skopiuj `.claude/skills/*` do `CeraLab/.claude/skills/` i w `ui-ux-pro-max/SKILL.md` użyj ścieżki `.claude/skills`.

## Dziennik zmian i plany

Wpisy od najnowszego. Każda istotna zmiana lub decyzja trafia tutaj (data, co, dlaczego).

### 2026-09-27 – testy e2e (Playwright + axe) i poprawki, które wykryły
- **Zestaw testów** w `e2e/` (projekty `desktop` 1440×900 i `mobile` Pixel 7): smoke wszystkich stron (status, jedno `h1`, zero błędów JS i konsoli, zero zasobów 4xx), brak poziomego scrolla (320-1440 px), czytelność bez JS, meta SEO + robots + sitemap, nawigacja (kotwice, fokus, aktywny link, menu mobilne, skip link, wejście z `/#sekcja`), wideo, reduced-motion, showcase z klawiatury, spis treści polityki, wewnętrzne linki i kotwice, **axe WCAG 2.2 AA** na każdej stronie (z reduced-motion i po intro z animacjami) + otwarte menu mobilne. Wynik: 85 zaliczonych, stabilnie w kolejnych przebiegach. Pominięcia są celowe (test tylko dla jednego urządzenia).
- **Błąd: aktywny link i ciemna nawigacja liczone bez pina.** Po kliknięciu „Proces” podświetlał się „Kontakt”, a nawigacja ciemniała nad jasną sekcją procesu - triggery z `initNav()` były przesunięte o ~2 wysokości ekranu (spacer przypiętego showcase). Naprawa: `refreshPriority: -1` (zasada 11). Efekt uboczny poprawki, zgodny z projektem: przy 1440×900 kontakt ze stopką jest niższy niż ekran i nigdy nie dojeżdża pod nawigację, więc ciemny wariant pojawia się tylko na niższych ekranach. **Do decyzji właściciela**, czy tak ma zostać (alternatywa: przełączać przy `top 50%` albo wydłużyć sekcję kontaktu).
- **Błąd: kontrast.** `--color-gold-ink` na tle serum (`#F0DDB4`) miał 4.43:1 (kategoria produktu „Serum rozświetlające”). Zmiana `#7D5F2A` → `#7A5C28` (serum 4.63, porcelana 5.5) - wizualnie praktycznie bez różnicy.
- **Błąd: serwer 404 w dev/preview padał.** Wyjątek w handlerze 404 (brak pliku, źle zakodowany URL typu `/%E0%A4%A.html` w `decodeURIComponent`, absolutny `outDir` sklejany przez `join`) był nieobsłużonym odrzuceniem Promise i zabijał cały serwer. Teraz `try/catch` → `next(error)`, bezpieczne dekodowanie i `resolve()` dla `outDir`.
- Znane zaślepki raportowane przez testy jako adnotacja (nie błąd): 5 linków `href="#"` na stronie głównej.

### 2026-09-26 – SEO: meta, robots.txt, sitemap.xml
- Tytuł, opis, canonical, Open Graph, Twitter Card i JSON-LD `Organization` (tylko strona główna) generowane przez slot `<!-- slot:seo:home -->` / `<!-- slot:seo:privacy -->` z `renderSeo()` w `layout.ts`. Tytuły i opisy stron zmieniasz **tylko** w `seoPages` w `layout.ts` - nie wpisuj `<title>` ani `meta description` ręcznie do HTML.
- `robots.txt` i `sitemap.xml` generowane przy buildzie (wtyczka `ceralab-seo-files` w `vite.config.ts`), w dev serwowane pod tymi samymi adresami. Nowa podstrona = nowy wpis w `seoPages`.
- Domena `SITE_URL = 'https://ceralab.pl'` - **zaślepka, `TODO: potwierdzić`** przed wdrożeniem.
- `og:image` to tymczasowo poster wideo (WebP 1920×1080). Docelowo: dedykowany obraz 1200×630 w JPG/PNG (część platform słabo obsługuje WebP w podglądach).
- 404 bez zmian (`noindex`, poza sitemapą).

### 2026-09-25 — README dla GitHuba
- Dodano `README.md` (po polsku): opis strony, podgląd, sekcje, technologie, architektura, dostępność, prywatność, uruchomienie, struktura, edycja treści, wdrożenie, status.
- **Zrzuty ekranu w repozytorium** (`docs/screenshots/`, 12 plików JPG, łącznie ~660 KB) — widoczne od razu na GitHubie, bez klonowania. 8 z komputera (1440×900: hero, produkty, karta serum, proces, kontakt, 404, polityka ×2) i 4 z telefonu (390×844). Zrobione w Playwright z ukrytym kursorem i paskiem przewijania.
- Sekcja „Status / do potwierdzenia przez właściciela” **usunięta z README na prośbę właściciela** — otwarte kwestie prowadzimy tylko tutaj, w CLAUDE.md.
- **Przy większych zmianach wyglądu odśwież zrzuty** (te same nazwy plików), żeby README nie pokazywało starej wersji.
- `.gitignore` (zmieniony przez właściciela) wyklucza `.claude/` — skille i lokalne konfiguracje nie trafiają do repozytorium.

### 2026-09-25 — mignięcia, wideo, kursor
- **Mignięcie ogromnego logo „C” przy odświeżaniu** (czarne na głównej, niebieskie na polityce): w trybie dev Vite wstrzykuje CSS przez JS, więc przez pierwsze milisekundy SVG bez rozmiaru zajmowało całą szerokość, a logo w linku miało domyślny niebieski kolor. Naprawione: atrybuty `width`/`height` na wszystkich inline SVG + krytyczny CSS w `<head>` każdej strony + ukrycie nawigacji i treści do `markReady()`. Obrysy znaku (preloader, 404) mają `pathLength="1"` i nie migają przed rysowaniem. Zweryfikowane na HTML bez JS i CSS: pierwsza klatka to mały znak „C” i „0%”.
- **Wideo intro nie zwęża się już przy scrollu** — usunięty `clip-path`; została tylko paralaksa i zanikanie tekstu.
- **Usunięta etykieta „Zobacz”** z kursora nad łukami produktów (i cały kod `is-more`/`data-cursor`).

### 2026-09-25 — kontakt, 404, polityka prywatności
- **Kontakt:** dane w dwóch rzędach (e-mail + telefon, sklep + Instagram), mniejszy font skalowany do miejsca. Zmierzone od 360 do 1440 px: dwa rzędy, jedna linia, bez nachodzenia; 320 px — jeden pod drugim.
- **Strona 404** z animowanym znakiem „C” jako zerem i łukami produktów; w dev/preview nieistniejące adresy zwracają ją ze statusem 404.
- **Polityka prywatności** (`/polityka-prywatnosci/`), animowana. Nie znaleziono skilla prawnego (brak w zainstalowanych i w katalogu) — treść napisana na podstawie RODO (art. 6, 12–22, 28, 32, 37, rozdz. V), ustawy o ochronie danych osobowych, ustawy o świadczeniu usług drogą elektroniczną i art. 399 Prawa komunikacji elektronicznej (cookies/pamięć urządzenia). **Wymaga weryfikacji prawnika przed publikacją.**
- **Fonty przeniesione z Google Fonts na hosting lokalny (@fontsource)** — strona nie przekazuje już IP odwiedzających do Google; polityka może uczciwie stwierdzić brak połączeń z podmiotami trzecimi.
- **Refaktor:** wspólne elementy w `src/components/layout.ts` i `src/common.ts`; Vite w trybie MPA (3 wejścia). Przewijanie do kotwic respektuje `scroll-margin-top` (Lenis robi to sam — nie dodawać własnego offsetu).
- **Do uzupełnienia w `legal.ts`:** nazwa firmy, adres, NIP, REGON, KRS/CEIDG, dostawca hostingu i poczty, okres przechowywania logów, data wejścia w życie, decyzja o inspektorze ochrony danych. Do potwierdzenia z prawnikiem: czy zapis `sessionStorage` (pominięcie preloadera) mieści się w wyjątku od zgody z art. 399 PKE — alternatywnie można z niego zrezygnować.
- **Otwarta decyzja właściciela:** dokąd prowadzi „Poznaj produkt” (podstrony produktów vs sklep) — patrz rozmowa z 2026-09-25; na razie `href="#"`.

### 2026-09-25 — poprawki po pierwszym przeglądzie
- **Nowe wideo intro** (bardziej realistyczne, od właściciela): ten sam format (6 s, 1920×1080), lżejszy plik (1,6 MB). Wygenerowano nowy poster z pierwszej klatki (`npm run optimize:images`).
- **„Nasze produkty”:** cleanser był za blisko (na zdjęciu butelka jest większa i stoi niżej). Dodano pole `imageZoom` w `products.ts` → `--img-zoom` w CSS; cleanser `0.93`. Dolny odstęp wszystkich trzech produktów jest teraz równy (zmierzone: podstawy na 587/588/590 px przy łuku kończącym się na 636 px, widok 1440 px).
- **Nawigacja:** pełna czerń była zbyt narzucająca się → półprzezroczyste „matowe szkło” w kolorze porcelany z ciemnym tekstem; nad ciemnym kontaktem automatycznie przygaszony ciemny wariant. Usunięto nieużywaną klasę `.btn--outline-light`.
- **Kontakt:** e-mail łamał się i nachodził na sąsiednią kolumnę → e-mail zajmuje cały wiersz, wartości bez łamania, nieco mniejsza skala fontu. Sprawdzone na 320, 375, 768, 900, 1024, 1280 i 1440 px: jedna linia, brak nachodzenia i poziomego scrolla.

### 2026-09-25 — pierwsza wersja strony
- **Nowy kierunek od właściciela:** strona w stylu bryhel.com; start od wideo `videos/background-intro.mp4`, potem animowane produkty ze składem i właściwościami, potem „Proces, który gwarantuje sukces” i „Kontakt”. Całość po polsku.
- **Analiza materiałów:** logo = podwójny łuk „C” + „CeraLab” (sans); 3 zdjęcia produktów (szkło + złote zamknięcia, jasnoszare tło, 2048²); wideo 6 s 1920×1080 z modelką i serum z pipetą (ma ścieżkę audio → zawsze `muted`).
- **Zmiana identyfikacji (nadpisuje wcześniejsze założenia):** paleta z chłodnego błękitu → porcelana + złoto + brzoskwinia + głęboka czerń (zgodna z opakowaniami, wideo i inspiracją); fonty Fraunces → **Instrument Serif** (nagłówki) + Inter (tekst).
- **Produkty:** nazwy i pojemności wzięte z etykiet (Skin Revive Cleanser 100 ml, Radiance Serum 50 ml, Ceramide Barrier Cream 30 ml). Kategorie, składniki, właściwości i ceny nadal robocze.
- **Sekcje:** usunięte z planu „O marce”, „Składniki” (osobna), „Rytuał” i newsletter — skład pokazujemy przy każdym produkcie, a rytuał jest ostatnim krokiem procesu. Można je przywrócić później.
- **Zbudowane:** projekt Vite + TS strict, GSAP 3.15 (ScrollTrigger, SplitText), Lenis; skrypt `optimize:images` (sharp); zdjęcia 1,3 MB → 10–20 KB; poster wideo z pierwszej klatki; logo i favicon w SVG; sekcje generowane z danych przy budowaniu.
- **Zweryfikowane (Playwright):** 1440×900 i 375×812 wyglądają poprawnie, brak poziomego scrolla, brak błędów w konsoli, `typecheck` i `build` przechodzą. Przy `reduced-motion`: bez Lenis, bez pinowania, preloader znika, wideo zatrzymane z przyciskiem „Odtwórz”, cała treść widoczna.
- **Uwaga techniczna:** konfiguracja podglądu dla aplikacji Claude jest w `.claude/launch.json` (`ceralab-dev`, port 5173).
- **Do potwierdzenia przez właściciela:** kategorie/składniki/ceny produktów, treść kroków procesu (szczególnie „Testy i bezpieczeństwo”, „Produkcja i kontrola”), dane kontaktowe (e-mail, telefon, Instagram, adres sklepu), linki „Kup teraz” / „Poznaj produkt”.
- **Następne kroki (plan):**
  1. Przegląd wersji przez właściciela → poprawki treści i proporcji.
  2. Test Lighthouse (mobile) i dostrojenie wydajności (np. lżejsza wersja wideo na telefon, usunięcie ścieżki audio z pliku).
  3. Podstrony produktów / realne linki do sklepu (patrz „Rozszerzenia”).
  4. Opcjonalnie: sekcja „As seen in” / opinie, newsletter, wersja angielska.

### 2026-09-25 — instalacja narzędzi
- **Zainstalowano UI UX Pro Max** (v2.13.0) w `.claude/skills/` — przed rozpoczęciem projektowania strony. Usunięto katalog testów skilla; ścieżki w `SKILL.md` przepięte z `${CLAUDE_PLUGIN_ROOT}` na ścieżkę projektu. Sprawdzone: `search.py --design-system` działa na Pythonie 3.9.
