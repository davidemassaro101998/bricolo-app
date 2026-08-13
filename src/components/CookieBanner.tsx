import React, { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Language } from "../data/translations";

interface CookieBannerProps {
  language: Language;
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = React.memo(({
  language,
  onOpenPrivacy,
}) => {
  const [accepted, setAccepted] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kado_cookie_accepted");
      if (stored !== "true") {
        setAccepted(false);
      }
    } catch (e) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("kado_cookie_accepted", "true");
    } catch (e) {
      // ignore
    }
    setAccepted(true);
  };

  if (accepted) return null;

  const isIt = language === "it";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[95] bg-[#000000]/95 backdrop-blur-md text-white border-t border-white/10 px-3.5 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom,0px))] sm:py-3 text-xs flex items-center justify-between gap-3 shadow-2xl">
      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/90 max-w-2xl">
        <Cookie className="w-4 h-4 text-[#E8590C] shrink-0" />
        <span className="leading-snug">
          {isIt
            ? "Bricolo AI utilizza cookie tecnici e servizi di affiliazione per consigliarti i prodotti giusti. Continuando ad usare l'app accetti la nostra Privacy Policy."
            : "Bricolo AI uses technical cookies and affiliate services to recommend the right products. By continuing to use the app, you accept our Privacy Policy."}
        </span>
        <button
          onClick={onOpenPrivacy}
          className="underline text-[#E8590C] font-bold hover:text-white shrink-0 cursor-pointer ml-1"
        >
          {isIt ? "Privacy Policy" : "Privacy Policy"}
        </button>
      </div>

      <button
        onClick={handleAccept}
        className="py-1.5 px-4 rounded-xl bg-[#E8590C] text-white font-bold text-xs hover:bg-[#C24A08] active:scale-95 transition-all shrink-0 cursor-pointer shadow-sm"
      >
        {isIt ? "Accetta" : "Accept"}
      </button>
    </div>
  );
});
