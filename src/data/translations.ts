// Bricolo AI — Sistema di traduzioni centralizzato.
// Tutte le stringhe visibili in UI devono passare da qui (invece del
// pattern binario `language === "it" ? ... : ...` sparso nei
// componenti) cosi che aggiungere una lingua richieda di toccare solo
// questo file. Dominio: casa, giardino, fai-da-te — non regali, non
// fitness.

export type Language = "it" | "en" | "es" | "fr" | "de";

export const LANGUAGE_NAMES: Record<Language, string> = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

// Codice BCP-47 usato per la Web Speech API (riconoscimento vocale).
export const SPEECH_LOCALES: Record<Language, string> = {
  it: "it-IT",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
};

export interface Translations {
  // Header & Geo/Language Modal
  language: string;
  selectLanguageRegion: string;
  storeRegion: string;
  regionNotice: string;

  // Home Screen — Fast-Track bar
  fastTrackPrompt: string;

  // Home Screen — Step 1 (Use Case Area)
  step1Title: string;
  step1Subtitle: string;
  back: string;

  // Home Screen — Step 2 (Product Category)
  step2Title: string;
  step2Subtitle: string;

  // Home Screen — Step 3 (Budget & Extra)
  step3Title: string;
  step3Subtitle: string;
  orExactAmount: string;
  customLabel: string;
  exactAmountPlaceholder: string;
  clearLabel: string;
  extraOptionsLabel: string;
  professionalGradeLabel: string;
  extraDetailsPlaceholder: string;
  submitBtn: string;

  // Quiz Option Dictionaries (canonical key -> localized label). I
  // valori canonici (chiavi) restano fissi perche vengono inviati
  // cosi come sono al backend/prompt Gemini — solo l'etichetta
  // mostrata cambia in base alla lingua.
  recipients: { [key: string]: string };
  vibes: { [key: string]: string };

  // Loading Screen
  curating: string;
  curatingSub: string;
  loadingStep1: string;
  loadingStep2: string;
  loadingStep3: string;

  // Results Deck
  resultsHeaderTag: string;
  backLabel: string;
  optionLabel: string;
  newSearch: string;
  previous: string;
  next: string;
  ourPick: string;
  reviewsLabel: string;
  whyPerfect: string;
  seeInStore: string;
  addToCart: string;
  searchOnAmazon: string;
  dgmAppsCredit: string;
  copyLink: string;
  copyLinkDone: string;
  moreProducts: string;
  amazonAffiliateDisclaimer: string;
  whatsAppShareText: string; // {title} e {price} vengono sostituiti nel testo

  // Voice Drawer
  aiVoiceAssistantTitle: string;
  listeningHint: string;
  tapMicHint: string;
  voiceNotSupported: string;
  micPermissionDenied: string;
  liveTranscriptLabel: string;
  voiceIdeaPlaceholder: string;
  findProductNow: string;

  // Settings Drawer
  settingsTitle: string;
  interactionSection: string;
  hapticFeedback: string;
  permissionsSection: string;
  microphoneLabel: string;
  micGranted: string;
  micDenied: string;
  micPrompt: string;
  micUnchecked: string;
  micOn: string;
  micBlocked: string;
  enableMicBtn: string;
  micBlockedHelp: string;
  legalSection: string;
  termsLabel: string;
  affiliateLabel: string;
  supportSection: string;
  sendFeedbackBtn: string;

  // Legal Modal
  privacyTitle: string;
  termsTitle: string;
  affiliateTitle: string;
  close: string;
  privacyBody: string[];
  termsBody: string[];
  affiliateIntro: string;
  affiliateStatement: string;
  affiliateProgramNote: string;
  affiliatePricingTitle: string;
  affiliatePricingNote: string;

  // Cookie Banner
  cookieBannerText: string;
  privacyPolicyLabel: string;
  acceptLabel: string;

  // Offline Screen
  noConnectionTitle: string;
  noConnectionBody: string;
  checking: string;
  retry: string;

  // Security / PWA
  inAppBrowserWarning: string;
  installAppTitle: string;
  installAppBody: string;
  installNowBtn: string;
  addToHomeScreenBtn: string;
  installFallbackAlert: string;
  iosAddToHomeTitle: string;
  iosStep1Title: string;
  iosStep1Body: string;
  iosStep2Title: string;
  iosStep2Body: string;
  iosPressShare: string;
  gotIt: string;

