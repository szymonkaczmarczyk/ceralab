
const ph = (label: string) => `<span class="placeholder" title="Do uzupełnienia">[${label}]</span>`;

export const company = {
  name: ph('pełna nazwa firmy'),
  address: ph('adres siedziby'),
  nip: ph('NIP'),
  regon: ph('REGON'),
  register: ph('KRS lub wpis do CEIDG'),
  email: 'kontakt@ceralab.pl',
  hosting: ph('nazwa dostawcy hostingu'),
  mail: ph('nazwa dostawcy poczty e-mail'),
  logRetention: ph('np. 30 dni — potwierdzić u dostawcy hostingu'),
};

export const policyMeta = {
  effectiveDate: ph('data wejścia w życie'),
  updated: '25 września 2026 r.',
};

export const policySummary: { title: string; text: string }[] = [
  { title: 'Bez śledzenia', text: 'Nie używamy plików cookies analitycznych ani reklamowych i nie profilujemy odwiedzających.' },
  { title: 'Tylko to, co niezbędne', text: 'Dane osobowe przetwarzamy głównie wtedy, gdy sam do nas napiszesz lub zadzwonisz.' },
  { title: 'Bez sprzedaży danych', text: 'Nie sprzedajemy ani nie udostępniamy Twoich danych w celach marketingowych.' },
  { title: 'Twoje prawa', text: 'Możesz żądać dostępu do danych, ich usunięcia lub sprzeciwić się przetwarzaniu.' },
];

export interface Purpose {
  name: string;
  data: string;
  basis: string;
  period: string;
}

const purposes: Purpose[] = [
  {
    name: 'Odpowiedź na wiadomość e-mail lub rozmowę telefoniczną',
    data: 'adres e-mail lub numer telefonu, imię i nazwisko (jeśli je podasz), treść wiadomości',
    basis: 'art. 6 ust. 1 lit. f RODO — nasz prawnie uzasadniony interes, czyli udzielenie odpowiedzi; jeśli pytasz o zawarcie umowy — art. 6 ust. 1 lit. b RODO',
    period: 'do zakończenia korespondencji, a następnie do upływu okresu przedawnienia ewentualnych roszczeń',
  },
  {
    name: 'Zapewnienie działania i bezpieczeństwa serwisu',
    data: 'adres IP, data i godzina wizyty, typ przeglądarki i systemu, adres odwiedzanej podstrony (logi serwera)',
    basis: 'art. 6 ust. 1 lit. f RODO — nasz prawnie uzasadniony interes, czyli utrzymanie serwisu i ochrona przed nadużyciami',
    period: `przez okres przechowywania logów przez dostawcę hostingu: ${company.logRetention}`,
  },
  {
    name: 'Ustalenie, dochodzenie lub obrona roszczeń',
    data: 'dane z korespondencji niezbędne do wykazania przebiegu sprawy',
    basis: 'art. 6 ust. 1 lit. f RODO — nasz prawnie uzasadniony interes, czyli ochrona praw',
    period: 'do upływu okresu przedawnienia roszczeń',
  },
  {
    name: 'Wypełnienie obowiązków prawnych',
    data: 'dane wymagane przepisami, np. przy wystawieniu dokumentów księgowych',
    basis: 'art. 6 ust. 1 lit. c RODO — obowiązek prawny ciążący na administratorze',
    period: 'przez okres wymagany przepisami, np. podatkowymi i rachunkowymi',
  },
];

export interface PolicySection {
  id: string;
  title: string;
  html: string;
}

const purposeCards = purposes
  .map(
    (p) => `<article class="purpose">
      <h3 class="purpose-name">${p.name}</h3>
      <dl class="purpose-grid">
        <div><dt>Dane</dt><dd>${p.data}</dd></div>
        <div><dt>Podstawa prawna</dt><dd>${p.basis}</dd></div>
        <div><dt>Okres przechowywania</dt><dd>${p.period}</dd></div>
      </dl>
    </article>`,
  )
  .join('\n');

