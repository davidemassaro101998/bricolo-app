# Bricolo AI

Trova l'attrezzo giusto per casa, giardino, bricolage e officina in 3 tap:
l'utente descrive cosa deve fare (o lo dice a voce), Gemini propone 3
prodotti reali con link d'acquisto su Amazon. Parte della famiglia
[DGM Apps](https://github.com/davidemassaro101998/dgm-apps-site), insieme a
[Kado AI](https://github.com/davidemassaro101998/kado-app) e
[Forma AI](https://github.com/davidemassaro101998/forma-app).

## Stack

React 19 + Vite + TypeScript, Express (server-side Gemini calls, rate
limiting per IP, tetto di spesa giornaliero), PWA installabile (manifest,
service worker, icone), 5 lingue (IT/EN/ES/FR/DE).

## Sviluppo locale

```bash
npm install
cp .env.example .env.local   # imposta GEMINI_API_KEY
npm run dev                  # http://localhost:3000
npm run lint                 # tsc --noEmit
npm run build && npm start   # build + avvio in modalità produzione
```

## Deploy

Il server legge la porta da `process.env.PORT` (fallback 3000), compatibile
con Railway/Render/qualsiasi PaaS Node. Variabili d'ambiente richieste in
produzione: `GEMINI_API_KEY`.

## Monetizzazione

I link Amazon in `src/data/countries.ts` (`buildAmazonUrl`) usano i tag di
affiliazione Amazon Associates per paese — verificare che siano i tag reali
registrati per questa app prima del lancio (attualmente condivide gli stessi
tag di Kado AI, da separare).
