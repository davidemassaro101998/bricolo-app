import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Language, TRANSLATIONS } from "../data/translations";

interface LoadingApple3DProps {
  language?: Language;
  subtitle?: string;
}

// "Il Rito": cronometro da pit-stop che conta IN SU con i decimi, dentro
// un arco d'aura che ruota, aura ambra che respira ai bordi dello
// schermo e un battito aptico a ogni cambio di fase. Niente conto alla
// rovescia: mostrare un numero che scende ancorerebbe l'utente a
// un'attesa percepita fissa anche quando la risposta arriva prima. Il
// cronometro che sale con i decimi che corrono comunica velocita, e
// quando il risultato arriva si ferma: quel tempo e la vittoria, ed e
// lo stesso numero che finisce nel badge della card condivisibile.
const RING_RADIUS = 106;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const ARC_DASH = `${RING_CIRCUMFERENCE * 0.28} ${RING_CIRCUMFERENCE * 0.72}`;

export const LoadingApple3D: React.FC<LoadingApple3DProps> = React.memo(({ language = "en", subtitle }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [tenths, setTenths] = useState(0);

  const steps = [
    t.loadingStep1,
    t.loadingStep2,
    t.loadingStep3,
  ];

  const elapsedSeconds = tenths / 10;
  const activeStep = elapsedSeconds >= 9 ? 2 : elapsedSeconds >= 4 ? 1 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTenths((prev) => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(activeStep === 0 ? 12 : 24);
      } catch (e) {
        // ignore
      }
    }
  }, [activeStep]);

  const stopwatch = (tenths / 10).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 select-none bg-[#0C0906] relative overflow-hidden">
      {/* Aura ai bordi dello schermo: il dispositivo di marca. */}
      <motion.div
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 100px 10px rgba(255,138,31,0.4), inset 0 0 240px 50px rgba(255,194,77,0.15)" }}
      />
      <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,138,31,0.35), transparent)", filter: "blur(36px)" }} />
      <div className="absolute -bottom-24 -right-28 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,194,77,0.28), transparent)", filter: "blur(36px)" }} />

      <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-extrabold tracking-[0.3em] text-[#B3ACA1] uppercase">Bricolo AI</span>
        <h2
          className="text-xl sm:text-2xl text-[#F5F1EA] leading-tight"
          style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
        >
          {t.curating}
        </h2>
        <p className="text-[11px] text-[#97908A] font-medium max-w-xs">
          {subtitle || t.curatingSub}
        </p>
      </div>

      <div className="relative z-10 my-[clamp(0.75rem,3.5vh,2rem)] w-[clamp(11rem,32vh,15rem)] h-[clamp(11rem,32vh,15rem)] shrink-0 flex items-center justify-center">
        <div className="absolute inset-[-14%] rounded-full pointer-events-none" style={{ background: "radial-gradient(closest-side, rgba(255,138,31,0.3), rgba(255,194,77,0.1) 60%, transparent)", filter: "blur(26px)" }} />
        <motion.svg
          viewBox="0 0 240 240"
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="120" cy="120" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <circle
            cx="120"
            cy="120"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#ritoRingGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={ARC_DASH}
          />
          <defs>
            <linearGradient id="ritoRingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FF8A1F" />
              <stop offset="1" stopColor="#FFC24D" />
            </linearGradient>
          </defs>
        </motion.svg>
        <div className="relative flex flex-col items-center gap-0.5">
          <span
            className="text-[clamp(2.8rem,9vh,4.5rem)] leading-none bg-clip-text text-transparent tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              backgroundImage: "linear-gradient(135deg, #FF8A1F, #FFC24D)",
              WebkitBackgroundClip: "text",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {stopwatch}
          </span>
          <span className="text-[10px] font-bold tracking-[0.22em] text-[#97908A] uppercase">
            {language === "it" ? "secondi" : "seconds"}
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xs space-y-2 shrink-0">
        {steps.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`p-3 rounded-[16px] border text-xs font-semibold flex items-center gap-3 transition-all duration-300 ${
                isCurrent
                  ? "bg-[rgba(255,138,31,0.1)] border-[rgba(255,138,31,0.45)] text-[#F5F1EA] shadow-[0_0_24px_rgba(255,138,31,0.18)] font-extrabold"
                  : isDone
                  ? "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F5F1EA]"
                  : "bg-[rgba(255,255,255,0.03)] border-transparent text-[#8B857A]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                  isDone
                    ? "bg-[#FF8A1F] text-white font-black"
                    : isCurrent
                    ? "border-2 border-[#FF8A1F] shadow-[0_0_12px_rgba(255,138,31,0.6)]"
                    : "bg-[rgba(255,255,255,0.08)] text-[#8B857A]"
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A1F]" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-[11px] text-left line-clamp-1">{stepText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
