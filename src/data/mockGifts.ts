import { GiftItem, QuizState, CountryConfig } from "../types";

export interface BudgetRange {
  min: number;
  max: number;
  label: string;
}

export function parseBudgetRange(budgetRaw: string): BudgetRange {
  if (!budgetRaw) {
    return { min: 25, max: 50, label: "25-50€" };
  }

  const clean = budgetRaw.replace(/\s+/g, "").replace(/\$/g, "").replace(/€/g, "");

  // Check for <25 or <30
  if (clean.includes("<25") || clean.includes("<30") || clean.startsWith("<")) {
    const val = parseInt(clean.replace("<", ""), 10) || 25;
    return { min: 10, max: Math.min(val, 25), label: `<${val}€` };
  }

  // Check for >100
  if (clean.includes(">100") || clean.startsWith(">")) {
    return { min: 100, max: 300, label: ">100€" };
  }

  // Check for range like 25-50 or 50-100
  if (clean.includes("-")) {
    const parts = clean.split("-").map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
    if (parts.length >= 2) {
      return { min: parts[0], max: parts[1], label: `${parts[0]}-${parts[1]}€` };
    }
  }

  // Exact custom number (e.g. "18", "35", "150")
  const num = parseInt(clean, 10);
  if (!isNaN(num) && num > 0) {
    const minVal = Math.max(5, Math.floor(num * 0.75));
    return { min: minVal, max: num, label: `${num}€` };
  }

  // Fallback default
  return { min: 25, max: 50, label: "25-50€" };
}