export const policySections: PolicySection[] = [
  {
    id: 'administrator',
    title: 'Administrator danych',
    html: `<p>Administratorem Twoich danych osobowych jest ${company.name}, z siedzibą: ${company.address}, NIP: ${company.nip}, REGON: ${company.regon}, ${company.register} (dalej: <strong>„CeraLab”</strong> lub <strong>„my”</strong>).</p>
      <p>We wszystkich sprawach dotyczących danych osobowych możesz skontaktować się z nami pod adresem e-mail <a href="mailto:${company.email}">${company.email}</a> lub pisemnie na adres siedziby.</p>
      <p>Nie wyznaczyliśmy inspektora ochrony danych, ponieważ nie mamy takiego obowiązku (art. 37 RODO). ${ph('zmienić, jeśli inspektor zostanie wyznaczony')}</p>`,
  },
  {
    id: 'zakres',
    title: 'Czego dotyczy ta polityka',
    html: `<p>Polityka opisuje, jak przetwarzamy dane osobowe w związku z korzystaniem ze strony internetowej CeraLab oraz kontaktem z nami. Informacje przekazujemy zgodnie z art. 13 i 14 RODO.</p>
      <p>Sklep internetowy oraz nasze profile w mediach społecznościowych mogą podlegać odrębnym regulaminom i politykom prywatności — zapoznaj się z nimi przed skorzystaniem z tych usług.</p>`,
  },
  {
    id: 'cele',
    title: 'Jakie dane przetwarzamy i dlaczego',
    html: `<p>Samo przeglądanie strony nie wymaga podawania żadnych danych. Przetwarzamy je w następujących celach:</p>
      <div class="purposes">${purposeCards}</div>
      <p>Okres przedawnienia roszczeń wynika z Kodeksu cywilnego i co do zasady wynosi 6 lat, a dla roszczeń związanych z działalnością gospodarczą — 3 lata.</p>`,
  },
  {
    id: 'cookies',
    title: 'Pliki cookies i pamięć przeglądarki',
    html: `<p>Strona <strong>nie używa plików cookies</strong> — ani analitycznych, ani reklamowych — i nie korzysta z narzędzi śledzących (np. pikseli reklamowych czy statystyk zewnętrznych dostawców).</p>
      <p>Korzystamy wyłącznie z <strong>pamięci sesji przeglądarki</strong> (sessionStorage), w której zapisujemy jedną techniczną informację: czy animacja wstępna została już wyświetlona w bieżącej karcie. Dzięki temu przy kolejnych przejściach nie musisz jej oglądać ponownie. Informacja nie zawiera danych osobowych, nie służy do identyfikacji i jest usuwana automatycznie po zamknięciu karty. Zasady przechowywania informacji w urządzeniu końcowym określa art. 399 ustawy – Prawo komunikacji elektronicznej.</p>
      <p>Fonty, zdjęcia i wideo są przechowywane na naszym serwerze — podczas wizyty Twoja przeglądarka nie łączy się z serwerami podmiotów trzecich (np. Google Fonts).</p>
      <p>Pamięć przeglądarki możesz w każdej chwili wyczyścić w jej ustawieniach.</p>`,
  },
  {
    id: 'odbiorcy',
    title: 'Komu przekazujemy dane',
    html: `<p>Twoje dane mogą być przekazywane wyłącznie podmiotom, które pomagają nam prowadzić serwis i działalność, na podstawie umów powierzenia przetwarzania danych (art. 28 RODO):</p>
      <ul>
        <li>dostawcy hostingu strony — ${company.hosting},</li>
        <li>dostawcy poczty elektronicznej — ${company.mail},</li>
        <li>podmiotom świadczącym usługi księgowe lub prawne — jeśli jest to niezbędne.</li>
      </ul>
      <p>Dane mogą zostać udostępnione także organom publicznym, jeśli wymagają tego przepisy prawa.</p>`,
  },
  {
    id: 'poza-eog',
    title: 'Przekazywanie danych poza EOG',
    html: `<p>Co do zasady nie przekazujemy danych poza Europejski Obszar Gospodarczy. Jeśli któryś z naszych dostawców przetwarza dane poza EOG, odbywa się to wyłącznie przy zastosowaniu zabezpieczeń przewidzianych w rozdziale V RODO — w szczególności na podstawie decyzji Komisji Europejskiej stwierdzającej odpowiedni stopień ochrony lub standardowych klauzul umownych.</p>`,
  },
  {
    id: 'prawa',
    title: 'Twoje prawa',
    html: `<p>W związku z przetwarzaniem danych przysługuje Ci prawo do:</p>
      <ul class="rights">
        <li><strong>dostępu</strong> do swoich danych i otrzymania ich kopii (art. 15 RODO),</li>
        <li><strong>sprostowania</strong> danych (art. 16 RODO),</li>
        <li><strong>usunięcia</strong> danych (art. 17 RODO),</li>
        <li><strong>ograniczenia</strong> przetwarzania (art. 18 RODO),</li>
        <li><strong>przenoszenia</strong> danych (art. 20 RODO),</li>
        <li><strong>sprzeciwu</strong> wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO),</li>
        <li><strong>cofnięcia zgody</strong> w dowolnym momencie, jeśli przetwarzanie odbywa się na jej podstawie — bez wpływu na zgodność z prawem przetwarzania przed cofnięciem (art. 7 ust. 3 RODO).</li>
      </ul>
      <p>Aby skorzystać z tych praw, napisz na <a href="mailto:${company.email}">${company.email}</a>. Odpowiemy bez zbędnej zwłoki, nie później niż w ciągu miesiąca od otrzymania żądania; w szczególnie złożonych sprawach termin ten może zostać przedłużony o kolejne dwa miesiące, o czym Cię poinformujemy (art. 12 ust. 3 RODO).</p>`,
  },
  {
    id: 'skarga',
    title: 'Skarga do organu nadzorczego',
    html: `<p>Jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem, możesz wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa, <a href="https://uodo.gov.pl" rel="noopener" target="_blank">uodo.gov.pl</a>.</p>`,
  },
  {
    id: 'dobrowolnosc',
    title: 'Dobrowolność podania danych',
    html: `<p>Podanie danych jest dobrowolne. Bez adresu e-mail lub numeru telefonu nie będziemy jednak mogli odpowiedzieć na Twoją wiadomość.</p>
      <p>Nie podejmujemy decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywoływałyby wobec Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie wpływały (art. 22 RODO).</p>`,
  },
  {
    id: 'bezpieczenstwo',
    title: 'Bezpieczeństwo danych',
    html: `<p>Stosujemy odpowiednie środki techniczne i organizacyjne, aby chronić dane przed utratą, nieuprawnionym dostępem lub zmianą (art. 32 RODO). Połączenie ze stroną jest szyfrowane (HTTPS), a dostęp do danych mają wyłącznie upoważnione osoby.</p>`,
  },
  {
    id: 'linki',
    title: 'Linki do innych serwisów',
    html: `<p>Na stronie znajdują się odnośniki do zewnętrznych serwisów, np. Instagrama (administrowanego przez Meta Platforms Ireland Ltd.) czy sklepu internetowego. Po przejściu do nich obowiązują polityki prywatności ich administratorów — nie mamy wpływu na sposób, w jaki przetwarzają dane.</p>`,
  },
  {
    id: 'zmiany',
    title: 'Zmiany polityki prywatności',
    html: `<p>Politykę możemy aktualizować, np. w razie zmiany przepisów lub funkcji serwisu. Aktualna wersja jest zawsze dostępna na tej stronie wraz z datą ostatniej aktualizacji.</p>
      <p>Polityka obowiązuje od ${policyMeta.effectiveDate}. Ostatnia aktualizacja: ${policyMeta.updated}</p>`,
  },
];

