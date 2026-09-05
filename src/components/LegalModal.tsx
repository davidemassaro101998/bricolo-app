import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, FileText, ShoppingBag } from "lucide-react";
import { Language } from "../data/translations";

export type LegalDocType = "privacy" | "terms" | "affiliate" | null;

interface LegalModalProps {
  isOpen: boolean;
  type: LegalDocType;
  onClose: () => void;
  language: Language;
}

export const LegalModal: React.FC<LegalModalProps> = React.memo(({
  isOpen,
  type,
  onClose,
  language,
}) => {
  if (!isOpen || !type) return null;

  const isIt = language === "it";

  const getTitle = () => {
    if (type === "privacy") return "Privacy Policy (GDPR EU)";
    if (type === "terms") return isIt ? "Termini e Condizioni" : "Terms & Conditions";
    return isIt ? "Affiliazione Amazon & Disclaimers" : "Amazon Affiliate & Disclaimers";
  };

  const getIcon = () => {
    if (type === "privacy") return <ShieldCheck className="w-5 h-5 text-[#FF8A1F]" />;
    if (type === "terms") return <FileText className="w-5 h-5 text-[#FF8A1F]" />;
    return <ShoppingBag className="w-5 h-5 text-[#FF8A1F]" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1A1610] text-[#F5F1EA] rounded-[28px] p-5 sm:p-6 max-w-lg w-full border border-[#332A1E] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden gpu-layer"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#332A1E] pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#221C14]">
                {getIcon()}
              </div>
              <h3 className="font-extrabold text-base text-[#F5F1EA]">
                {getTitle()}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label={isIt ? "Chiudi" : "Close"}
              className="tocco-44 relative p-1.5 rounded-full hover:bg-[#221C14] text-[#97908A] hover:text-[#F5F1EA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs leading-relaxed font-normal text-[#F5F1EA] pr-1">
            {type === "privacy" && (
              <>
                <p className="font-bold text-sm text-[#FF8A1F]">
                  Informativa sulla Privacy e Trattamento Dati (GDPR EU 2016/679)
                </p>
                <p>
                  <strong>1. Titolare del Trattamento:</strong> Bricolo AI opera nel rispetto dei principi di minimizzazione dei dati e riservatezza.
                </p>
                <p>
                  <strong>2. Tipologia di Dati Raccolti:</strong> Bricolo AI NON raccoglie, profila né vende dati personali degli utenti. L'applicazione funziona interamente tramite salvataggi locali tecnici nel browser/dispositivo dell'utente (localStorage) per memorizzare le impostazioni di lingua, paese Amazon e promemoria calendario.
                </p>
                <p>
                  <strong>3. Cookie Tecnici:</strong> Vengono utilizzati esclusivamente cookie e archivi locali strettamente necessari per le funzionalità operative dell'applet (PWA state, preferenze lingua, lista promemoria). Non vengono impiegati cookie di tracciamento pubblicitario o profilazione di terze parti.
                </p>
                <p>
                  <strong>4. Servizi Terzi (Google Gemini AI & Amazon PA-API):</strong> Le elaborazioni per la raccomandazione dei prodotti avvengono lato server tramite connessioni crittografate HTTPS. Nessun identificativo dell'utente viene trasmesso ai modelli AI.
                </p>
                <p>
                  <strong>5. Diritti dell'Utente:</strong> L'utente può in qualsiasi momento cancellare i propri dati salvati semplicemente svuotando la cache del browser o ripristinando le impostazioni dell'app.
                </p>
              </>
            )}

            {type === "terms" && (
              <>
                <p className="font-bold text-sm text-[#FF8A1F]">
                  {isIt ? "Termini e Condizioni di Utilizzo" : "Terms & Conditions"}
                </p>
                <p>
                  <strong>1. Natura del Servizio:</strong> Bricolo AI è un motore di raccomandazione intelligente sviluppato per suggerire prodotti per la casa, il giardino e il fai-da-te reperibili su store online come Amazon.
                </p>
                <p>
                  <strong>2. Esclusione di Responsabilità:</strong> I suggerimenti generati dall'Intelligenza Artificiale hanno scopo informativo ed euristico. Bricolo AI non è il venditore diretto dei prodotti consigliati.
                </p>
                <p>
                  <strong>3. Acquisti Esterni:</strong> Gli acquisti avvengono interamente sui siti ufficiali Amazon del paese selezionato. L'utente si affida alle condizioni di vendita, garanzia e spedizione fornite direttamente da Amazon.
                </p>
                <p>
                  <strong>4. Proprietà Intellettuale:</strong> Il design, il codice e l'interfaccia di Bricolo AI sono protetti da copyright. I marchi Amazon e i loghi dei prodotti appartengono ai rispettivi proprietari.
                </p>
              </>
            )}

            {type === "affiliate" && (
              <>
                <p className="font-bold text-sm text-[#FF8A1F]">
                  Dichiarazione di Affiliazione Amazon & Disclaimers Obbligatori
                </p>

                <div className="p-3.5 rounded-2xl bg-[#221C14] border border-[#332A1E] font-semibold text-xs text-[#F5F1EA] space-y-2">
                  <p>
                    "In qualità di Affiliato Amazon, Bricolo AI riceve un guadagno dagli acquisti idonei."
                  </p>
                  <p className="text-[11px] font-normal text-[#97908A]">
                    Bricolo AI partecipa al Programma Affiliazione Amazon EU e Amazon Associates US, un programma di affiliazione progettato per fornire ai siti un mezzo per guadagnare commissioni pubblicitarie creando link verso Amazon.it, Amazon.com e i rispettivi store internazionali.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#221C14] border border-[#332A1E] space-y-1.5">
                  <span className="font-bold text-xs text-[#F5F1EA] block">
                    Disclaimer Prezzi e Disponibilità:
                  </span>
                  <p className="text-[11px] text-[#97908A] leading-relaxed">
                    Prezzi e disponibilità dei prodotti sono forniti in tempo reale da Amazon PA-API e sono soggetti a variazioni continue. Fa fede il prezzo ed la disponibilità mostrati sulla pagina prodotto di Amazon al momento dell'acquisto finale.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#332A1E] mt-3 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-[#FF8A1F] text-[#100E0B] font-bold text-xs cursor-pointer hover:bg-[#D96F0F] transition-colors"
            >
              {isIt ? "Chiudi" : "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