  // Error Boundary
  errorTitle: string;
  errorBody: string;
  errorRetry: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  it: {
    language: "Lingua",
    selectLanguageRegion: "Lingua e Regione",
    storeRegion: "Regione dello Store",
    regionNotice: "I link dei prodotti si apriranno nella tua valuta e store locale.",

    fastTrackPrompt: "Hai un'idea o SOS? Parla o scrivi...",

    step1Title: "Per cosa ti serve?",
    step1Subtitle: "Seleziona l'ambito per personalizzare",
    back: "Indietro",

    step2Title: "Che tipo di prodotto cerchi?",
    step2Subtitle: "Scegli la categoria più vicina a quello che ti serve",

    step3Title: "Budget e Stile",
    step3Subtitle: "Imposta la fascia di prezzo desiderata",
    orExactAmount: "Oppure cifra esatta:",
    customLabel: "Personalizzato",
    exactAmountPlaceholder: "Cifra esatta (es. 18)",
    clearLabel: "Cancella",
    extraOptionsLabel: "OPZIONI EXTRA",
    professionalGradeLabel: "Cerco qualcosa di livello professionale",
    extraDetailsPlaceholder: "Dettaglio extra (opzionale)",
    submitBtn: "MOSTRA I PRODOTTI GIUSTI",

    recipients: {
      Casa: "Casa",
      Giardino: "Giardino",
      Bricolage: "Bricolage",
      Officina: "Officina",
    },
    vibes: {
      Elettroutensili: "Elettroutensili",
      "Utensili manuali": "Utensili manuali",
      Fissaggio: "Fissaggio",
      Sicurezza: "Sicurezza",
      Organizzazione: "Organizzazione",
      Illuminazione: "Illuminazione",
    },

    curating: "RICERCA IN CORSO...",
    curatingSub: "Ricerca dei prodotti più adatti al tuo bisogno...",
    loadingStep1: "Analisi del bisogno indicato",
    loadingStep2: "Filtro dei prodotti più affidabili per categoria",
    loadingStep3: "Preparazione link store e dettagli",

    resultsHeaderTag: "BRICOLO AI • 3 SELEZIONI",
    backLabel: "Indietro",
    optionLabel: "Opzione",
    newSearch: "Nuova Ricerca",
    previous: "Precedente",
    next: "Successivo",
    ourPick: "La nostra scelta",
    reviewsLabel: "recensioni",
    whyPerfect: "Perché è perfetto:",
    seeInStore: "VEDI NELLO STORE",
    addToCart: "METTI IN CARRELLO",
    searchOnAmazon: "CERCA SU AMAZON",
    dgmAppsCredit: "Parte di DGM Apps",
    copyLink: "Copia Link",
    copyLinkDone: "Copiato & Aperto!",
    moreProducts: "Altri 3 Prodotti",
    amazonAffiliateDisclaimer: "In qualità di Affiliato Amazon, Bricolo AI riceve un guadagno dagli acquisti idonei.",
    whatsAppShareText: "Ho trovato il prodotto giusto per il mio progetto: {title} ({price})! Guarda qui su Amazon: {url}",

    aiVoiceAssistantTitle: "Assistente Vocale AI",
    listeningHint: "In ascolto... Parla liberamente",
    tapMicHint: "Tocca il microfono per parlare",
    voiceNotSupported: "Riconoscimento vocale non supportato nel browser. Puoi digitare la tua idea!",
    micPermissionDenied: "Permesso microfono negato. Puoi digitare la tua idea qui sotto.",
    liveTranscriptLabel: "Trascrizione Live / Idea:",
    voiceIdeaPlaceholder: "Es. Trapano avvitatore affidabile per uso occasionale sotto i 50€...",
    findProductNow: "TROVA PRODOTTO ORA",

    settingsTitle: "Impostazioni & App",
    interactionSection: "INTERAZIONE",
    hapticFeedback: "Feedback Tattile (Vibrazione)",
    permissionsSection: "PERMESSI & PRIVACY",
    microphoneLabel: "Microfono (Ricerca Vocale)",
    micGranted: "Permesso concesso",
    micDenied: "Permesso negato dal browser",
    micPrompt: "Non ancora richiesto",
    micUnchecked: "Da verificare",
    micOn: "Attivo",
    micBlocked: "Bloccato",
    enableMicBtn: "Attiva Permesso Microfono",
    micBlockedHelp: "Hai bloccato il microfono per questo sito. Riattivalo dalle impostazioni del browser (icona lucchetto nella barra indirizzo).",
    legalSection: "LEGALE & COMPLIANCE",
    termsLabel: "Termini e Condizioni",
    affiliateLabel: "Affiliazione Amazon & Disclaimers",
    supportSection: "SUPPORTO & INFO",
    sendFeedbackBtn: "Invia un Feedback",

    privacyTitle: "Privacy Policy (GDPR EU)",
    termsTitle: "Termini e Condizioni",
    affiliateTitle: "Affiliazione Amazon & Disclaimers",
    close: "Chiudi",
    privacyBody: [
      "Titolare del Trattamento: Bricolo AI opera nel rispetto dei principi di minimizzazione dei dati e riservatezza.",
      "Tipologia di Dati Raccolti: Bricolo AI NON raccoglie, profila né vende dati personali degli utenti. L'applicazione funziona interamente tramite salvataggi locali tecnici nel browser/dispositivo dell'utente (localStorage) per memorizzare le impostazioni di lingua, paese Amazon e promemoria progetti.",
      "Cookie Tecnici: Vengono utilizzati esclusivamente cookie e archivi locali strettamente necessari per le funzionalità operative dell'applet (stato PWA, preferenze lingua, lista promemoria). Non vengono impiegati cookie di tracciamento pubblicitario o profilazione di terze parti.",
      "Servizi Terzi (Google Gemini AI & Amazon): Le elaborazioni per la raccomandazione dei prodotti avvengono lato server tramite connessioni crittografate HTTPS. Nessun identificativo dell'utente viene trasmesso ai modelli AI.",
      "Diritti dell'Utente: L'utente può in qualsiasi momento cancellare i propri dati salvati semplicemente svuotando la cache del browser o ripristinando le impostazioni dell'app.",
    ],
    termsBody: [
      "Natura del Servizio: Bricolo AI è un motore di raccomandazione intelligente sviluppato per suggerire prodotti per la casa, il giardino e il fai-da-te reperibili su store online come Amazon.",
      "Esclusione di Responsabilità: I suggerimenti generati dall'Intelligenza Artificiale hanno scopo informativo ed euristico. Bricolo AI non è il venditore diretto dei prodotti consigliati.",
      "Acquisti Esterni: Gli acquisti avvengono interamente sui siti ufficiali Amazon del paese selezionato. L'utente si affida alle condizioni di vendita, garanzia e spedizione fornite direttamente da Amazon.",
      "Proprietà Intellettuale: Il design, il codice e l'interfaccia di Bricolo AI sono protetti da copyright. I marchi Amazon e i loghi dei prodotti appartengono ai rispettivi proprietari.",
    ],
    affiliateIntro: "Dichiarazione di Affiliazione Amazon & Disclaimers Obbligatori",
    affiliateStatement: "In qualità di Affiliato Amazon, Bricolo AI riceve un guadagno dagli acquisti idonei.",
    affiliateProgramNote: "Bricolo AI partecipa al Programma Affiliazione Amazon EU e Amazon Associates US, un programma di affiliazione progettato per fornire ai siti un mezzo per guadagnare commissioni pubblicitarie creando link verso Amazon.it, Amazon.com e i rispettivi store internazionali.",
    affiliatePricingTitle: "Disclaimer Prezzi e Disponibilità:",
    affiliatePricingNote: "I prezzi dei prodotti mostrati sono indicativi, generati dall'intelligenza artificiale al momento della ricerca; fa sempre fede il prezzo e la disponibilità mostrati sulla pagina prodotto di Amazon al momento dell'acquisto finale. Quando l'integrazione diretta con l'Amazon Product Advertising API sarà attiva, i prezzi saranno recuperati in tempo reale direttamente da Amazon.",

    cookieBannerText: "Bricolo AI utilizza cookie tecnici e servizi di affiliazione per consigliarti i prodotti giusti. Continuando ad usare l'app accetti la nostra Privacy Policy.",
    privacyPolicyLabel: "Privacy Policy",
    acceptLabel: "Accetta",

    noConnectionTitle: "Nessuna Connessione",
    noConnectionBody: "Verifica la tua rete internet per continuare a cercare i prodotti giusti.",
    checking: "VERIFICA IN CORSO...",
    retry: "RIPROVA",

    inAppBrowserWarning: "Per la migliore esperienza, apri in Safari o Chrome",
    installAppTitle: "Installa l'App in 1 Tap",
    installAppBody: "Accedi all'istante dalla tua Schermata Home senza scaricare dagli store.",
    installNowBtn: "INSTALLA SUBITO IN HOME",
    addToHomeScreenBtn: "AGGIUNGI A SCHERMATA HOME",
    installFallbackAlert: "Per installare l'app, usa il menu del tuo browser e seleziona 'Aggiungi a Schermata Home'.",
    iosAddToHomeTitle: "Aggiungi a Home Screen iOS",
    iosStep1Title: "Tocca il tasto 'Condividi'",
    iosStep1Body: "Si trova nella barra in basso di Safari",
    iosStep2Title: "Seleziona 'Aggiungi alla schermata Home'",
    iosStep2Body: "Scorri le opzioni del menu di condivisione",
    iosPressShare: "Premi Condividi Qui Sotto",
    gotIt: "HO CAPITO",

    errorTitle: "Qualcosa è andato storto",
    errorBody: "Nessun problema — i tuoi progetti salvati sono al sicuro. Riprova a ripartire.",
    errorRetry: "Ricomincia",
  },

