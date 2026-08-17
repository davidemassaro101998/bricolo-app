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

// The 3 fixed diversification badges, mirroring server.ts's GIFT_TAGS so
// the fallback catalog reads identically to an AI-generated result.
const TAGS: Record<Language, [string, string, string]> = {
  en: ["Top Pick", "Essential", "Top Quality"],
  it: ["Più Scelto", "Essenziale", "Top Qualità"],
  es: ["Más Elegido", "Esencial", "Máxima Calidad"],
  fr: ["Le Plus Choisi", "Essentiel", "Qualité Supérieure"],
  de: ["Meistgewählt", "Unverzichtbar", "Top-Qualität"],
};

interface FallbackContent {
  title: string;
  reason: string;
  query: string;
}

// Every fallback product card's copy, in all 5 supported languages. Keyed
// by a stable slug (not by the Italian text) so the lookup below stays
// simple regardless of language. This is the catalog shown whenever
// Gemini is unavailable, times out, or hits the daily cap — i.e.
// precisely the highest-traffic moments — so it has to read as native
// copy in every supported language, not just Italian.
const CONTENT: Record<string, Record<Language, FallbackContent>> = {
  gardenShears: {
    it: { title: "Cesoie da Giardino Professionali con Lame in Acciaio", reason: "Taglio netto e preciso, ideali per la potatura regolare di siepi e arbusti.", query: "Cesoie da Giardino Professionali Acciaio" },
    en: { title: "Professional Garden Shears with Steel Blades", reason: "Clean, precise cuts — ideal for regular hedge and shrub pruning.", query: "Professional Garden Shears Steel Blade" },
    es: { title: "Tijeras de Podar Profesionales de Acero", reason: "Corte limpio y preciso, ideales para podar setos y arbustos con regularidad.", query: "Tijeras de Podar Profesionales Acero" },
    fr: { title: "Sécateur de Jardin Professionnel Lames en Acier", reason: "Coupe nette et précise, idéal pour la taille régulière des haies et arbustes.", query: "Sécateur de Jardin Professionnel Acier" },
    de: { title: "Profi-Gartenschere mit Stahlklingen", reason: "Sauberer, präziser Schnitt – ideal für die regelmäßige Hecken- und Strauchpflege.", query: "Profi Gartenschere Stahlklinge" },
  },
  gardenGloves: {
    it: { title: "Guanti da Giardinaggio Traspiranti con Rinforzo Palmo", reason: "Protezione durevole e buona sensibilità per lavori di precisione all'aperto.", query: "Guanti da Giardinaggio Traspiranti" },
    en: { title: "Breathable Garden Gloves with Reinforced Palm", reason: "Durable protection with good dexterity for precise outdoor work.", query: "Breathable Garden Gloves Reinforced" },
    es: { title: "Guantes de Jardinería Transpirables con Palma Reforzada", reason: "Protección duradera y buena sensibilidad para trabajos de precisión al aire libre.", query: "Guantes de Jardinería Transpirables" },
    fr: { title: "Gants de Jardinage Respirants Paume Renforcée", reason: "Protection durable et bonne sensibilité pour les travaux de précision en extérieur.", query: "Gants de Jardinage Respirants" },
    de: { title: "Atmungsaktive Gartenhandschuhe mit Verstärkter Handfläche", reason: "Dauerhafter Schutz mit guter Griffigkeit für präzise Arbeiten im Freien.", query: "Atmungsaktive Gartenhandschuhe" },
  },
  gardenHose: {
    it: { title: "Tubo da Giardino Estensibile Antigroviglio con Ugello", reason: "Si estende fino a 3 volte la lunghezza a riposo, comodo da riporre senza ingombro.", query: "Tubo da Giardino Estensibile Antigroviglio" },
    en: { title: "Expandable Kink-Free Garden Hose with Nozzle", reason: "Stretches up to 3x its resting length, easy to store without taking up space.", query: "Expandable Kink-Free Garden Hose" },
    es: { title: "Manguera de Jardín Extensible Antienredos con Boquilla", reason: "Se estira hasta 3 veces su longitud en reposo, fácil de guardar sin ocupar espacio.", query: "Manguera de Jardín Extensible Antienredos" },
    fr: { title: "Tuyau d'Arrosage Extensible Anti-Nœuds avec Buse", reason: "S'étire jusqu'à 3 fois sa longueur au repos, facile à ranger sans encombrement.", query: "Tuyau d'Arrosage Extensible Anti-Nœuds" },
    de: { title: "Ausziehbarer Knickfreier Gartenschlauch mit Düse", reason: "Dehnt sich bis auf das 3-Fache der Ruhelänge, platzsparend zu verstauen.", query: "Ausziehbarer Knickfreier Gartenschlauch" },
  },
  drillKit: {
    it: { title: "Trapano Avvitatore a Batteria 18V con Valigetta e Accessori", reason: "Compatto e maneggevole, kit completo di punte per iniziare subito i lavori di casa.", query: "Trapano Avvitatore Batteria 18V Kit Valigetta" },
    en: { title: "18V Cordless Drill Driver with Case and Accessories", reason: "Compact and easy to handle, a complete bit kit to start home projects right away.", query: "18V Cordless Drill Driver Kit Case" },
    es: { title: "Taladro Atornillador a Batería 18V con Maletín y Accesorios", reason: "Compacto y manejable, kit completo de brocas para empezar ya los trabajos de casa.", query: "Taladro Atornillador Batería 18V Maletín" },
    fr: { title: "Perceuse-Visseuse sans Fil 18V avec Coffret et Accessoires", reason: "Compacte et maniable, kit complet d'embouts pour démarrer tout de suite vos travaux.", query: "Perceuse-Visseuse sans Fil 18V Coffret" },
    de: { title: "18V Akku-Bohrschrauber mit Koffer und Zubehör", reason: "Kompakt und handlich, komplettes Bit-Set für den sofortigen Start Ihrer Heimwerkerprojekte.", query: "18V Akku-Bohrschrauber Set Koffer" },
  },
  drillBits: {
    it: { title: "Set Punte da Trapano Universali in Acciaio HSS (Legno/Metallo/Muro)", reason: "Assortimento completo di diametri per ogni materiale, custodia rigida inclusa.", query: "Set Punte da Trapano HSS Universali" },
    en: { title: "Universal HSS Drill Bit Set (Wood/Metal/Masonry)", reason: "A complete range of diameters for every material, with a hard storage case included.", query: "Universal HSS Drill Bit Set" },
    es: { title: "Set de Brocas Universales HSS (Madera/Metal/Pared)", reason: "Surtido completo de diámetros para cada material, incluye estuche rígido.", query: "Set de Brocas Universales HSS" },
    fr: { title: "Coffret Forets Universels HSS (Bois/Métal/Maçonnerie)", reason: "Assortiment complet de diamètres pour chaque matériau, coffret rigide inclus.", query: "Coffret Forets Universels HSS" },
    de: { title: "Universal HSS-Bohrersatz (Holz/Metall/Mauerwerk)", reason: "Vollständiges Durchmesser-Sortiment für jedes Material, inklusive stabiler Aufbewahrungsbox.", query: "Universal HSS Bohrersatz" },
  },
  sander: {
    it: { title: "Levigatrice Orbitale Elettrica con Sistema di Aspirazione Polvere", reason: "Finitura uniforme su legno e superfici verniciate, riduce la polvere nell'ambiente.", query: "Levigatrice Orbitale Elettrica Aspirazione" },
    en: { title: "Electric Orbital Sander with Dust Extraction System", reason: "Even finish on wood and painted surfaces, keeps airborne dust to a minimum.", query: "Electric Orbital Sander Dust Extraction" },
    es: { title: "Lijadora Orbital Eléctrica con Sistema de Aspiración de Polvo", reason: "Acabado uniforme en madera y superficies pintadas, reduce el polvo en el ambiente.", query: "Lijadora Orbital Eléctrica Aspiración" },
    fr: { title: "Ponceuse Orbitale Électrique avec Système d'Aspiration", reason: "Finition uniforme sur bois et surfaces peintes, réduit la poussière dans l'air.", query: "Ponceuse Orbitale Électrique Aspiration" },
    de: { title: "Elektrischer Exzenterschleifer mit Staubabsaugung", reason: "Gleichmäßiges Finish auf Holz und lackierten Flächen, reduziert Staub in der Luft.", query: "Elektrischer Exzenterschleifer Staubabsaugung" },
  },
  screwdriverSet: {
    it: { title: "Set Cacciaviti di Precisione Magnetici 32 in 1", reason: "Kit compatto per riparazioni domestiche, elettronica e piccoli montaggi.", query: "Set Cacciaviti Precisione Magnetici 32 in 1" },
    en: { title: "32-in-1 Magnetic Precision Screwdriver Set", reason: "A compact kit for home repairs, electronics, and small assembly jobs.", query: "32-in-1 Magnetic Precision Screwdriver Set" },
    es: { title: "Set de Destornilladores de Precisión Magnéticos 32 en 1", reason: "Kit compacto para reparaciones domésticas, electrónica y pequeños montajes.", query: "Set Destornilladores Precisión Magnéticos 32 en 1" },
    fr: { title: "Coffret Tournevis de Précision Magnétiques 32 en 1", reason: "Kit compact pour réparations domestiques, électronique et petits montages.", query: "Coffret Tournevis Précision Magnétiques 32 en 1" },
    de: { title: "32-in-1 Magnetisches Präzisions-Schraubendreher-Set", reason: "Kompaktes Set für Haushaltsreparaturen, Elektronik und kleine Montagearbeiten.", query: "32-in-1 Magnetisches Präzisions-Schraubendreher-Set" },
  },
  tapeMeasure: {
    it: { title: "Metro a Nastro 5m con Blocco e Custodia Antiurto", reason: "Misurazioni precise per ogni progetto di casa, gancio magnetico incluso.", query: "Metro a Nastro 5m Blocco Antiurto" },
    en: { title: "5m Tape Measure with Lock and Shock-Resistant Case", reason: "Precise measurements for every home project, with a magnetic hook included.", query: "5m Tape Measure Lock Shock-Resistant" },
    es: { title: "Cinta Métrica 5m con Bloqueo y Carcasa Antigolpes", reason: "Mediciones precisas para cada proyecto de casa, gancho magnético incluido.", query: "Cinta Métrica 5m Bloqueo Antigolpes" },
    fr: { title: "Mètre Ruban 5m avec Blocage et Boîtier Anti-Choc", reason: "Mesures précises pour chaque projet à la maison, crochet magnétique inclus.", query: "Mètre Ruban 5m Blocage Anti-Choc" },
    de: { title: "5m Bandmaß mit Feststeller und Stoßfestem Gehäuse", reason: "Präzise Messungen für jedes Heimwerkerprojekt, inklusive Magnethaken.", query: "5m Bandmaß Feststeller Stoßfest" },
  },
  workLight: {
    it: { title: "Torcia LED da Lavoro Ricaricabile con Gancio e Magnete", reason: "Luce potente per lavorare in spazi stretti o poco illuminati, mani libere.", query: "Torcia LED da Lavoro Ricaricabile Magnete" },
    en: { title: "Rechargeable LED Work Light with Hook and Magnet", reason: "Powerful light for working in tight or poorly lit spaces, hands-free.", query: "Rechargeable LED Work Light Magnet" },
    es: { title: "Linterna LED de Trabajo Recargable con Gancho e Imán", reason: "Luz potente para trabajar en espacios estrechos o poco iluminados, manos libres.", query: "Linterna LED de Trabajo Recargable Imán" },
    fr: { title: "Lampe de Travail LED Rechargeable avec Crochet et Aimant", reason: "Lumière puissante pour travailler dans des espaces étroits ou peu éclairés, mains libres.", query: "Lampe de Travail LED Rechargeable Aimant" },
    de: { title: "Wiederaufladbare LED-Arbeitsleuchte mit Haken und Magnet", reason: "Starkes Licht für die Arbeit in engen oder schlecht beleuchteten Räumen, freihändig.", query: "Wiederaufladbare LED-Arbeitsleuchte Magnet" },
  },
  socketSet: {
    it: { title: "Kit Chiavi a Bussola 1/4\" e 1/2\" con Valigetta 108 Pezzi", reason: "Set completo per manutenzione e assemblaggio, adatto a officina e casa.", query: "Kit Chiavi a Bussola 108 Pezzi Valigetta" },
    en: { title: "1/4\" & 1/2\" Socket Wrench Set, 108-Piece Case", reason: "A complete set for maintenance and assembly, suited for both workshop and home.", query: "Socket Wrench Set 108-Piece Case" },
    es: { title: "Kit de Llaves de Vaso 1/4\" y 1/2\" con Maletín 108 Piezas", reason: "Set completo para mantenimiento y montaje, apto para taller y casa.", query: "Kit Llaves de Vaso 108 Piezas Maletín" },
    fr: { title: "Coffret de Douilles 1/4\" et 1/2\" 108 Pièces", reason: "Set complet pour l'entretien et le montage, adapté à l'atelier comme à la maison.", query: "Coffret de Douilles 108 Pièces" },
    de: { title: "Steckschlüsselsatz 1/4\" und 1/2\" 108-teilig im Koffer", reason: "Komplettes Set für Wartung und Montage, geeignet für Werkstatt und Zuhause.", query: "Steckschlüsselsatz 108-teilig Koffer" },
  },
  multimeter: {
    it: { title: "Multimetro Digitale con Test Continuità e Retroilluminazione", reason: "Misura tensione, corrente e resistenza in sicurezza, utile per piccoli lavori elettrici.", query: "Multimetro Digitale Retroilluminato" },
    en: { title: "Digital Multimeter with Continuity Test and Backlight", reason: "Safely measures voltage, current, and resistance — handy for small electrical jobs.", query: "Digital Multimeter Backlit" },
    es: { title: "Multímetro Digital con Test de Continuidad y Retroiluminación", reason: "Mide tensión, corriente y resistencia con seguridad, útil para pequeños trabajos eléctricos.", query: "Multímetro Digital Retroiluminado" },
    fr: { title: "Multimètre Numérique avec Test de Continuité et Rétroéclairage", reason: "Mesure tension, courant et résistance en toute sécurité, utile pour les petits travaux électriques.", query: "Multimètre Numérique Rétroéclairé" },
    de: { title: "Digitales Multimeter mit Durchgangsprüfung und Hintergrundbeleuchtung", reason: "Misst sicher Spannung, Strom und Widerstand – praktisch für kleine Elektroarbeiten.", query: "Digitales Multimeter Hintergrundbeleuchtet" },
  },
  wallOrganizer: {
    it: { title: "Organizer da Parete Modulare per Attrezzi con Ganci", reason: "Tiene l'officina in ordine, attrezzi sempre a vista e a portata di mano.", query: "Organizer Parete Modulare Attrezzi Ganci" },
    en: { title: "Modular Wall-Mounted Tool Organizer with Hooks", reason: "Keeps the workshop tidy, tools always in sight and within reach.", query: "Modular Wall Tool Organizer Hooks" },
    es: { title: "Organizador de Pared Modular para Herramientas con Ganchos", reason: "Mantiene el taller ordenado, con las herramientas siempre a la vista y a mano.", query: "Organizador de Pared Modular Herramientas" },
    fr: { title: "Organiseur Mural Modulaire pour Outils avec Crochets", reason: "Garde l'atelier bien rangé, outils toujours visibles et à portée de main.", query: "Organiseur Mural Modulaire Outils Crochets" },
    de: { title: "Modulares Wand-Werkzeug-Organizer-System mit Haken", reason: "Hält die Werkstatt ordentlich, Werkzeuge immer sichtbar und griffbereit.", query: "Modulares Wand-Werkzeug-Organizer Haken" },
  },
  impactDrill: {
    it: { title: "Trapano Avvitatore a Percussione a Batteria con 2 Batterie", reason: "Potenza sufficiente anche per muratura, doppia batteria per non restare mai fermi.", query: "Trapano Avvitatore Percussione Batteria Doppia" },
    en: { title: "Cordless Hammer Drill Driver with 2 Batteries", reason: "Enough power for masonry too, with a spare battery so you're never stuck waiting.", query: "Cordless Hammer Drill Driver 2 Batteries" },
    es: { title: "Taladro Percutor a Batería con 2 Baterías", reason: "Potencia suficiente incluso para mampostería, batería doble para no parar nunca.", query: "Taladro Percutor a Batería Doble Batería" },
    fr: { title: "Perceuse à Percussion sans Fil avec 2 Batteries", reason: "Assez de puissance même pour la maçonnerie, batterie de rechange pour ne jamais s'arrêter.", query: "Perceuse à Percussion sans Fil 2 Batteries" },
    de: { title: "Akku-Schlagbohrschrauber mit 2 Akkus", reason: "Ausreichend Kraft auch für Mauerwerk, mit Ersatzakku für ununterbrochenes Arbeiten.", query: "Akku-Schlagbohrschrauber 2 Akkus" },
  },
  toolboxTrolley: {
    it: { title: "Cassetta Attrezzi Completa 128 Pezzi con Trolley", reason: "Set completo per la casa: chiavi, cacciaviti, pinze e accessori vari in un unico trolley.", query: "Cassetta Attrezzi Completa 128 Pezzi Trolley" },
    en: { title: "Complete 128-Piece Tool Set with Rolling Case", reason: "A full home set: wrenches, screwdrivers, pliers, and accessories in one rolling case.", query: "Complete 128-Piece Tool Set Rolling Case" },
    es: { title: "Caja de Herramientas Completa 128 Piezas con Trolley", reason: "Set completo para casa: llaves, destornilladores, alicates y accesorios en un solo trolley.", query: "Caja de Herramientas Completa 128 Piezas Trolley" },
    fr: { title: "Coffret d'Outils Complet 128 Pièces avec Trolley", reason: "Set complet pour la maison : clés, tournevis, pinces et accessoires dans un seul trolley.", query: "Coffret d'Outils Complet 128 Pièces Trolley" },
    de: { title: "Komplettes 128-teiliges Werkzeugset mit Trolley", reason: "Komplettset fürs Zuhause: Schlüssel, Schraubendreher, Zangen und Zubehör in einem Trolley.", query: "Komplettes 128-teiliges Werkzeugset Trolley" },
  },
  circularSaw: {
    it: { title: "Sega Circolare a Batteria con Lama al Widia e Guida Parallela", reason: "Tagli dritti e precisi su legno, ideale per progetti di bricolage più impegnativi.", query: "Sega Circolare Batteria Guida Parallela" },
    en: { title: "Cordless Circular Saw with Carbide Blade and Rip Fence", reason: "Clean, straight cuts in wood, ideal for more ambitious DIY projects.", query: "Cordless Circular Saw Rip Fence" },
    es: { title: "Sierra Circular a Batería con Cuchilla de Widia y Guía Paralela", reason: "Cortes rectos y precisos en madera, ideal para proyectos de bricolaje más exigentes.", query: "Sierra Circular a Batería Guía Paralela" },
    fr: { title: "Scie Circulaire sans Fil avec Lame Carbure et Guide Parallèle", reason: "Coupes droites et précises dans le bois, idéale pour les projets de bricolage plus ambitieux.", query: "Scie Circulaire sans Fil Guide Parallèle" },
    de: { title: "Akku-Kreissäge mit Hartmetallblatt und Parallelanschlag", reason: "Gerade, präzise Schnitte in Holz, ideal für anspruchsvollere Heimwerkerprojekte.", query: "Akku-Kreissäge Parallelanschlag" },
  },
  comboKit: {
    it: { title: "Set Elettroutensili Combo 18V: Trapano + Avvitatore + 2 Batterie", reason: "Kit professionale completo per chi vuole affrontare qualsiasi lavoro in casa o in garage.", query: "Set Elettroutensili Combo 18V Trapano Avvitatore" },
    en: { title: "18V Combo Power Tool Set: Drill + Driver + 2 Batteries", reason: "A complete professional-grade kit for tackling any job around the house or garage.", query: "18V Combo Power Tool Set Drill Driver" },
    es: { title: "Set Combo de Herramientas 18V: Taladro + Atornillador + 2 Baterías", reason: "Kit profesional completo para afrontar cualquier trabajo en casa o en el garaje.", query: "Set Combo Herramientas 18V Taladro Atornillador" },
    fr: { title: "Kit Combo Outils 18V : Perceuse + Visseuse + 2 Batteries", reason: "Kit professionnel complet pour affronter n'importe quel travail à la maison ou au garage.", query: "Kit Combo Outils 18V Perceuse Visseuse" },
    de: { title: "18V Kombi-Set: Bohrer + Schrauber + 2 Akkus", reason: "Komplettes Profi-Set für jede Arbeit zu Hause oder in der Garage.", query: "18V Kombi-Set Bohrer Schrauber" },
  },
  workbench: {
    it: { title: "Banco da Lavoro Pieghevole in Acciaio con Morsa Integrata", reason: "Superficie stabile e robusta per tagli, incollaggi e assemblaggi, si ripiega per riporlo.", query: "Banco da Lavoro Pieghevole Morsa Integrata" },
    en: { title: "Folding Steel Workbench with Built-In Vice", reason: "A stable, sturdy surface for cutting, gluing, and assembly — folds flat for storage.", query: "Folding Steel Workbench Built-In Vice" },
    es: { title: "Banco de Trabajo Plegable de Acero con Tornillo Integrado", reason: "Superficie estable y robusta para cortar, pegar y montar, se pliega para guardarlo.", query: "Banco de Trabajo Plegable Tornillo Integrado" },
    fr: { title: "Établi Pliant en Acier avec Étau Intégré", reason: "Surface stable et robuste pour couper, coller et assembler, se replie pour le rangement.", query: "Établi Pliant en Acier Étau Intégré" },
    de: { title: "Klappbare Stahl-Werkbank mit Integriertem Schraubstock", reason: "Stabile, robuste Arbeitsfläche zum Schneiden, Kleben und Montieren, platzsparend klappbar.", query: "Klappbare Stahl-Werkbank Schraubstock" },
  },
  shopVac: {
    it: { title: "Aspiratore Officina Multiuso Solidi e Liquidi 30L", reason: "Aspira polvere, trucioli e liquidi: indispensabile per tenere pulita l'officina di casa.", query: "Aspiratore Officina Multiuso Solidi Liquidi 30L" },
    en: { title: "30L Wet & Dry Shop Vacuum", reason: "Picks up dust, shavings, and liquids — essential for keeping a home workshop clean.", query: "30L Wet & Dry Shop Vacuum" },
    es: { title: "Aspirador de Taller 30L para Sólidos y Líquidos", reason: "Aspira polvo, virutas y líquidos: imprescindible para mantener limpio el taller de casa.", query: "Aspirador de Taller 30L Sólidos Líquidos" },
    fr: { title: "Aspirateur d'Atelier 30L Eau et Poussières", reason: "Aspire poussière, copeaux et liquides : indispensable pour un atelier toujours propre.", query: "Aspirateur d'Atelier 30L Eau et Poussières" },
    de: { title: "30L Nass-/Trockensauger für die Werkstatt", reason: "Saugt Staub, Späne und Flüssigkeiten auf – unverzichtbar für eine saubere Heimwerkstatt.", query: "30L Nass-Trockensauger Werkstatt" },
  },
};

