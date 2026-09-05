import { useState } from "react";
import { Drill, Hammer, Lightbulb, Package, Sprout, Wrench, Zap, Package2 } from "lucide-react";

/* Al posto della foto ci va un pannello DISEGNATO QUI.
   Prima c'era uno scatto d'archivio preso da images.unsplash.com, e aveva
   tre problemi tutti veri:
   - era un dominio ESTERNO in un prodotto che non ne ha nessun altro:
     se non risponde resta un rettangolo bianco vuoto, e non c'era alcun
     ripiego;
   - non era il prodotto. Era una foto a caso della categoria, messa
     accanto a un titolo, un prezzo e un voto precisi: sembra la foto di
     quell'oggetto e non lo e';
   - costava una richiesta e un'attesa su ogni scheda.
   Il pannello qui sotto e' onesto (non finge di essere una fotografia),
   non chiede niente alla rete e si vede sempre. Quando arriveranno le
   immagini vere di Amazon basta passare `src`: si prova quella e, se non
   carica, si ricade qui. */

const ICONE: Record<string, typeof Package2> = {
  "electrical": Zap,
  "garden": Sprout,
  "hand-tools": Hammer,
  "lighting": Lightbulb,
  "power-tools": Drill,
  "storage": Package,
  "workshop": Wrench,
};

export function ImmagineProdotto({
  titolo,
  categoria,
  src,
}: {
  titolo: string;
  categoria?: string;
  src?: string;
}) {
  const Icona = ICONE[(categoria || "").toLowerCase()] || Package2;
  const [rotta, setRotta] = useState(false);
  const usaFoto = !!src && !rotta;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #FF8A1F1F 0%, #1A140F 62%, #1A140F 100%)",
      }}
    >
      {usaFoto ? (
        <img
          src={src}
          alt={titolo}
          loading="lazy"
          decoding="async"
          onError={() => setRotta(true)}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <>
          {/* Trama leggera: da' materia al pannello senza chiedere niente
              alla rete -- e' un gradiente ripetuto, non un'immagine. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #332A1E 0 1px, transparent 1px 9px)",
            }}
          />
          <Icona
            className="relative h-11 w-11 sm:h-12 sm:w-12"
            style={{ color: "#FF8A1F" }}
            strokeWidth={1.5}
            aria-hidden
          />
        </>
      )}
    </div>
  );
}
