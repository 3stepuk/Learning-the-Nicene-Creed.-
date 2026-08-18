import React from "react";

export type ThemeHint =
  | "cosmic-abstractions"
  | "luminous-gold"
  | "bursting-light"
  | "divine-creation"
  | "glowing-hills"
  | "mountaintop-dawn"
  | "shining-ether"
  | "sovereign-throne"
  | "ethereal-winds"
  | "golden-tapestry"
  | "cathedrals"
  | "flowing-water"
  | "new-creation";

interface Props {
  theme: ThemeHint;
}

export const GoldAbstractBg: React.FC<Props> = ({ theme }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0F1013] select-none flex items-center justify-center transition-all duration-1000">
      {/* Dynamic Light Minimalist Geometric Artwork Layout */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full opacity-90">
        <defs>
          <linearGradient id="gold-fine-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4C9B4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C4963A" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="soft-bone-radial" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#1C1D24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B0C0E" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#soft-bone-radial)" />

        {/* Minimalist Sacred Lines (highly architectural and clean) */}
        {theme === "cosmic-abstractions" && (
          <>
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" />
            <path d="M 15,50 Q 50,15 85,50" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" strokeDasharray="1,2" />
            <path d="M 15,50 Q 50,85 85,50" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" />
          </>
        )}

        {(theme === "luminous-gold" || theme === "bursting-light" || theme === "divine-creation") && (
          <>
            <line x1="50" y1="0" x2="50" y2="100" stroke="#7A6D56" strokeWidth="0.3" />
            <circle cx="50" cy="55" r="28" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.75" />
            <circle cx="50" cy="55" r="1.5" fill="#D4C9B4" />
            <ellipse cx="50" cy="55" rx="42" ry="12" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" transform="rotate(-15 50 55)" />
          </>
        )}

        {(theme === "glowing-hills" || theme === "mountaintop-dawn" || theme === "shining-ether" || theme === "sovereign-throne") && (
          <>
            {/* Elegant fluid thin curves like topographic minimalism */}
            <path d="M -10,65 C 25,48 55,72 110,55 L 110,110 L -10,110 Z" fill="#16171D" opacity="0.6" />
            <path d="M -10,55 C 30,68 62,45 110,65 L 110,110 L -10,110 Z" fill="#121318" opacity="0.4" />
            <path d="M -10,65 C 25,48 55,72 110,55" fill="none" stroke="#D4C9B4" strokeWidth="0.4" />
            <path d="M -10,55 C 30,68 62,45 110,65" fill="none" stroke="#C4963A" strokeWidth="0.4" strokeDasharray="1,1" />
          </>
        )}

        {(theme === "ethereal-winds" || theme === "golden-tapestry") && (
          <>
            <path d="M -20,45 C 30,22 68,78 120,38" fill="none" stroke="#D4C9B4" strokeWidth="0.4" />
            <path d="M -20,53 C 25,30 60,88 120,48" fill="none" stroke="#7A6D56" strokeWidth="0.4" strokeDasharray="1,1" />
            <circle cx="45" cy="40" r="12" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" />
          </>
        )}

        {(theme === "cathedrals" || theme === "flowing-water" || theme === "new-creation") && (
          <>
            {/* Vaulted Gothic Arches */}
            <path d="M 15,95 Q 50,15 85,95" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.75" />
            <path d="M 30,95 Q 50,38 70,95" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" strokeDasharray="1,1" />
            <line x1="50" y1="15" x2="50" y2="95" stroke="#7A6D56" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="8" fill="none" stroke="url(#gold-fine-1)" strokeWidth="0.5" />
          </>
        )}
      </svg>

      {/* A delicate soft lens overlay to yield beautiful fine focus on the typography */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
  );
};
