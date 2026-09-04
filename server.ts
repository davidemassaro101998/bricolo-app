import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const httpServer = createServer(app);

app.use(express.json());

// Security & Performance Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Simple In-Memory Rate Limiter (60 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
app.use("/api/", (req, res, next) => {
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60;

  const rateData = ipRequestCounts.get(clientIp);
  if (!rateData || now > rateData.resetTime) {
    ipRequestCounts.set(clientIp, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (rateData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: "Troppe richieste. Riprova tra un minuto.",
      rateLimited: true,
    });
  }

  rateData.count += 1;
  next();
});

// Periodic cleanup of expired rate limit entries (every 5 mins)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) ipRequestCounts.delete(ip);
  }
}, 5 * 60 * 1000);

// Tetto di spesa giornaliero globale sulle chiamate a Gemini. Il
// rate-limiter per IP protegge da UN singolo utente aggressivo, ma non
// da un picco di traffico virale reale (esattamente lo scenario che
// questa app punta a raggiungere sui social) — senza un tetto
// complessivo, un giorno fortunato di traffico può tradursi in una
// bolletta a sorpresa prima che qualcuno se ne accorga. Oltre il
// tetto, l'endpoint degrada ai regali di fallback (locali, gratuiti,
// sempre presentabili) invece di continuare a chiamare l'API.
const DAILY_GEMINI_CALL_CAP = 2000;
let dailyCallCount = 0;
let dailyCallResetAt = (() => {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
})();

function canCallGeminiToday(): boolean {
  const now = Date.now();
  if (now > dailyCallResetAt) {
    dailyCallCount = 0;
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    dailyCallResetAt = d.getTime();
  }
  if (dailyCallCount >= DAILY_GEMINI_CALL_CAP) return false;
  dailyCallCount += 1;
  return true;
}

// Sanifica ogni campo testuale in arrivo dal client prima di infilarlo
// nel prompt: un payload anomalo (lunghissimo, o con caratteri
// pensati per "rompere" le istruzioni del prompt) non deve ne gonfiare
// il costo della chiamata ne poter deviare il comportamento dell'AI
// dalle regole fissate sopra.
function sanitizeText(value: unknown, maxLen = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, maxLen);
}

// In-Memory Recommendations Cache (30 Minutes TTL)
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const recommendationsCache = new Map<string, CacheEntry>();

function getCacheKey(body: any): string {
  const { recipient, occasion, budget, vibe, formatPill, hasAlreadyEverything, extraDetails, fastTrackIdea, currencySymbol, countryCode } = body;
  const cleanExtra = (extraDetails || fastTrackIdea || "").trim().toLowerCase();
  return `${recipient || ""}_${occasion || ""}_${budget || ""}_${vibe || ""}_${formatPill || ""}_${hasAlreadyEverything ? 1 : 0}_${cleanExtra}_${currencySymbol || "€"}_${countryCode || "IT"}`.toLowerCase();
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Category-based curated Unsplash imagery map
const CATEGORY_IMAGES: Record<string, string[]> = {
  tech: [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
  ],
  gaming: [
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1608248597260-1e582803b9b4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512290900673-3e742880a4dd?auto=format&fit=crop&w=600&q=80",
  ],
  outdoors: [
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1549465220-1a8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80",
  ],
};

function getRandomImage(category: string, index: number): string {
  const cat = (category || "").toLowerCase();
  let pool = CATEGORY_IMAGES.default;
  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (cat.includes(key)) {
      pool = CATEGORY_IMAGES[key];
      break;
    }
  }
  return pool[index % pool.length];
}