  en: {
    language: "Language",
    selectLanguageRegion: "Language & Region",
    storeRegion: "Store Region",
    regionNotice: "Product links will open in your local store currency and region.",

    fastTrackPrompt: "Have an idea or SOS? Speak or type...",

    step1Title: "What do you need it for?",
    step1Subtitle: "Select the area to customize",
    back: "Back",

    step2Title: "What type of product are you looking for?",
    step2Subtitle: "Choose the category closest to what you need",

    step3Title: "Budget & Style",
    step3Subtitle: "Set your preferred price range",
    orExactAmount: "Or exact amount:",
    customLabel: "Custom",
    exactAmountPlaceholder: "Exact amount (e.g. 18)",
    clearLabel: "Clear",
    extraOptionsLabel: "EXTRA OPTIONS",
    professionalGradeLabel: "Looking for professional-grade quality",
    extraDetailsPlaceholder: "Extra details (optional)",
    submitBtn: "SHOW THE RIGHT PRODUCTS",

    recipients: {
      Casa: "Home",
      Giardino: "Garden",
      Bricolage: "DIY",
      Officina: "Workshop",
    },
    vibes: {
      Elettroutensili: "Power Tools",
      "Utensili manuali": "Hand Tools",
      Fissaggio: "Fasteners",
      Sicurezza: "Safety Gear",
      Organizzazione: "Storage",
      Illuminazione: "Lighting",
    },

    curating: "SEARCHING...",
    curatingSub: "Matching your needs with the best available products...",
    loadingStep1: "Analyzing your need",
    loadingStep2: "Filtering the most reliable products by category",
    loadingStep3: "Preparing direct store links & details",

    resultsHeaderTag: "BRICOLO AI • 3 PICKS",
    backLabel: "Back",
    optionLabel: "Option",
    newSearch: "New Search",
    previous: "Previous",
    next: "Next",
    ourPick: "Our pick",
    reviewsLabel: "reviews",
    whyPerfect: "Why it's perfect:",
    seeInStore: "SEE IN STORE",
    addToCart: "ADD TO CART",
    searchOnAmazon: "SEARCH ON AMAZON",
    dgmAppsCredit: "Part of DGM Apps",
    copyLink: "Copy Link",
    copyLinkDone: "Copied & Opened!",
    moreProducts: "3 More Products",
    amazonAffiliateDisclaimer: "As an Amazon Associate, Bricolo AI earns from qualifying purchases.",
    whatsAppShareText: "I found the right product for my project: {title} ({price})! Check it out: {url}",

    aiVoiceAssistantTitle: "AI Voice Assistant",
    listeningHint: "Listening... Speak freely",
    tapMicHint: "Tap microphone to speak",
    voiceNotSupported: "Voice recognition not supported in this browser. You can type your idea!",
    micPermissionDenied: "Microphone permission denied. You can type below.",
    liveTranscriptLabel: "Live Transcript / Idea:",
    voiceIdeaPlaceholder: "E.g. Reliable cordless drill for occasional use under 50€...",
    findProductNow: "FIND PRODUCT NOW",

    settingsTitle: "Settings & App",
    interactionSection: "INTERACTION",
    hapticFeedback: "Haptic Feedback",
    permissionsSection: "PERMISSIONS & PRIVACY",
    microphoneLabel: "Microphone (Voice Search)",
    micGranted: "Permission granted",
    micDenied: "Denied by browser",
    micPrompt: "Not requested yet",
    micUnchecked: "Not checked yet",
    micOn: "On",
    micBlocked: "Blocked",
    enableMicBtn: "Enable Microphone Permission",
    micBlockedHelp: "You've blocked the microphone for this site. Re-enable it from your browser's site settings (padlock icon in the address bar).",
    legalSection: "LEGAL & COMPLIANCE",
    termsLabel: "Terms & Conditions",
    affiliateLabel: "Amazon Affiliate & Disclaimers",
    supportSection: "SUPPORT & INFO",
    sendFeedbackBtn: "Send Feedback",

    privacyTitle: "Privacy Policy (GDPR EU)",
    termsTitle: "Terms & Conditions",
    affiliateTitle: "Amazon Affiliate & Disclaimers",
    close: "Close",
    privacyBody: [
      "Data Controller: Bricolo AI operates in line with the principles of data minimization and confidentiality.",
      "Data Collected: Bricolo AI does NOT collect, profile, or sell users' personal data. The app runs entirely on technical local storage in the user's browser/device (localStorage) to remember language settings, Amazon country, and project reminders.",
      "Technical Cookies: Only cookies and local storage strictly necessary for the applet's core functionality are used (PWA state, language preference, reminders list). No advertising tracking or third-party profiling cookies are used.",
      "Third-Party Services (Google Gemini AI & Amazon): Product recommendation processing happens server-side over encrypted HTTPS connections. No user identifier is ever transmitted to the AI models.",
      "User Rights: Users can delete their saved data at any time simply by clearing the browser cache or resetting the app's settings.",
    ],
    termsBody: [
      "Nature of the Service: Bricolo AI is a smart recommendation engine built to suggest home, garden and DIY products available on online stores such as Amazon.",
      "Disclaimer: Suggestions generated by the AI are informational and heuristic in nature. Bricolo AI is not the direct seller of the recommended products.",
      "External Purchases: Purchases happen entirely on the official Amazon site of the selected country. Users rely on the sales, warranty and shipping terms provided directly by Amazon.",
      "Intellectual Property: Bricolo AI's design, code and interface are protected by copyright. Amazon trademarks and product logos belong to their respective owners.",
    ],
    affiliateIntro: "Amazon Affiliate Disclosure & Mandatory Disclaimers",
    affiliateStatement: "As an Amazon Associate, Bricolo AI earns from qualifying purchases.",
    affiliateProgramNote: "Bricolo AI participates in the Amazon EU Associates Programme and Amazon Associates US, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.com, Amazon.it and their respective international stores.",
    affiliatePricingTitle: "Pricing & Availability Disclaimer:",
    affiliatePricingNote: "Product prices shown are indicative, generated by AI at search time; the price and availability shown on the Amazon product page at the time of final purchase always apply. Once direct integration with the Amazon Product Advertising API is active, prices will be retrieved in real time directly from Amazon.",

    cookieBannerText: "Bricolo AI uses technical cookies and affiliate services to recommend the right products. By continuing to use the app, you accept our Privacy Policy.",
    privacyPolicyLabel: "Privacy Policy",
    acceptLabel: "Accept",

    noConnectionTitle: "No Connection",
    noConnectionBody: "Check your internet connection to keep searching for the right products.",
    checking: "CHECKING...",
    retry: "RETRY",

    inAppBrowserWarning: "For the best experience, open in Safari or Chrome",
    installAppTitle: "Install App in 1 Tap",
    installAppBody: "Instant 1-tap access from your Home Screen without app stores.",
    installNowBtn: "INSTALL NOW ON HOME",
    addToHomeScreenBtn: "ADD TO HOME SCREEN",
    installFallbackAlert: "To install the app, open your browser menu and select 'Add to Home Screen'.",
    iosAddToHomeTitle: "Add to iOS Home Screen",
    iosStep1Title: "Tap the 'Share' button",
    iosStep1Body: "Located in Safari's bottom bar",
    iosStep2Title: "Select 'Add to Home Screen'",
    iosStep2Body: "Scroll through the share sheet options",
    iosPressShare: "Press Share Below",
    gotIt: "GOT IT",

    errorTitle: "Something went wrong",
    errorBody: "No worries — your saved projects are safe. Let's start fresh.",
    errorRetry: "Start over",
  },