// Dati di fallback usati solo quando l'API Gemini non e disponibile
// (chiave mancante, errore, timeout) — garantiscono che l'utente veda
// comunque 3 prodotti coerenti invece di un errore vuoto.
export function generateSmartFallbackGifts(quiz: QuizState, country: CountryConfig): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);

  const getPrice = (fraction: number) => {
    const val = Math.round(budgetRange.min + (budgetRange.max - budgetRange.min) * fraction);
    const finalVal = Math.min(val, budgetRange.max);
    return `${sym}${finalVal}`;
  };

  const vibeLower = (quiz.vibe || "").toLowerCase();
  const extraLower = (quiz.extraDetails || "").toLowerCase();
  const combinedText = `${vibeLower} ${extraLower}`;

  // Categoria specifica: Giardino
  if (combinedText.includes("giardino") || combinedText.includes("garden")) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: "Cesoie da Giardino Professionali con Lame in Acciaio",
        price: getPrice(0.4),
        reason: `Taglio netto e preciso, ideali per la potatura regolare di siepi e arbusti.`,
        matchScore: 98,
        tag: "Più Scelto",
        amazonSearchQuery: "Cesoie da Giardino Professionali Acciaio",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 1620,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: "Guanti da Giardinaggio Traspiranti con Rinforzo Palmo",
        price: getPrice(0.25),
        reason: `Protezione durevole e buona sensibilità per lavori di precisione all'aperto.`,
        matchScore: 96,
        tag: "Essenziale",
        amazonSearchQuery: "Guanti da Giardinaggio Traspiranti",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1585513553738-84f4c5f2c4e0?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2340,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: "Tubo da Giardino Estensibile Antigroviglio con Ugello",
        price: getPrice(0.7),
        reason: `Si estende fino a 3 volte la lunghezza a riposo, comodo da riporre senza ingombro.`,
        matchScore: 97,
        tag: "Top Qualità",
        amazonSearchQuery: "Tubo da Giardino Estensibile Antigroviglio",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewsCount: 3120,
        isPrime: true,
      },
    ];
  }

  // Categoria specifica: Elettroutensili
  if (combinedText.includes("elettro") || combinedText.includes("trapano") || combinedText.includes("power tool")) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: "Trapano Avvitatore a Batteria 18V con Valigetta e Accessori",
        price: getPrice(0.75),
        reason: `Compatto e maneggevole, kit completo di punte per iniziare subito i lavori di casa.`,
        matchScore: 99,
        tag: "Più Scelto",
        amazonSearchQuery: "Trapano Avvitatore Batteria 18V Kit Valigetta",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 4820,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: "Set Punte da Trapano Universali in Acciaio HSS (Legno/Metallo/Muro)",
        price: getPrice(0.3),
        reason: `Assortimento completo di diametri per ogni materiale, custodia rigida inclusa.`,
        matchScore: 96,
        tag: "Essenziale",
        amazonSearchQuery: "Set Punte da Trapano HSS Universali",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2150,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: "Levigatrice Orbitale Elettrica con Sistema di Aspirazione Polvere",
        price: getPrice(0.8),
        reason: `Finitura uniforme su legno e superfici verniciate, riduce la polvere nell'ambiente.`,
        matchScore: 97,
        tag: "Top Qualità",
        amazonSearchQuery: "Levigatrice Orbitale Elettrica Aspirazione",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1581147036324-c1c9a3e3d4b5?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 1780,
        isPrime: true,
      },
    ];
  }

  // Tier 1: Budget < 25€
  if (budgetRange.max <= 25) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: "Set Cacciaviti di Precisione Magnetici 32 in 1",
        price: getPrice(0.7),
        reason: `Kit compatto per riparazioni domestiche, elettronica e piccoli montaggi.`,
        matchScore: 97,
        tag: "Più Scelto",
        amazonSearchQuery: "Set Cacciaviti Precisione Magnetici 32 in 1",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1581147036324-c1c9a3e3d4b5?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 5210,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: "Metro a Nastro 5m con Blocco e Custodia Antiurto",
        price: getPrice(0.4),
        reason: `Misurazioni precise per ogni progetto di casa, gancio magnetico incluso.`,
        matchScore: 95,
        tag: "Essenziale",
        amazonSearchQuery: "Metro a Nastro 5m Blocco Antiurto",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 3400,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: "Torcia LED da Lavoro Ricaricabile con Gancio e Magnete",
        price: getPrice(0.85),
        reason: `Luce potente per lavorare in spazi stretti o poco illuminati, mani libere.`,
        matchScore: 96,
        tag: "Top Qualità",
        amazonSearchQuery: "Torcia LED da Lavoro Ricaricabile Magnete",
        category: "lighting",
        imageUrl: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewsCount: 2870,
        isPrime: true,
      },
    ].map((item, index) => ({ ...item, id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}` }));
  }

  // Tier 2: Budget 25 - 50€
  if (budgetRange.max <= 50) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: "Kit Chiavi a Bussola 1/4\" e 1/2\" con Valigetta 108 Pezzi",
        price: getPrice(0.75),
        reason: `Set completo per manutenzione e assemblaggio, adatto a officina e casa.`,
        matchScore: 98,
        tag: "Più Scelto",
        amazonSearchQuery: "Kit Chiavi a Bussola 108 Pezzi Valigetta",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 3980,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: "Multimetro Digitale con Test Continuità e Retroilluminazione",
        price: getPrice(0.5),
        reason: `Misura tensione, corrente e resistenza in sicurezza, utile per piccoli lavori elettrici.`,
        matchScore: 96,
        tag: "Essenziale",
        amazonSearchQuery: "Multimetro Digitale Retroilluminato",
        category: "electrical",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2650,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: "Organizer da Parete Modulare per Attrezzi con Ganci",
        price: getPrice(0.4),
        reason: `Tiene l'officina in ordine, attrezzi sempre a vista e a portata di mano.`,
        matchScore: 95,
        tag: "Top Qualità",
        amazonSearchQuery: "Organizer Parete Modulare Attrezzi Ganci",
        category: "storage",
        imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewsCount: 1540,
        isPrime: true,
      },
    ].map((item, index) => ({ ...item, id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}` }));
  }

  // Tier 3: Budget 50 - 100€
  if (budgetRange.max <= 100) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: "Trapano Avvitatore a Percussione a Batteria con 2 Batterie",
        price: getPrice(0.8),
        reason: `Potenza sufficiente anche per muratura, doppia batteria per non restare mai fermi.`,
        matchScore: 98,
        tag: "Più Scelto",
        amazonSearchQuery: "Trapano Avvitatore Percussione Batteria Doppia",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 2980,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: "Cassetta Attrezzi Completa 128 Pezzi con Trolley",
        price: getPrice(0.85),
        reason: `Set completo per la casa: chiavi, cacciaviti, pinze e accessori vari in un unico trolley.`,
        matchScore: 97,
        tag: "Top Qualità",
        amazonSearchQuery: "Cassetta Attrezzi Completa 128 Pezzi Trolley",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 4120,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: "Sega Circolare a Batteria con Lama al Widia e Guida Parallela",
        price: getPrice(0.7),
        reason: `Tagli dritti e precisi su legno, ideale per progetti di bricolage più impegnativi.`,
        matchScore: 96,
        tag: "Originale",
        amazonSearchQuery: "Sega Circolare Batteria Guida Parallela",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewsCount: 1690,
        isPrime: true,
      },
    ].map((item, index) => ({ ...item, id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}` }));
  }

  // Tier 4: Budget > 100€
  return [
    {
      id: `bricolo-${Date.now()}-0`,
      title: "Set Elettroutensili Combo 18V: Trapano + Avvitatore + 2 Batterie",
      price: getPrice(0.85),
      reason: `Kit professionale completo per chi vuole affrontare qualsiasi lavoro in casa o in garage.`,
      matchScore: 99,
      tag: "Più Scelto",
      amazonSearchQuery: "Set Elettroutensili Combo 18V Trapano Avvitatore",
      category: "power-tools",
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 2340,
      isPrime: true,
    },
    {
      id: `bricolo-${Date.now()}-1`,
      title: "Banco da Lavoro Pieghevole in Acciaio con Morsa Integrata",
      price: getPrice(0.6),
      reason: `Superficie stabile e robusta per tagli, incollaggi e assemblaggi, si ripiega per riporlo.`,
      matchScore: 97,
      tag: "Top Qualità",
      amazonSearchQuery: "Banco da Lavoro Pieghevole Morsa Integrata",
      category: "workshop",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 980,
      isPrime: true,
    },
    {
      id: `bricolo-${Date.now()}-2`,
      title: "Aspiratore Officina Multiuso Solidi e Liquidi 30L",
      price: getPrice(0.7),
      reason: `Aspira polvere, trucioli e liquidi: indispensabile per tenere pulita l'officina di casa.`,
      matchScore: 96,
      tag: "Originale",
      amazonSearchQuery: "Aspiratore Officina Multiuso Solidi Liquidi 30L",
      category: "workshop",
      imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      reviewsCount: 1230,
      isPrime: true,
    },
  ].map((item, index) => ({ ...item, id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}` }));
}
