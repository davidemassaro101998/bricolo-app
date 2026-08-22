import { GiftItem, QuizState, CountryConfig } from "../types";
import { Language } from "./translations";

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

// Fallback data used only when the Gemini API is unavailable
// (missing key, error, timeout) — guarantees the user still sees
// 3 coherent products instead of an empty error state.
export function generateSmartFallbackGifts(
  quiz: QuizState,
  country: CountryConfig,
  language: Language = "it"
): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);
  const t = (it: string, en: string) => (language === "it" ? it : en);

  const getPrice = (fraction: number) => {
    const val = Math.round(budgetRange.min + (budgetRange.max - budgetRange.min) * fraction);
    const finalVal = Math.min(val, budgetRange.max);
    return `${sym}${finalVal}`;
  };

  const vibeLower = (quiz.vibe || "").toLowerCase();
  const extraLower = (quiz.extraDetails || "").toLowerCase();
  const combinedText = `${vibeLower} ${extraLower}`;

  // Category specific: Garden
  if (combinedText.includes("giardino") || combinedText.includes("garden")) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: t("Cesoie da Giardino Professionali con Lame in Acciaio", "Professional Garden Shears with Steel Blades"),
        price: getPrice(0.4),
        reason: t(
          `Taglio netto e preciso, ideali per la potatura regolare di siepi e arbusti.`,
          `Clean, precise cuts, ideal for regular hedge and shrub pruning.`
        ),
        matchScore: 98,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Cesoie da Giardino Professionali Acciaio",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 1620,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: t("Guanti da Giardinaggio Traspiranti con Rinforzo Palmo", "Breathable Gardening Gloves with Reinforced Palm"),
        price: getPrice(0.25),
        reason: t(
          `Protezione durevole e buona sensibilità per lavori di precisione all'aperto.`,
          `Durable protection with good dexterity for precision outdoor work.`
        ),
        matchScore: 96,
        tag: t("Essenziale", "Essential"),
        amazonSearchQuery: "Guanti da Giardinaggio Traspiranti",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1585513553738-84f4c5f2c4e0?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2340,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: t("Tubo da Giardino Estensibile Antigroviglio con Ugello", "Expandable Tangle-Free Garden Hose with Nozzle"),
        price: getPrice(0.7),
        reason: t(
          `Si estende fino a 3 volte la lunghezza a riposo, comodo da riporre senza ingombro.`,
          `Expands up to 3x its resting length, easy to store without clutter.`
        ),
        matchScore: 97,
        tag: t("Top Qualità", "Top Quality"),
        amazonSearchQuery: "Tubo da Giardino Estensibile Antigroviglio",
        category: "garden",
        imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewsCount: 3120,
        isPrime: true,
      },
    ];
  }

  // Category specific: Power tools
  if (combinedText.includes("elettro") || combinedText.includes("trapano") || combinedText.includes("power tool")) {
    return [
      {
        id: `bricolo-${Date.now()}-0`,
        title: t("Trapano Avvitatore a Batteria 18V con Valigetta e Accessori", "18V Cordless Drill Driver with Case and Accessories"),
        price: getPrice(0.75),
        reason: t(
          `Compatto e maneggevole, kit completo di punte per iniziare subito i lavori di casa.`,
          `Compact and easy to handle, complete bit set to start home jobs right away.`
        ),
        matchScore: 99,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Trapano Avvitatore Batteria 18V Kit Valigetta",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 4820,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: t("Set Punte da Trapano Universali in Acciaio HSS (Legno/Metallo/Muro)", "Universal HSS Steel Drill Bit Set (Wood/Metal/Masonry)"),
        price: getPrice(0.3),
        reason: t(
          `Assortimento completo di diametri per ogni materiale, custodia rigida inclusa.`,
          `Complete range of diameters for every material, hard case included.`
        ),
        matchScore: 96,
        tag: t("Essenziale", "Essential"),
        amazonSearchQuery: "Set Punte da Trapano HSS Universali",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2150,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: t("Levigatrice Orbitale Elettrica con Sistema di Aspirazione Polvere", "Electric Orbital Sander with Dust Extraction System"),
        price: getPrice(0.8),
        reason: t(
          `Finitura uniforme su legno e superfici verniciate, riduce la polvere nell'ambiente.`,
          `Even finish on wood and painted surfaces, cuts down on airborne dust.`
        ),
        matchScore: 97,
        tag: t("Top Qualità", "Top Quality"),
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
        title: t("Set Cacciaviti di Precisione Magnetici 32 in 1", "32-in-1 Magnetic Precision Screwdriver Set"),
        price: getPrice(0.7),
        reason: t(
          `Kit compatto per riparazioni domestiche, elettronica e piccoli montaggi.`,
          `Compact kit for household repairs, electronics and small assembly jobs.`
        ),
        matchScore: 97,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Set Cacciaviti Precisione Magnetici 32 in 1",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1581147036324-c1c9a3e3d4b5?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 5210,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: t("Metro a Nastro 5m con Blocco e Custodia Antiurto", "5m Tape Measure with Lock and Shock-Resistant Case"),
        price: getPrice(0.4),
        reason: t(
          `Misurazioni precise per ogni progetto di casa, gancio magnetico incluso.`,
          `Precise measurements for any home project, magnetic hook included.`
        ),
        matchScore: 95,
        tag: t("Essenziale", "Essential"),
        amazonSearchQuery: "Metro a Nastro 5m Blocco Antiurto",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 3400,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: t("Torcia LED da Lavoro Ricaricabile con Gancio e Magnete", "Rechargeable LED Work Light with Hook and Magnet"),
        price: getPrice(0.85),
        reason: t(
          `Luce potente per lavorare in spazi stretti o poco illuminati, mani libere.`,
          `Powerful, hands-free light for working in tight or dim spaces.`
        ),
        matchScore: 96,
        tag: t("Top Qualità", "Top Quality"),
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
        title: t(`Kit Chiavi a Bussola 1/4" e 1/2" con Valigetta 108 Pezzi`, `1/4" & 1/2" Socket Wrench Set, 108 Pieces with Case`),
        price: getPrice(0.75),
        reason: t(
          `Set completo per manutenzione e assemblaggio, adatto a officina e casa.`,
          `Complete set for maintenance and assembly, suited for workshop and home.`
        ),
        matchScore: 98,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Kit Chiavi a Bussola 108 Pezzi Valigetta",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 3980,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: t("Multimetro Digitale con Test Continuità e Retroilluminazione", "Digital Multimeter with Continuity Test and Backlight"),
        price: getPrice(0.5),
        reason: t(
          `Misura tensione, corrente e resistenza in sicurezza, utile per piccoli lavori elettrici.`,
          `Safely measures voltage, current and resistance, handy for small electrical jobs.`
        ),
        matchScore: 96,
        tag: t("Essenziale", "Essential"),
        amazonSearchQuery: "Multimetro Digitale Retroilluminato",
        category: "electrical",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 2650,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: t("Organizer da Parete Modulare per Attrezzi con Ganci", "Modular Wall-Mounted Tool Organizer with Hooks"),
        price: getPrice(0.4),
        reason: t(
          `Tiene l'officina in ordine, attrezzi sempre a vista e a portata di mano.`,
          `Keeps the workshop tidy, tools always visible and within reach.`
        ),
        matchScore: 95,
        tag: t("Top Qualità", "Top Quality"),
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
        title: t("Trapano Avvitatore a Percussione a Batteria con 2 Batterie", "Cordless Hammer Drill Driver with 2 Batteries"),
        price: getPrice(0.8),
        reason: t(
          `Potenza sufficiente anche per muratura, doppia batteria per non restare mai fermi.`,
          `Powerful enough for masonry too, dual battery so you never stop working.`
        ),
        matchScore: 98,
        tag: t("Più Scelto", "Top Pick"),
        amazonSearchQuery: "Trapano Avvitatore Percussione Batteria Doppia",
        category: "power-tools",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewsCount: 2980,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-1`,
        title: t("Cassetta Attrezzi Completa 128 Pezzi con Trolley", "Complete 128-Piece Tool Set with Trolley Case"),
        price: getPrice(0.85),
        reason: t(
          `Set completo per la casa: chiavi, cacciaviti, pinze e accessori vari in un unico trolley.`,
          `Complete home set: wrenches, screwdrivers, pliers and more in one trolley case.`
        ),
        matchScore: 97,
        tag: t("Top Qualità", "Top Quality"),
        amazonSearchQuery: "Cassetta Attrezzi Completa 128 Pezzi Trolley",
        category: "hand-tools",
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewsCount: 4120,
        isPrime: true,
      },
      {
        id: `bricolo-${Date.now()}-2`,
        title: t("Sega Circolare a Batteria con Lama al Widia e Guida Parallela", "Cordless Circular Saw with Carbide Blade and Parallel Guide"),
        price: getPrice(0.7),
        reason: t(
          `Tagli dritti e precisi su legno, ideale per progetti di bricolage più impegnativi.`,
          `Straight, precise cuts in wood, ideal for more ambitious DIY projects.`
        ),
        matchScore: 96,
        tag: t("Originale", "Original"),
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
      title: t("Set Elettroutensili Combo 18V: Trapano + Avvitatore + 2 Batterie", "18V Combo Power Tool Set: Drill + Driver + 2 Batteries"),
      price: getPrice(0.85),
      reason: t(
        `Kit professionale completo per chi vuole affrontare qualsiasi lavoro in casa o in garage.`,
        `Complete professional kit for tackling any job at home or in the garage.`
      ),
      matchScore: 99,
      tag: t("Più Scelto", "Top Pick"),
      amazonSearchQuery: "Set Elettroutensili Combo 18V Trapano Avvitatore",
      category: "power-tools",
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 2340,
      isPrime: true,
    },
    {
      id: `bricolo-${Date.now()}-1`,
      title: t("Banco da Lavoro Pieghevole in Acciaio con Morsa Integrata", "Folding Steel Workbench with Integrated Vise"),
      price: getPrice(0.6),
      reason: t(
        `Superficie stabile e robusta per tagli, incollaggi e assemblaggi, si ripiega per riporlo.`,
        `Sturdy, stable surface for cutting, gluing and assembly, folds flat for storage.`
      ),
      matchScore: 97,
      tag: t("Top Qualità", "Top Quality"),
      amazonSearchQuery: "Banco da Lavoro Pieghevole Morsa Integrata",
      category: "workshop",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      reviewsCount: 980,
      isPrime: true,
    },
    {
      id: `bricolo-${Date.now()}-2`,
      title: t("Aspiratore Officina Multiuso Solidi e Liquidi 30L", "30L Multi-Purpose Wet/Dry Shop Vacuum"),
      price: getPrice(0.7),
      reason: t(
        `Aspira polvere, trucioli e liquidi: indispensabile per tenere pulita l'officina di casa.`,
        `Picks up dust, shavings and liquids: essential for keeping your home workshop clean.`
      ),
      matchScore: 96,
      tag: t("Originale", "Original"),
      amazonSearchQuery: "Aspiratore Officina Multiuso Solidi Liquidi 30L",
      category: "workshop",
      imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      reviewsCount: 1230,
      isPrime: true,
    },
  ].map((item, index) => ({ ...item, id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}` }));
}
