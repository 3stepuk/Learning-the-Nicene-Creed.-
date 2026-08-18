import React, { useState, useEffect } from "react";
import { Card, MasteryStatus, CardProgress } from "../types";
import { CREED_CARDS } from "../data";
import { GoldAbstractBg } from "./GoldAbstractBg";
import { ChevronLeft, ChevronRight, HelpCircle, RefreshCw, BookOpen } from "lucide-react";

interface Props {
  progressList: CardProgress[];
  onUpdateProgress: (cardId: number, status: MasteryStatus) => void;
  isDark?: boolean;
}

export const FlashcardDeck: React.FC<Props> = ({ progressList, onUpdateProgress, isDark = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const card = CREED_CARDS[currentIndex];
  const progress = progressList.find((p) => p.cardId === card.id) || {
    cardId: card.id,
    status: "Not Started" as MasteryStatus,
    attemptsCount: 0,
  };

  useEffect(() => {
    setIsFlipped(false);
    setShowNote(false);
    setShowHint(false);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CREED_CARDS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CREED_CARDS.length) % CREED_CARDS.length);
  };

  const statusColors: Record<MasteryStatus, string> = isDark ? {
    "Not Started": "bg-[#1E2026] text-slate-400 border-slate-800",
    "Struggling": "bg-red-950/40 text-red-400 border-red-900/40",
    "Learning": "bg-amber-950/40 text-amber-400 border-amber-900/40",
    "Mastered": "bg-emerald-950/40 text-emerald-400 border-emerald-900/40",
  } : {
    "Not Started": "bg-slate-100 text-slate-500 border-slate-200",
    "Struggling": "bg-red-50 text-red-650 border-red-200",
    "Learning": "bg-amber-50 text-amber-800 border-amber-200",
    "Mastered": "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const getFirstLettersHint = (text: string) => {
    return text
      .split(/\s+/)
      .map((word) => {
        const clean = word.replace(/[^a-zA-Z]/g, "");
        if (clean.length === 0) return word;
        return clean[0] + ".".repeat(Math.max(1, clean.length - 1));
      })
      .join(" ");
  };

  return (
    <div className={`w-full flex flex-col md:flex-row min-h-[580px] rounded-3xl overflow-hidden border transition-colors duration-300 shadow-md ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-205"}`}>
      
      {/* LEFT COLUMN: Clean Minimalist Visual Artwork Panel */}
      <div className={`w-full md:w-5/12 h-48 md:h-auto relative flex items-center justify-center border-b md:border-b-0 md:border-r transition-all duration-300 ${isDark ? "border-slate-800/50" : "border-slate-200/60"}`}>
        <GoldAbstractBg theme={card.imageThemeHint as any || "cosmic-abstractions"} />
        
        {/* Soft Minimalist overlay slide tag */}
        <div className={`absolute inset-x-0 bottom-5 px-5 py-3.5 backdrop-blur-md mx-5 rounded-2xl border flex items-center justify-between shadow-sm transition-all duration-300 ${isDark ? "bg-[#1C1D24]/95 border-slate-800/80" : "bg-white/95 border-slate-200/80 shadow-xs shadow-slate-100/10"}`}>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-500 block">Liturgical Track</span>
            <span className={`text-xs font-semibold tracking-tight truncate max-w-[140px] block transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{card.themeTitle}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono">Phase Card</span>
            <div className={`text-xs font-mono font-bold ${isDark ? "text-[#D4C9B4]" : "text-slate-800"}`}>
              {currentIndex + 1} / {CREED_CARDS.length}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive High-Contrast CardDetails */}
      <div className={`w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-between transition-colors duration-300 ${isDark ? "bg-[#131418]" : "bg-[#FAF9F6]"}`}>
        
        {/* Top controls layer */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wider font-mono transition-all duration-300 ${isDark ? "border-slate-800 bg-slate-900 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}>
              {card.phaseLabel}
            </span>
            <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-wider font-mono transition-all duration-300 ${statusColors[progress.status]}`}>
              {progress.status}
            </span>
          </div>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-305 shadow-xs cursor-pointer ${isDark ? "border-slate-800 text-slate-200 bg-[#1C1D24] hover:bg-[#252731]" : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"}`}
          >
            <RefreshCw size={11} className={isFlipped ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
            <span>Flip card</span>
          </button>
        </div>

        {/* COMPREHENSIVE FLIP SECTION */}
        <div className="flex-1 flex flex-col justify-center my-6 min-h-[250px]">
          {!isFlipped ? (
            /* FRONT STATE */
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 block mb-1">Theme Origin</span>
                <h2 className={`text-2xl font-serif font-medium tracking-tight transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{card.themeTitle}</h2>
              </div>
              
              <div className="py-4 border-l-2 border-[#D4C9B4]/60 pl-4 space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block">Initiating Call Cue</span>
                <p className={`text-2xl md:text-3xl leading-[1.3] font-serif italic transition-colors duration-300 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                  "{card.cue}"
                </p>
              </div>

              {/* Memory Aid */}
              <div className="pt-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`text-[11px] font-mono flex items-center gap-1 transition-colors duration-300 ${isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <HelpCircle size={13} />
                  <span>{showHint ? "Hide Alphabet First-Letter Blueprint" : "Show Alphabet First-Letter Blueprint"}</span>
                </button>
                {showHint && (
                  <div className={`mt-3 p-3.5 border rounded-xl text-xs font-mono tracking-normal select-none leading-relaxed shadow-xs transition-colors duration-300 ${isDark ? "bg-slate-900 border-slate-800/80 text-slate-400" : "bg-white border-slate-200 text-slate-650"}`}>
                    {getFirstLettersHint(card.response)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* BACK STATE */
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 block mb-1">Authentic Assembly</span>
                <h2 className={`text-2xl font-serif font-medium tracking-tight transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{card.themeTitle}</h2>
              </div>

              <div className="py-4 border-l-2 border-emerald-700 pl-4 space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-600 block">Exact Assembly Response</span>
                <p className={`text-2xl md:text-3xl leading-[1.3] font-serif italic transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  "{card.response}"
                </p>
              </div>

              {/* Extra context */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setShowNote(!showNote)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-300 shadow-xs cursor-pointer ${isDark ? "text-slate-300 hover:text-slate-100 bg-slate-900 border-slate-800/80" : "text-slate-600 hover:text-slate-900 bg-white border-slate-200"}`}
                >
                  <BookOpen size={12} className="text-[#D4C9B4]" />
                  <span>{showNote ? "Hide Theological Insight" : "Explore Theological Insight"}</span>
                </button>

                {showNote && (
                  <p className={`text-xs p-3.5 rounded-xl border leading-relaxed shadow-inner transition-colors duration-300 ${isDark ? "text-slate-300 bg-slate-950/80 border-slate-850" : "text-slate-600 bg-slate-100 border-slate-200"}`}>
                    {card.note}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV & RATING SECTOR */}
        <div className={`mt-6 pt-6 border-t transition-all duration-300 space-y-5 ${isDark ? "border-slate-800/50" : "border-slate-205"}`}>
          
          {/* Rate Confidence */}
          <div className="space-y-2">
            <span className={`text-[10px] font-mono tracking-widest uppercase block ${isDark ? "text-slate-400" : "text-slate-500"}`}>Rate your self-recall confidence:</span>
            <div className="grid grid-cols-4 gap-2">
              {(["Struggling", "Learning", "Mastered"] as MasteryStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    onUpdateProgress(card.id, st);
                    if (st === "Mastered") {
                      setTimeout(() => {
                        handleNext();
                      }, 500);
                    }
                  }}
                  className={`py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer uppercase tracking-wider ${
                    progress.status === st
                      ? st === "Mastered"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-800 shadow-xs"
                        : st === "Learning"
                        ? "bg-amber-950/40 text-amber-400 border-amber-900/40 shadow-xs"
                        : "bg-red-950/40 text-red-400 border-red-900/40 shadow-xs"
                      : isDark
                        ? "bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-800"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={() => onUpdateProgress(card.id, "Not Started")}
                className={`py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer uppercase tracking-wider ${
                  progress.status === "Not Started"
                    ? isDark
                      ? "bg-slate-800 text-slate-200 border-slate-700"
                      : "bg-slate-200 text-slate-800 border-slate-300"
                    : isDark
                      ? "bg-slate-900 hover:bg-slate-850 text-slate-500 border-slate-800"
                      : "bg-white hover:bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Navigation keys */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${isDark ? "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-100" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"}`}
              aria-label="Previous card"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono select-none">
              Press navigation buttons to shift cards
            </span>

            <button
              onClick={handleNext}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${isDark ? "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-100" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"}`}
              aria-label="Next card"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
