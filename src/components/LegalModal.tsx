import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, FileText, ShoppingBag } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

export type LegalDocType = "privacy" | "terms" | "affiliate" | null;

interface LegalModalProps {
  isOpen: boolean;
  type: LegalDocType;
  onClose: () => void;
  language: Language;
}

// privacyBody/termsBody entries are stored as "Label: rest of the sentence"
// strings — split on the first colon so the label can render bold like the
// original hand-written markup did.
function splitLabel(entry: string): [string, string] {
  const idx = entry.indexOf(":");
  if (idx === -1) return ["", entry];
  return [entry.slice(0, idx + 1), entry.slice(idx + 1).trim()];
}

export const LegalModal: React.FC<LegalModalProps> = React.memo(({
  isOpen,
  type,
  onClose,
  language,
}) => {
  if (!isOpen || !type) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getTitle = () => {
    if (type === "privacy") return t.privacyTitle;
    if (type === "terms") return t.termsTitle;
    return t.affiliateTitle;
  };

  const getIcon = () => {
    if (type === "privacy") return <ShieldCheck className="w-5 h-5 text-[#E8590C]" />;
    if (type === "terms") return <FileText className="w-5 h-5 text-[#E8590C]" />;
    return <ShoppingBag className="w-5 h-5 text-[#E8590C]" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white text-[#000000] rounded-[28px] p-5 sm:p-6 max-w-lg w-full border border-[#E5E5EA] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden gpu-layer"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F2F2F7]">
                {getIcon()}
              </div>
              <h3 className="font-extrabold text-base text-[#000000]">
                {getTitle()}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F2F2F7] text-[#68686D] hover:text-[#000000] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs leading-relaxed font-normal text-[#000000] pr-1">
            {type === "privacy" && (
              <>
                <p className="font-bold text-sm text-[#E8590C]">
                  {t.privacyTitle}
                </p>
                {t.privacyBody.map((entry, i) => {
                  const [label, rest] = splitLabel(entry);
                  return (
                    <p key={i}>
                      <strong>{label}</strong> {rest}
                    </p>
                  );
                })}
              </>
            )}

            {type === "terms" && (
              <>
                <p className="font-bold text-sm text-[#E8590C]">
                  {t.termsTitle}
                </p>
                {t.termsBody.map((entry, i) => {
                  const [label, rest] = splitLabel(entry);
                  return (
                    <p key={i}>
                      <strong>{label}</strong> {rest}
                    </p>
                  );
                })}
              </>
            )}

            {type === "affiliate" && (
              <>
                <p className="font-bold text-sm text-[#E8590C]">
                  {t.affiliateIntro}
                </p>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[#E5E5EA] font-semibold text-xs text-[#000000] space-y-2">
                  <p>
                    "{t.affiliateStatement}"
                  </p>
                  <p className="text-[11px] font-normal text-[#68686D]">
                    {t.affiliateProgramNote}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F2F2F7] border border-[#E5E5EA] space-y-1.5">
                  <span className="font-bold text-xs text-[#000000] block">
                    {t.affiliatePricingTitle}
                  </span>
                  <p className="text-[11px] text-[#68686D] leading-relaxed">
                    {t.affiliatePricingNote}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E5E5EA] mt-3 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-[#E8590C] text-white font-bold text-xs cursor-pointer hover:bg-[#C24A08] transition-colors"
            >
              {t.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