  es: {
    language: "Idioma",
    selectLanguageRegion: "Idioma y Región",
    storeRegion: "Región de la Tienda",
    regionNotice: "Los enlaces de producto se abrirán con la moneda y la tienda de tu región.",

    fastTrackPrompt: "¿Tienes una idea o un SOS? Habla o escribe...",

    step1Title: "¿Para qué lo necesitas?",
    step1Subtitle: "Selecciona el ámbito para personalizar",
    back: "Atrás",

    step2Title: "¿Qué tipo de producto buscas?",
    step2Subtitle: "Elige la categoría más cercana a lo que necesitas",

    step3Title: "Presupuesto y Estilo",
    step3Subtitle: "Define el rango de precio que prefieres",
    orExactAmount: "O importe exacto:",
    customLabel: "Personalizado",
    exactAmountPlaceholder: "Importe exacto (ej. 18)",
    clearLabel: "Borrar",
    extraOptionsLabel: "OPCIONES EXTRA",
    professionalGradeLabel: "Busco algo de nivel profesional",
    extraDetailsPlaceholder: "Detalle extra (opcional)",
    submitBtn: "MOSTRAR LOS PRODUCTOS ADECUADOS",

    recipients: {
      Casa: "Casa",
      Giardino: "Jardín",
      Bricolage: "Bricolaje",
      Officina: "Taller",
    },
    vibes: {
      Elettroutensili: "Herramientas Eléctricas",
      "Utensili manuali": "Herramientas Manuales",
      Fissaggio: "Fijación",
      Sicurezza: "Seguridad",
      Organizzazione: "Organización",
      Illuminazione: "Iluminación",
    },

    curating: "BUSCANDO...",
    curatingSub: "Buscando los productos más adecuados para tu necesidad...",
    loadingStep1: "Analizando tu necesidad",
    loadingStep2: "Filtrando los productos más fiables por categoría",
    loadingStep3: "Preparando enlaces directos y detalles",

    resultsHeaderTag: "BRICOLO AI • 3 SELECCIONES",
    backLabel: "Atrás",
    optionLabel: "Opción",
    newSearch: "Nueva Búsqueda",
    previous: "Anterior",
    next: "Siguiente",
    ourPick: "Nuestra elección",
    reviewsLabel: "reseñas",
    whyPerfect: "Por qué es perfecto:",
    seeInStore: "VER EN LA TIENDA",
    addToCart: "AÑADIR AL CARRITO",
    searchOnAmazon: "BUSCAR EN AMAZON",
    dgmAppsCredit: "Parte de DGM Apps",
    copyLink: "Copiar Enlace",
    copyLinkDone: "¡Copiado y Abierto!",
    moreProducts: "3 Productos Más",
    amazonAffiliateDisclaimer: "Como Afiliado de Amazon, Bricolo AI obtiene ingresos por las compras que cumplen los requisitos.",
    whatsAppShareText: "¡Encontré el producto ideal para mi proyecto: {title} ({price})! Míralo en Amazon: {url}",

    aiVoiceAssistantTitle: "Asistente de Voz IA",
    listeningHint: "Escuchando... Habla con libertad",
    tapMicHint: "Toca el micrófono para hablar",
    voiceNotSupported: "El reconocimiento de voz no es compatible con este navegador. ¡Puedes escribir tu idea!",
    micPermissionDenied: "Permiso de micrófono denegado. Puedes escribir tu idea abajo.",
    liveTranscriptLabel: "Transcripción en vivo / Idea:",
    voiceIdeaPlaceholder: "Ej. Taladro atornillador fiable para uso ocasional por menos de 50€...",
    findProductNow: "BUSCAR PRODUCTO AHORA",

    settingsTitle: "Ajustes y App",
    interactionSection: "INTERACCIÓN",
    hapticFeedback: "Vibración Táctil",
    permissionsSection: "PERMISOS Y PRIVACIDAD",
    microphoneLabel: "Micrófono (Búsqueda por Voz)",
    micGranted: "Permiso concedido",
    micDenied: "Denegado por el navegador",
    micPrompt: "Aún no solicitado",
    micUnchecked: "Sin comprobar",
    micOn: "Activo",
    micBlocked: "Bloqueado",
    enableMicBtn: "Activar Permiso de Micrófono",
    micBlockedHelp: "Has bloqueado el micrófono para este sitio. Reactívalo desde la configuración del sitio en tu navegador (icono del candado en la barra de direcciones).",
    legalSection: "LEGAL Y CUMPLIMIENTO",
    termsLabel: "Términos y Condiciones",
    affiliateLabel: "Afiliación de Amazon y Avisos Legales",
    supportSection: "SOPORTE E INFO",
    sendFeedbackBtn: "Enviar Comentarios",

    privacyTitle: "Política de Privacidad (RGPD UE)",
    termsTitle: "Términos y Condiciones",
    affiliateTitle: "Afiliación de Amazon y Avisos Legales",
    close: "Cerrar",
    privacyBody: [
      "Responsable del Tratamiento: Bricolo AI opera respetando los principios de minimización de datos y confidencialidad.",
      "Tipo de Datos Recopilados: Bricolo AI NO recopila, perfila ni vende datos personales de los usuarios. La aplicación funciona enteramente mediante almacenamiento técnico local en el navegador/dispositivo del usuario (localStorage) para guardar el idioma, el país de Amazon y los recordatorios de proyectos.",
      "Cookies Técnicas: Se utilizan exclusivamente cookies y almacenamiento local estrictamente necesarios para el funcionamiento de la aplicación (estado PWA, preferencia de idioma, lista de recordatorios). No se utilizan cookies de seguimiento publicitario ni de perfilado de terceros.",
      "Servicios de Terceros (Google Gemini AI y Amazon): El procesamiento de las recomendaciones de productos se realiza en el servidor mediante conexiones HTTPS cifradas. No se transmite ningún identificador del usuario a los modelos de IA.",
      "Derechos del Usuario: El usuario puede eliminar en cualquier momento sus datos guardados simplemente vaciando la caché del navegador o restableciendo la configuración de la app.",
    ],
    termsBody: [
      "Naturaleza del Servicio: Bricolo AI es un motor de recomendación inteligente creado para sugerir productos de bricolaje, hogar y jardín disponibles en tiendas online como Amazon.",
      "Exclusión de Responsabilidad: Las sugerencias generadas por la Inteligencia Artificial tienen un propósito informativo y heurístico. Bricolo AI no es el vendedor directo de los productos recomendados.",
      "Compras Externas: Las compras se realizan íntegramente en los sitios oficiales de Amazon del país seleccionado. El usuario se rige por las condiciones de venta, garantía y envío proporcionadas directamente por Amazon.",
      "Propiedad Intelectual: El diseño, el código y la interfaz de Bricolo AI están protegidos por derechos de autor. Las marcas de Amazon y los logotipos de productos pertenecen a sus respectivos propietarios.",
    ],
    affiliateIntro: "Declaración de Afiliación de Amazon y Avisos Legales Obligatorios",
    affiliateStatement: "Como Afiliado de Amazon, Bricolo AI obtiene ingresos por las compras que cumplen los requisitos.",
    affiliateProgramNote: "Bricolo AI participa en el Programa de Afiliados de Amazon EU y Amazon Associates US, un programa de afiliación diseñado para ofrecer a los sitios web un medio para obtener comisiones publicitarias mediante enlaces a Amazon.es, Amazon.com y sus respectivas tiendas internacionales.",
    affiliatePricingTitle: "Aviso sobre Precios y Disponibilidad:",
    affiliatePricingNote: "Los precios de los productos mostrados son indicativos, generados por la inteligencia artificial en el momento de la búsqueda; siempre prevalece el precio y la disponibilidad mostrados en la página del producto de Amazon en el momento de la compra final. Cuando la integración directa con la Amazon Product Advertising API esté activa, los precios se obtendrán en tiempo real directamente desde Amazon.",

    cookieBannerText: "Bricolo AI utiliza cookies técnicas y servicios de afiliación para recomendarte los productos adecuados. Al seguir usando la app, aceptas nuestra Política de Privacidad.",
    privacyPolicyLabel: "Política de Privacidad",
    acceptLabel: "Aceptar",

    noConnectionTitle: "Sin Conexión",
    noConnectionBody: "Comprueba tu conexión a internet para seguir buscando los productos adecuados.",
    checking: "COMPROBANDO...",
    retry: "REINTENTAR",

    inAppBrowserWarning: "Para la mejor experiencia, ábrelo en Safari o Chrome",
    installAppTitle: "Instala la App en 1 Toque",
    installAppBody: "Accede al instante desde tu pantalla de inicio, sin descargar de ninguna tienda.",
    installNowBtn: "INSTALAR AHORA EN INICIO",
    addToHomeScreenBtn: "AÑADIR A PANTALLA DE INICIO",
    installFallbackAlert: "Para instalar la app, abre el menú de tu navegador y selecciona 'Añadir a pantalla de inicio'.",
    iosAddToHomeTitle: "Añadir a Pantalla de Inicio en iOS",
    iosStep1Title: "Toca el botón 'Compartir'",
    iosStep1Body: "Se encuentra en la barra inferior de Safari",
    iosStep2Title: "Selecciona 'Añadir a pantalla de inicio'",
    iosStep2Body: "Desplázate por las opciones del menú para compartir",
    iosPressShare: "Pulsa Compartir Abajo",
    gotIt: "ENTENDIDO",

    errorTitle: "Algo salió mal",
    errorBody: "Sin problema — tus proyectos guardados están a salvo. Vuelve a intentarlo.",
    errorRetry: "Empezar de nuevo",
  },