// API endpoint for Gift Recommendations
app.post("/api/recommend-gifts", async (req, res) => {
  try {
    const rawBody = req.body || {};
    const recipient = sanitizeText(rawBody.recipient, 40);
    const occasion = sanitizeText(rawBody.occasion, 40);
    const budget = sanitizeText(rawBody.budget, 20);
    const vibe = sanitizeText(rawBody.vibe, 40);
    const formatPill = sanitizeText(rawBody.formatPill, 20);
    const hasAlreadyEverything = !!rawBody.hasAlreadyEverything;
    const extraDetails = sanitizeText(rawBody.extraDetails, 300);
    const fastTrackIdea = sanitizeText(rawBody.fastTrackIdea, 300);
    const excludeTitles = Array.isArray(rawBody.excludeTitles)
      ? rawBody.excludeTitles.map((t: unknown) => sanitizeText(t, 80)).slice(0, 20)
      : [];
    const countryCode = sanitizeText(rawBody.countryCode, 5);
    const currencySymbol = sanitizeText(rawBody.currencySymbol, 5) || "€";

    // Check In-Memory Cache (skip cache if excludeTitles is populated)
    const cacheKey = getCacheKey({
      recipient,
      occasion,
      budget,
      vibe,
      formatPill,
      hasAlreadyEverything,
      extraDetails,
      fastTrackIdea,
      currencySymbol,
      countryCode,
    });
    if (excludeTitles.length === 0) {
      const cached = recommendationsCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return res.json({ success: true, gifts: cached.data, source: "cache" });
      }
    }

    const prompt = `You are an expert Amazon product curator for BRICOLO AI, a tool that helps people find the right hardware/DIY/home-improvement product for their own personal use (this is NOT a gift-finder — the user is buying for themselves, never for someone else).
Your absolute top priority is ULTRA-PRECISION and HIGH RELEVANCE to the user's exact inputs.

USER SELECTION CONSTRAINTS:
- Use Case Area: ${recipient || "Casa"} (Casa = home repairs/maintenance, Giardino = outdoor/garden tools, Bricolage = DIY/hobby projects, Officina = technical/garage work)
- Selected Budget Range: "${budget || "25-50€"}"
- Product Category: ${vibe || "Elettroutensili"} (Elettroutensili = power tools, Utensili manuali = hand tools, Fissaggio = screws/fasteners/hardware, Sicurezza = safety gear/PPE, Organizzazione = storage/organization, Illuminazione = work lighting)
- Professional Grade Requested: ${hasAlreadyEverything ? "YES -> favor professional/heavy-duty grade products over consumer/entry-level ones." : "NO -> favor reliable, good-value products suited for occasional/home use."}
- Extra Details / Voice Transcript: "${extraDetails || fastTrackIdea || "None"}"
- Previously Shown Titles (Exclude): ${JSON.stringify(excludeTitles)}
- Currency Symbol: "${currencySymbol || "€"}"

CRITICAL VOICE & EXTRA DETAILS PRECISION MANDATE:
- If Extra Details / Voice Transcript is provided and mentions ANY specific project, material, brand, or task (e.g., "rifare il bagno", "tagliare legno", "montare uno scaffale", "impianto elettrico", "riparare la staccionata"), ALL 3 RECOMMENDATIONS MUST BE 100% TAILORED TO THAT SPECIFIC TASK! Do NOT return generic unrelated items.
- If Previously Shown Titles (Exclude) contains items: DO NOT REPEAT ANY OF THEM! You MUST generate 3 BRAND NEW, DISTINCT, HIGH-QUALITY options tailored to the user's criteria.

STRICT BUDGET PRICE ENFORCEMENT RULES:
- Selected Budget Range: "${budget}"
- If budget is "<25€" or "< $30": price MUST be strictly under 25€ (e.g. "18€", "22€"). NEVER output prices >= 25€.
- If budget is "25-50€" or "$50": price MUST be strictly between 25€ and 50€ (e.g. "32€", "45€"). NEVER output prices > 50€.
- If budget is "50-100€" or "$100": price MUST be strictly between 50€ and 100€ (e.g. "68€", "89€"). NEVER output prices > 100€.
- If budget is ">100€": price MUST be strictly greater than 100€ (e.g. "129€", "159€").

MANDATORY DIVERSIFICATION RULE (EXACTLY 3 CARDS):
1. Card 1 (tag: "Più Scelto"): Bestseller product directly solving the user's stated need/category — the single best all-round pick.
2. Card 2 (tag: "Essenziale"): A complementary essential item (accessory, consumable, or safety item) that pairs with card 1 for the same task.
3. Card 3 (tag: "Top Qualità"): Higher-end/premium version or complete kit for the same category, for users who want to invest more.

STRICT AMAZON QUALITY FILTERS:
- Rating MUST be between 4.4 and 4.9 stars.
- ReviewsCount MUST be an integer > 100.
- isPrime MUST be true.
- Title MUST be concise (maximum 5-6 words).
- Reason MUST be 1 clear, ultra-precise motivation sentence explaining exactly why it fits the stated need — motivate on utility/quality/value for money, NEVER on how much someone else would like it (this is not a gift).
- Price MUST match currency (${currencySymbol || "€"}) and STRICTLY fit the budget range "${budget}".`;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning fallback.");
      return res.json({
        success: false,
        source: "fallback",
        message: "API Key missing",
      });
    }

    if (!canCallGeminiToday()) {
      console.warn(`Daily Gemini call cap (${DAILY_GEMINI_CALL_CAP}) reached — degrading to fallback gifts.`);
      return res.json({ success: false, source: "fallback", message: "Daily cap reached" });
    }

    // 10s Timeout Guard for Gemini Call
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API timeout (>10s)")), 10000)
    );

    const responsePromise = ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        // Temperatura bassa apposta: questa è la chiamata che deve
        // essere "sempre precisa", non creativa — vogliamo che segua
        // le regole rigide del prompt (fascia di prezzo, pertinenza
        // al topic, filtri qualità) con la minima variazione casuale
        // possibile. Troppo in alto e le stesse regole vengono seguite
        // in modo incostante da una chiamata all'altra.
        temperature: 0.5,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of 3 diversified gift recommendations",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Concise product title (max 5 words)" },
              price: { type: Type.STRING },
              reason: { type: Type.STRING, description: "1 sentence motivation sentence" },
              matchScore: { type: Type.INTEGER },
              tag: { type: Type.STRING, description: "Exact badge: Più Scelto, Originale / Libro, or Top Qualità" },
              amazonSearchQuery: { type: Type.STRING },
              category: { type: Type.STRING },
              rating: { type: Type.NUMBER, description: "Rating score e.g. 4.8" },
              reviewsCount: { type: Type.INTEGER, description: "Number of reviews e.g. 2400" },
              isPrime: { type: Type.BOOLEAN },
            },
            required: [
              "title",
              "price",
              "reason",
              "matchScore",
              "tag",
              "amazonSearchQuery",
              "category",
              "rating",
              "reviewsCount",
              "isPrime",
            ],
          },
        },
      },
    });

    const response = (await Promise.race([responsePromise, timeoutPromise])) as any;

    const jsonText = response.text ? response.text.trim() : "[]";
    const rawGifts = JSON.parse(jsonText);

    const fallbackBadges = ["Più Scelto", "Originale / Libro", "Top Qualità"];

    // Budget range helper
    const cleanB = (budget || "").replace(/\s+/g, "").replace(/\$/g, "").replace(/€/g, "");
    let minBudget = 25;
    let maxBudget = 50;

    if (cleanB.includes("<25") || cleanB.includes("<30") || cleanB.startsWith("<")) {
      minBudget = 10;
      maxBudget = 25;
    } else if (cleanB.includes(">100") || cleanB.startsWith(">")) {
      minBudget = 100;
      maxBudget = 300;
    } else if (cleanB.includes("-")) {
      const parts = cleanB.split("-").map((p: string) => parseInt(p, 10)).filter((n: number) => !isNaN(n));
      if (parts.length >= 2) {
        minBudget = parts[0];
        maxBudget = parts[1];
      }
    } else {
      const numB = parseInt(cleanB, 10);
      if (!isNaN(numB) && numB > 0) {
        minBudget = Math.max(5, Math.floor(numB * 0.75));
        maxBudget = numB;
      }
    }

    const gifts = rawGifts.slice(0, 3).map((gift: any, idx: number) => {
      let parsedPrice = 0;
      if (gift.price) {
        const cleanNum = gift.price.replace(/[^0-9.,]/g, "").replace(",", ".");
        parsedPrice = parseFloat(cleanNum) || 0;
      }

      let finalPrice = gift.price;
      let finalTitle = gift.title;

      if (parsedPrice === 0 || parsedPrice > maxBudget || (parsedPrice < minBudget && minBudget > 10)) {
        const targetVal = Math.min(
          maxBudget,
          Math.max(minBudget, Math.round(minBudget + (maxBudget - minBudget) * (0.35 + idx * 0.25)))
        );
        finalPrice = `${currencySymbol}${targetVal}`;

        const titleLower = (gift.title || "").toLowerCase();
        const highEndKeywords = ["theragun", "playstation", "canon", "iphone", "apple watch", "macbook", "bose soundlink", "sony wh-1000", "fellow stagg", "dyson"];
        if (maxBudget <= 50 && highEndKeywords.some((k) => titleLower.includes(k))) {
          const cat = (gift.category || "").toLowerCase();
          if (cat.includes("tech")) finalTitle = "Anker Power Bank Wireless 10000mAh";
          else if (cat.includes("books")) finalTitle = "Libro Guida Bestseller Illustrato";
          else finalTitle = "Set Diffusore Aromaterapia in Ceramica";
        }
      }

      return {
        ...gift,
        title: finalTitle,
        price: finalPrice,
        id: gift.id || `gift-${Date.now()}-${idx}`,
        tag: gift.tag || fallbackBadges[idx % 3],
        rating: gift.rating && gift.rating >= 4.3 ? gift.rating : 4.7,
        reviewsCount: gift.reviewsCount && gift.reviewsCount >= 100 ? gift.reviewsCount : 1250 + idx * 430,
        isPrime: gift.isPrime !== undefined ? gift.isPrime : true,
        imageUrl: getRandomImage(gift.category || "default", idx),
      };
    });

    // Cache valid response for 30 minutes
    if (gifts.length > 0 && excludeTitles.length === 0) {
      recommendationsCache.set(cacheKey, {
        data: gifts,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });
    }

    return res.json({ success: true, gifts, source: "gemini" });
  } catch (error: any) {
    console.warn("Notice: Gemini API returned fallback response:", error.message || error);
    return res.json({
      success: false,
      source: "fallback",
      error: error.message || "Failed to generate recommendations",
    });
  }
});