function pick(key: string, language: Language): FallbackContent {
  return CONTENT[key][language] || CONTENT[key].en;
}

// Dati di fallback usati solo quando l'API Gemini non e disponibile
// (chiave mancante, errore, timeout) — garantiscono che l'utente veda
// comunque 3 prodotti coerenti invece di un errore vuoto.
export function generateSmartFallbackGifts(quiz: QuizState, country: CountryConfig, language: Language = "en"): GiftItem[] {
  const sym = country.symbol || "€";
  const budgetRange = parseBudgetRange(quiz.budget);
  const [tagTopPick, tagEssential, tagTopQuality] = TAGS[language] || TAGS.en;

  const getPrice = (fraction: number) => {
    const val = Math.round(budgetRange.min + (budgetRange.max - budgetRange.min) * fraction);
    const finalVal = Math.min(val, budgetRange.max);
    return `${sym}${finalVal}`;
  };

  const vibeLower = (quiz.vibe || "").toLowerCase();
  const extraLower = (quiz.extraDetails || "").toLowerCase();
  const combinedText = `${vibeLower} ${extraLower}`;

  function buildCard(key: string, opts: { price: string; matchScore: number; tag: string; category: string; imageUrl: string; rating: number; reviewsCount: number }): Omit<GiftItem, "id"> {
    const content = pick(key, language);
    return {
      title: content.title,
      price: opts.price,
      reason: content.reason,
      matchScore: opts.matchScore,
      tag: opts.tag,
      amazonSearchQuery: content.query,
      category: opts.category,
      imageUrl: opts.imageUrl,
      rating: opts.rating,
      reviewsCount: opts.reviewsCount,
      isPrime: true,
    };
  }

  function withIds(cards: Omit<GiftItem, "id">[]): GiftItem[] {
    return cards.map((item, index) => ({
      ...item,
      id: `bricolo-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    }));
  }

  // Categoria specifica: Giardino
  if (combinedText.includes("giardino") || combinedText.includes("garden")) {
    return withIds([
      buildCard("gardenShears", { price: getPrice(0.4), matchScore: 98, tag: tagTopPick, category: "garden", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 1620 }),
      buildCard("gardenGloves", { price: getPrice(0.25), matchScore: 96, tag: tagEssential, category: "garden", imageUrl: "https://images.unsplash.com/photo-1585513553738-84f4c5f2c4e0?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 2340 }),
      buildCard("gardenHose", { price: getPrice(0.7), matchScore: 97, tag: tagTopQuality, category: "garden", imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviewsCount: 3120 }),
    ]);
  }

  // Categoria specifica: Elettroutensili
  if (combinedText.includes("elettro") || combinedText.includes("trapano") || combinedText.includes("power tool")) {
    return withIds([
      buildCard("drillKit", { price: getPrice(0.75), matchScore: 99, tag: tagTopPick, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 4820 }),
      buildCard("drillBits", { price: getPrice(0.3), matchScore: 96, tag: tagEssential, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 2150 }),
      buildCard("sander", { price: getPrice(0.8), matchScore: 97, tag: tagTopQuality, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1581147036324-c1c9a3e3d4b5?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 1780 }),
    ]);
  }

  // Tier 1: Budget < 25€
  if (budgetRange.max <= 25) {
    return withIds([
      buildCard("screwdriverSet", { price: getPrice(0.7), matchScore: 97, tag: tagTopPick, category: "hand-tools", imageUrl: "https://images.unsplash.com/photo-1581147036324-c1c9a3e3d4b5?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 5210 }),
      buildCard("tapeMeasure", { price: getPrice(0.4), matchScore: 95, tag: tagEssential, category: "hand-tools", imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 3400 }),
      buildCard("workLight", { price: getPrice(0.85), matchScore: 96, tag: tagTopQuality, category: "lighting", imageUrl: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviewsCount: 2870 }),
    ]);
  }

  // Tier 2: Budget 25 - 50€
  if (budgetRange.max <= 50) {
    return withIds([
      buildCard("socketSet", { price: getPrice(0.75), matchScore: 98, tag: tagTopPick, category: "hand-tools", imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 3980 }),
      buildCard("multimeter", { price: getPrice(0.5), matchScore: 96, tag: tagEssential, category: "electrical", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 2650 }),
      buildCard("wallOrganizer", { price: getPrice(0.4), matchScore: 95, tag: tagTopQuality, category: "storage", imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviewsCount: 1540 }),
    ]);
  }

  // Tier 3: Budget 50 - 100€
  if (budgetRange.max <= 100) {
    return withIds([
      buildCard("impactDrill", { price: getPrice(0.8), matchScore: 98, tag: tagTopPick, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 2980 }),
      buildCard("toolboxTrolley", { price: getPrice(0.85), matchScore: 97, tag: tagTopQuality, category: "hand-tools", imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 4120 }),
      buildCard("circularSaw", { price: getPrice(0.7), matchScore: 96, tag: tagEssential, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviewsCount: 1690 }),
    ]);
  }

  // Tier 4: Budget > 100€
  return withIds([
    buildCard("comboKit", { price: getPrice(0.85), matchScore: 99, tag: tagTopPick, category: "power-tools", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviewsCount: 2340 }),
    buildCard("workbench", { price: getPrice(0.6), matchScore: 97, tag: tagTopQuality, category: "workshop", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviewsCount: 980 }),
    buildCard("shopVac", { price: getPrice(0.7), matchScore: 96, tag: tagEssential, category: "workshop", imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviewsCount: 1230 }),
  ]);
}