  fr: {
    language: "Langue",
    selectLanguageRegion: "Langue et Région",
    storeRegion: "Région de la Boutique",
    regionNotice: "Les liens produits s'ouvriront dans la devise et la boutique de votre région.",

    fastTrackPrompt: "Une idée ou un SOS ? Parlez ou écrivez...",

    step1Title: "Pour quoi en avez-vous besoin ?",
    step1Subtitle: "Sélectionnez le domaine à personnaliser",
    back: "Retour",

    step2Title: "Quel type de produit recherchez-vous ?",
    step2Subtitle: "Choisissez la catégorie la plus proche de votre besoin",

    step3Title: "Budget et Style",
    step3Subtitle: "Définissez votre fourchette de prix",
    orExactAmount: "Ou montant exact :",
    customLabel: "Personnalisé",
    exactAmountPlaceholder: "Montant exact (ex. 18)",
    clearLabel: "Effacer",
    extraOptionsLabel: "OPTIONS SUPPLÉMENTAIRES",
    professionalGradeLabel: "Je cherche quelque chose de qualité professionnelle",
    extraDetailsPlaceholder: "Détail supplémentaire (facultatif)",
    submitBtn: "AFFICHER LES BONS PRODUITS",

    recipients: {
      Casa: "Maison",
      Giardino: "Jardin",
      Bricolage: "Bricolage",
      Officina: "Atelier",
    },
    vibes: {
      Elettroutensili: "Outils Électroportatifs",
      "Utensili manuali": "Outils à Main",
      Fissaggio: "Fixation",
      Sicurezza: "Sécurité",
      Organizzazione: "Rangement",
      Illuminazione: "Éclairage",
    },

    curating: "RECHERCHE EN COURS...",
    curatingSub: "Recherche des produits les plus adaptés à votre besoin...",
    loadingStep1: "Analyse de votre besoin",
    loadingStep2: "Filtrage des produits les plus fiables par catégorie",
    loadingStep3: "Préparation des liens directs et des détails",

    resultsHeaderTag: "BRICOLO AI • 3 SÉLECTIONS",
    backLabel: "Retour",
    optionLabel: "Option",
    newSearch: "Nouvelle Recherche",
    previous: "Précédent",
    next: "Suivant",
    ourPick: "Notre choix",
    reviewsLabel: "avis",
    whyPerfect: "Pourquoi c'est parfait :",
    seeInStore: "VOIR SUR LA BOUTIQUE",
    addToCart: "AJOUTER AU PANIER",
    searchOnAmazon: "RECHERCHER SUR AMAZON",
    dgmAppsCredit: "Fait partie de DGM Apps",
    copyLink: "Copier le Lien",
    copyLinkDone: "Copié & Ouvert !",
    moreProducts: "3 Autres Produits",
    amazonAffiliateDisclaimer: "En tant que Partenaire Amazon, Bricolo AI perçoit une commission sur les achats éligibles.",
    whatsAppShareText: "J'ai trouvé le bon produit pour mon projet : {title} ({price}) ! Regarde ça sur Amazon : {url}",

    aiVoiceAssistantTitle: "Assistant Vocal IA",
    listeningHint: "Écoute en cours... Parlez librement",
    tapMicHint: "Appuyez sur le micro pour parler",
    voiceNotSupported: "La reconnaissance vocale n'est pas prise en charge par ce navigateur. Vous pouvez saisir votre idée !",
    micPermissionDenied: "Permission microphone refusée. Vous pouvez saisir votre idée ci-dessous.",
    liveTranscriptLabel: "Transcription en direct / Idée :",
    voiceIdeaPlaceholder: "Ex. Perceuse-visseuse fiable pour un usage occasionnel à moins de 50€...",
    findProductNow: "TROUVER LE PRODUIT MAINTENANT",

    settingsTitle: "Réglages & App",
    interactionSection: "INTERACTION",
    hapticFeedback: "Retour Haptique (Vibration)",
    permissionsSection: "AUTORISATIONS & CONFIDENTIALITÉ",
    microphoneLabel: "Microphone (Recherche Vocale)",
    micGranted: "Permission accordée",
    micDenied: "Refusée par le navigateur",
    micPrompt: "Pas encore demandée",
    micUnchecked: "À vérifier",
    micOn: "Activé",
    micBlocked: "Bloqué",
    enableMicBtn: "Activer la Permission du Microphone",
    micBlockedHelp: "Vous avez bloqué le microphone pour ce site. Réactivez-le depuis les réglages du site dans votre navigateur (icône du cadenas dans la barre d'adresse).",
    legalSection: "MENTIONS LÉGALES & CONFORMITÉ",
    termsLabel: "Conditions Générales",
    affiliateLabel: "Partenariat Amazon & Mentions Légales",
    supportSection: "ASSISTANCE & INFOS",
    sendFeedbackBtn: "Envoyer un Avis",

    privacyTitle: "Politique de Confidentialité (RGPD UE)",
    termsTitle: "Conditions Générales",
    affiliateTitle: "Partenariat Amazon & Mentions Légales",
    close: "Fermer",
    privacyBody: [
      "Responsable du Traitement : Bricolo AI opère dans le respect des principes de minimisation des données et de confidentialité.",
      "Types de Données Collectées : Bricolo AI ne collecte, ne profile ni ne vend AUCUNE donnée personnelle de ses utilisateurs. L'application fonctionne entièrement via un stockage technique local dans le navigateur/appareil de l'utilisateur (localStorage) pour mémoriser la langue, le pays Amazon et les rappels de projets.",
      "Cookies Techniques : Seuls sont utilisés les cookies et stockages locaux strictement nécessaires au fonctionnement de l'application (état PWA, préférence de langue, liste des rappels). Aucun cookie de suivi publicitaire ou de profilage tiers n'est utilisé.",
      "Services Tiers (Google Gemini AI et Amazon) : Le traitement des recommandations de produits s'effectue côté serveur via des connexions HTTPS chiffrées. Aucun identifiant utilisateur n'est jamais transmis aux modèles d'IA.",
      "Droits de l'Utilisateur : L'utilisateur peut à tout moment supprimer ses données enregistrées en vidant simplement le cache du navigateur ou en réinitialisant les réglages de l'application.",
    ],
    termsBody: [
      "Nature du Service : Bricolo AI est un moteur de recommandation intelligent conçu pour suggérer des produits de maison, jardin et bricolage disponibles sur des boutiques en ligne telles qu'Amazon.",
      "Exclusion de Responsabilité : Les suggestions générées par l'Intelligence Artificielle ont un but informatif et heuristique. Bricolo AI n'est pas le vendeur direct des produits recommandés.",
      "Achats Externes : Les achats s'effectuent entièrement sur les sites Amazon officiels du pays sélectionné. L'utilisateur se fie aux conditions de vente, de garantie et de livraison fournies directement par Amazon.",
      "Propriété Intellectuelle : Le design, le code et l'interface de Bricolo AI sont protégés par le droit d'auteur. Les marques Amazon et les logos des produits appartiennent à leurs propriétaires respectifs.",
    ],
    affiliateIntro: "Déclaration de Partenariat Amazon & Mentions Légales Obligatoires",
    affiliateStatement: "En tant que Partenaire Amazon, Bricolo AI perçoit une commission sur les achats éligibles.",
    affiliateProgramNote: "Bricolo AI participe au Programme Partenaires Amazon EU et Amazon Associates US, un programme d'affiliation conçu pour permettre aux sites de percevoir des commissions publicitaires en créant des liens vers Amazon.fr, Amazon.com et leurs boutiques internationales respectives.",
    affiliatePricingTitle: "Avertissement Prix et Disponibilité :",
    affiliatePricingNote: "Les prix des produits affichés sont indicatifs, générés par l'intelligence artificielle au moment de la recherche ; le prix et la disponibilité affichés sur la page produit Amazon au moment de l'achat final font toujours foi. Lorsque l'intégration directe avec l'Amazon Product Advertising API sera active, les prix seront récupérés en temps réel directement depuis Amazon.",

    cookieBannerText: "Bricolo AI utilise des cookies techniques et des services de partenariat pour vous recommander les bons produits. En continuant à utiliser l'application, vous acceptez notre Politique de Confidentialité.",
    privacyPolicyLabel: "Politique de Confidentialité",
    acceptLabel: "Accepter",

    noConnectionTitle: "Aucune Connexion",
    noConnectionBody: "Vérifiez votre connexion internet pour continuer à chercher les bons produits.",
    checking: "VÉRIFICATION EN COURS...",
    retry: "RÉESSAYER",

    inAppBrowserWarning: "Pour une meilleure expérience, ouvrez dans Safari ou Chrome",
    installAppTitle: "Installez l'App en 1 Tap",
    installAppBody: "Accès instantané depuis votre écran d'accueil, sans passer par un store.",
    installNowBtn: "INSTALLER MAINTENANT",
    addToHomeScreenBtn: "AJOUTER À L'ÉCRAN D'ACCUEIL",
    installFallbackAlert: "Pour installer l'application, ouvrez le menu de votre navigateur et sélectionnez « Ajouter à l'écran d'accueil ».",
    iosAddToHomeTitle: "Ajouter à l'Écran d'Accueil iOS",
    iosStep1Title: "Appuyez sur le bouton « Partager »",
    iosStep1Body: "Il se trouve dans la barre du bas de Safari",
    iosStep2Title: "Sélectionnez « Ajouter à l'écran d'accueil »",
    iosStep2Body: "Faites défiler les options du menu de partage",
    iosPressShare: "Appuyez sur Partager Ci-Dessous",
    gotIt: "COMPRIS",

    errorTitle: "Un problème est survenu",
    errorBody: "Pas de souci — vos projets enregistrés sont en sécurité. Recommençons.",
    errorRetry: "Recommencer",
  },