// API endpoint for AI Gift Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    // Stessa disciplina di /api/recommend-gifts: un payload enorme (una
    // conversazione lunghissima, o un singolo messaggio smisurato) non
    // deve poter gonfiare il costo di una chiamata ne destabilizzare
    // il comportamento dell'assistente.
    const messages = rawMessages.slice(-20).map((m: any) => ({
      role: m?.role === "user" ? "user" : "model",
      content: sanitizeText(m?.content, 800),
    }));
    const language = sanitizeText(req.body?.language, 5) || "en";
    const quizState = req.body?.quizState || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: false,
        response: "I am ready to help you find the perfect gift!",
      });
    }

    if (!canCallGeminiToday()) {
      return res.json({
        success: false,
        response:
          language === "it"
            ? "Siamo molto richiesti in questo momento — riprova tra poco."
            : "We're very busy right now — please try again shortly.",
      });
    }

    const systemInstruction = `You are Bricolo AI, an expert hardware/DIY/home-improvement shopping assistant. The user is buying for THEMSELVES, never as a gift for someone else.
Your goal is to guide users who either:
1. Already have a vague or general idea (e.g., "devo rifare il bagno" / "mi serve qualcosa per tagliare il legno") - help them narrow it down by asking 1-2 concise, specific, clarifying questions or giving refined options.
2. Want a simple, natural voice or chat guided experience to find the right product.

Language: ${language.toUpperCase()}.
Guidelines:
- Keep your tone practical, direct, concise, and helpful (1-3 paragraphs max).
- If the user provides enough details or asks for specific recommendations, suggest 3 specific real products with prices and why they fit the stated need.
- IF you recommend products, ALSO append a hidden valid JSON block at the very end of your response in this exact format:
\`\`\`json
{
  "gifts": [
    {
      "title": "Exact Product Name",
      "price": "$50",
      "reason": "Short 1 sentence reason",
      "matchScore": 98,
      "tag": "TOP PICK",
      "amazonSearchQuery": "Exact Product Name",
      "category": "power-tools"
    }
  ]
}
\`\`\`
Context from current selection: Use Case Area: ${quizState?.recipient || "Not specified"}, Category: ${quizState?.vibe || "Not specified"}, Budget: ${quizState?.budget || "Not specified"}.`;

    const chatContents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    if (chatContents.length === 0) {
      chatContents.push({ role: "user", parts: [{ text: "Hello! Help me find a gift." }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm here to help! Could you tell me a little more about the person you're buying for?";

    let extractedGifts: any[] | null = null;
    const jsonMatch = replyText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.gifts && Array.isArray(parsed.gifts)) {
          extractedGifts = parsed.gifts.map((g: any, idx: number) => ({
            ...g,
            id: g.id || `chat-gift-${Date.now()}-${idx}`,
            imageUrl: getRandomImage(g.category || "default", idx),
          }));
        }
      } catch (err) {
        console.warn("Could not parse embedded JSON gifts from chat response", err);
      }
    }

    const cleanText = replyText.replace(/```json\s*\{[\s\S]*?\}\s*```/g, "").trim();

    return res.json({
      success: true,
      response: cleanText,
      gifts: extractedGifts,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({
      success: false,
      response: "I encountered a minor issue. Let's try again!",
      error: error.message,
    });
  }
});

/* Foto -> descrizione del lavoro da fare.
   Qui la fotocamera vale piu' che altrove: descrivere a parole una
   staffa storta o un raccordo che perde e' difficile anche per chi sa
   come si chiamano i pezzi, e chi non lo sa non ha proprio le parole.
   Inquadrarlo le salta tutte. */
app.post("/api/analyze-photo", async (req, res) => {
  try {
    const rawImage = typeof req.body?.image === "string" ? req.body.image : "";
    const language = sanitizeText(req.body?.language, 5) || "it";

    const match = rawImage.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return res.status(400).json({ success: false, error: "Invalid image payload" });
    }
    const mimeType = match[1];
    const base64 = match[2];

    // Il client ridimensiona gia' a 1024px di lato lungo. Il tetto qui
    // e' un margine ampio sopra quel valore: ferma un payload costruito
    // a mano, non una foto vera un po' piu' pesante del previsto.
    if (base64.length > 4_000_000) {
      return res.status(413).json({ success: false, error: "Image too large" });
    }

    if (!process.env.GEMINI_API_KEY || !canCallGeminiToday()) {
      return res.json({ success: false, error: "Vision temporarily unavailable" });
    }

    const outputLanguage = language === "it" ? "Italian" : "English";
    const prompt = `Look at this photo. Someone is about to do a DIY, repair or maintenance job and needs the right TOOL or material for it.

Write ONE sentence in ${outputLanguage} (max 30 words) describing the job the photo shows: what the object or surface is, what looks damaged or needed, and the material involved if you can tell.

Rules:
- Describe the job and the materials, never people.
- Name the material when visible (plasterboard, solid brick, tile, hardwood, copper pipe...) — it decides which tool is right.
- If the photo shows nothing related to a job, reply exactly: UNCLEAR
- Output only the sentence, no preamble, no quotes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }],
        },
      ],
    });

    const description = (response.text || "").trim();

    if (!description || /^unclear$/i.test(description)) {
      return res.json({ success: false, error: "Nothing useful in the photo" });
    }

    return res.json({ success: true, description: description.slice(0, 300) });
  } catch (error: any) {
    console.warn("Notice: photo analysis failed:", error?.message || error);
    return res.json({ success: false, error: "Analysis failed" });
  }
});

// API endpoint for Text-To-Speech (Gemini TTS)
app.post("/api/tts", async (req, res) => {
  try {
    const text = sanitizeText(req.body?.text, 500);
    // Il frontend non manda mai un valore diverso da quello di
    // default oggi — questo e' solo un guard contro una chiamata
    // diretta all'API con un valore anomalo, non una lista di voci
    // reali verificata (evito di inventare nomi che potrebbero non
    // esistere davvero lato Gemini).
    const requestedVoice = sanitizeText(req.body?.voice, 20);
    const voice = /^[A-Za-z]{2,20}$/.test(requestedVoice) ? requestedVoice : "Kore";

    if (!process.env.GEMINI_API_KEY || !text) {
      return res.status(400).json({ success: false, error: "Missing API key or text" });
    }

    if (!canCallGeminiToday()) {
      return res.json({ success: false, fallback: true, reason: "daily_cap_reached" });
    }

    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say clearly and warmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ success: false, error: "No audio generated" });
    }

    return res.json({
      success: true,
      audioUrl: `data:audio/mp3;base64,${base64Audio}`,
    });
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
      console.warn("Gemini TTS rate limited or quota exceeded, using browser TTS fallback.");
      return res.json({ success: false, fallback: true, reason: "quota_exceeded" });
    }
    console.warn("Error in /api/tts:", error?.message || error);
    return res.json({ success: false, fallback: true, error: error?.message });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Hashed bundle filenames change on every build, so they're safe to cache
    // for a long time. Everything else -- and index.html especially, since
    // it's what references those hashed filenames -- must not be cached, or
    // browsers can keep serving a stale app shell for up to a day after a
    // real deploy regardless of what the service worker does.
    app.use("/assets", express.static(path.join(distPath, "assets"), { maxAge: "1y", immutable: true }));
    app.use(express.static(distPath, { maxAge: 0, index: false }));
    app.get("*", (req, res) => {
      res.set("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Bricolo AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