  de: {
    language: "Sprache",
    selectLanguageRegion: "Sprache & Region",
    storeRegion: "Store-Region",
    regionNotice: "Produktlinks öffnen sich in der Währung und im Store deiner Region.",

    fastTrackPrompt: "Hast du eine Idee oder einen SOS? Sprich oder tippe...",

    step1Title: "Wofür brauchst du es?",
    step1Subtitle: "Wähle den Bereich zur Anpassung",
    back: "Zurück",

    step2Title: "Welche Art von Produkt suchst du?",
    step2Subtitle: "Wähle die Kategorie, die am besten passt",

    step3Title: "Budget & Stil",
    step3Subtitle: "Lege deine bevorzugte Preisspanne fest",
    orExactAmount: "Oder genauer Betrag:",
    customLabel: "Individuell",
    exactAmountPlaceholder: "Genauer Betrag (z. B. 18)",
    clearLabel: "Löschen",
    extraOptionsLabel: "ZUSATZOPTIONEN",
    professionalGradeLabel: "Ich suche etwas in professioneller Qualität",
    extraDetailsPlaceholder: "Zusätzliches Detail (optional)",
    submitBtn: "DIE RICHTIGEN PRODUKTE ANZEIGEN",

    recipients: {
      Casa: "Haus",
      Giardino: "Garten",
      Bricolage: "Heimwerken",
      Officina: "Werkstatt",
    },
    vibes: {
      Elettroutensili: "Elektrowerkzeuge",
      "Utensili manuali": "Handwerkzeuge",
      Fissaggio: "Befestigung",
      Sicurezza: "Sicherheit",
      Organizzazione: "Aufbewahrung",
      Illuminazione: "Beleuchtung",
    },

    curating: "SUCHE LÄUFT...",
    curatingSub: "Wir gleichen deinen Bedarf mit den besten verfügbaren Produkten ab...",
    loadingStep1: "Analyse deines Bedarfs",
    loadingStep2: "Filtern der zuverlässigsten Produkte nach Kategorie",
    loadingStep3: "Vorbereitung der Direktlinks und Details",

    resultsHeaderTag: "BRICOLO AI • 3 AUSWAHLEN",
    backLabel: "Zurück",
    optionLabel: "Option",
    newSearch: "Neue Suche",
    previous: "Zurück",
    next: "Weiter",
    ourPick: "Unsere Empfehlung",
    reviewsLabel: "Bewertungen",
    whyPerfect: "Warum es perfekt passt:",
    seeInStore: "IM STORE ANSEHEN",
    addToCart: "IN DEN WARENKORB",
    searchOnAmazon: "AUF AMAZON SUCHEN",
    dgmAppsCredit: "Teil von DGM Apps",
    copyLink: "Link Kopieren",
    copyLinkDone: "Kopiert & Geöffnet!",
    moreProducts: "3 Weitere Produkte",
    amazonAffiliateDisclaimer: "Als Amazon-Partner verdient Bricolo AI an qualifizierten Käufen.",
    whatsAppShareText: "Ich habe das richtige Produkt für mein Projekt gefunden: {title} ({price})! Schau es dir auf Amazon an: {url}",

    aiVoiceAssistantTitle: "KI-Sprachassistent",
    listeningHint: "Ich höre zu... Sprich frei",
    tapMicHint: "Tippe auf das Mikrofon zum Sprechen",
    voiceNotSupported: "Spracherkennung wird von diesem Browser nicht unterstützt. Du kannst deine Idee auch eintippen!",
    micPermissionDenied: "Mikrofonberechtigung verweigert. Du kannst deine Idee unten eintippen.",
    liveTranscriptLabel: "Live-Transkript / Idee:",
    voiceIdeaPlaceholder: "Z. B. Zuverlässiger Akkuschrauber für gelegentlichen Gebrauch unter 50€...",
    findProductNow: "PRODUKT JETZT FINDEN",

    settingsTitle: "Einstellungen & App",
    interactionSection: "INTERAKTION",
    hapticFeedback: "Haptisches Feedback (Vibration)",
    permissionsSection: "BERECHTIGUNGEN & DATENSCHUTZ",
    microphoneLabel: "Mikrofon (Sprachsuche)",
    micGranted: "Berechtigung erteilt",
    micDenied: "Vom Browser verweigert",
    micPrompt: "Noch nicht angefragt",
    micUnchecked: "Noch nicht geprüft",
    micOn: "Aktiv",
    micBlocked: "Blockiert",
    enableMicBtn: "Mikrofonberechtigung aktivieren",
    micBlockedHelp: "Du hast das Mikrofon für diese Website blockiert. Aktiviere es erneut in den Website-Einstellungen deines Browsers (Schloss-Symbol in der Adressleiste).",
    legalSection: "RECHTLICHES & COMPLIANCE",
    termsLabel: "Allgemeine Geschäftsbedingungen",
    affiliateLabel: "Amazon-Partnerprogramm & Hinweise",
    supportSection: "SUPPORT & INFO",
    sendFeedbackBtn: "Feedback Senden",

    privacyTitle: "Datenschutzerklärung (DSGVO EU)",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    affiliateTitle: "Amazon-Partnerprogramm & Hinweise",
    close: "Schließen",
    privacyBody: [
      "Verantwortlicher: Bricolo AI arbeitet nach den Grundsätzen der Datenminimierung und Vertraulichkeit.",
      "Art der erhobenen Daten: Bricolo AI erfasst, profiliert oder verkauft KEINE personenbezogenen Daten der Nutzer. Die App funktioniert vollständig über technische lokale Speicherung im Browser/Gerät des Nutzers (localStorage), um Spracheinstellungen, das Amazon-Land und Projekterinnerungen zu speichern.",
      "Technische Cookies: Es werden ausschließlich Cookies und lokale Speicher verwendet, die für die Kernfunktionen der App zwingend erforderlich sind (PWA-Status, Spracheinstellung, Erinnerungsliste). Es werden keine Werbe-Tracking- oder Profiling-Cookies Dritter verwendet.",
      "Drittanbieterdienste (Google Gemini AI & Amazon): Die Verarbeitung der Produktempfehlungen erfolgt serverseitig über verschlüsselte HTTPS-Verbindungen. Es wird keine Nutzerkennung an die KI-Modelle übermittelt.",
      "Rechte des Nutzers: Der Nutzer kann seine gespeicherten Daten jederzeit löschen, indem er einfach den Browser-Cache leert oder die App-Einstellungen zurücksetzt.",
    ],
    termsBody: [
      "Art des Dienstes: Bricolo AI ist eine intelligente Empfehlungs-Engine für Haus-, Garten- und Heimwerkerprodukte, die auf Online-Shops wie Amazon erhältlich sind.",
      "Haftungsausschluss: Die von der Künstlichen Intelligenz generierten Vorschläge dienen nur zu Informationszwecken und sind heuristischer Natur. Bricolo AI ist nicht der direkte Verkäufer der empfohlenen Produkte.",
      "Externe Käufe: Käufe erfolgen ausschließlich auf den offiziellen Amazon-Websites des ausgewählten Landes. Es gelten die Verkaufs-, Garantie- und Versandbedingungen, die direkt von Amazon bereitgestellt werden.",
      "Geistiges Eigentum: Design, Code und Benutzeroberfläche von Bricolo AI sind urheberrechtlich geschützt. Amazon-Marken und Produktlogos gehören ihren jeweiligen Eigentümern.",
    ],
    affiliateIntro: "Amazon-Partnerprogramm-Erklärung & verpflichtende Hinweise",
    affiliateStatement: "Als Amazon-Partner verdient Bricolo AI an qualifizierten Käufen.",
    affiliateProgramNote: "Bricolo AI nimmt am Amazon EU-Partnerprogramm und Amazon Associates US teil, einem Partnerprogramm, das Websites eine Möglichkeit bietet, durch Links zu Amazon.de, Amazon.com und den jeweiligen internationalen Stores Werbekostenerstattung zu verdienen.",
    affiliatePricingTitle: "Hinweis zu Preisen und Verfügbarkeit:",
    affiliatePricingNote: "Die angezeigten Produktpreise sind unverbindlich und werden von der KI zum Zeitpunkt der Suche generiert; maßgeblich sind stets Preis und Verfügbarkeit, die zum Zeitpunkt des endgültigen Kaufs auf der Amazon-Produktseite angezeigt werden. Sobald die direkte Integration mit der Amazon Product Advertising API aktiv ist, werden die Preise in Echtzeit direkt von Amazon abgerufen.",

    cookieBannerText: "Bricolo AI verwendet technische Cookies und Partnerprogramm-Dienste, um dir die passenden Produkte zu empfehlen. Durch die weitere Nutzung der App stimmst du unserer Datenschutzerklärung zu.",
    privacyPolicyLabel: "Datenschutzerklärung",
    acceptLabel: "Akzeptieren",

    noConnectionTitle: "Keine Verbindung",
    noConnectionBody: "Überprüfe deine Internetverbindung, um weiter nach den richtigen Produkten zu suchen.",
    checking: "PRÜFUNG LÄUFT...",
    retry: "ERNEUT VERSUCHEN",

    inAppBrowserWarning: "Für die beste Erfahrung öffne die App in Safari oder Chrome",
    installAppTitle: "App mit 1 Tap Installieren",
    installAppBody: "Sofortiger Zugriff über deinen Home-Bildschirm, ganz ohne App Store.",
    installNowBtn: "JETZT AUF HOME INSTALLIEREN",
    addToHomeScreenBtn: "ZUM HOME-BILDSCHIRM HINZUFÜGEN",
    installFallbackAlert: "Um die App zu installieren, öffne das Menü deines Browsers und wähle 'Zum Home-Bildschirm hinzufügen'.",
    iosAddToHomeTitle: "Zum iOS-Home-Bildschirm Hinzufügen",
    iosStep1Title: "Tippe auf die Schaltfläche 'Teilen'",
    iosStep1Body: "Zu finden in der unteren Leiste von Safari",
    iosStep2Title: "Wähle 'Zum Home-Bildschirm'",
    iosStep2Body: "Scrolle durch die Optionen im Teilen-Menü",
    iosPressShare: "Tippe Unten auf Teilen",
    gotIt: "VERSTANDEN",

    errorTitle: "Etwas ist schiefgelaufen",
    errorBody: "Kein Problem — deine gespeicherten Projekte sind sicher. Lass uns neu starten.",
    errorRetry: "Neu starten",
  },
};
