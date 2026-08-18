import React, { useState, useEffect } from "react";
import { Card, CardProgress } from "../types";
import { CREED_CARDS } from "../data";
import { Trophy, RefreshCw, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

interface Props {
  progressList: CardProgress[];
  onUpdateProgressScore: (cardId: number, score: number) => void;
  isDark?: boolean;
}

export const QuizRecital: React.FC<Props> = ({ progressList, onUpdateProgressScore, isDark = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [evaluatedResult, setEvaluatedResult] = useState<{
    score: number;
    feedback: string;
    matchedPhrases?: string[];
    missingPhrases?: string[];
  } | null>(null);

  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showFirstLetters, setShowFirstLetters] = useState(false);

  const card = CREED_CARDS[currentIndex];
  const progress = progressList.find((p) => p.cardId === card.id);

  useEffect(() => {
    setUserInput("");
    setEvaluatedResult(null);
    setError(null);
    setShowCheatSheet(false);
    setShowFirstLetters(false);
  }, [currentIndex]);

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % CREED_CARDS.length);
  };

  const handlePreviousCard = () => {
    setCurrentIndex((prev) => (prev - 1 + CREED_CARDS.length) % CREED_CARDS.length);
  };

  const getFirstLetters = (text: string) => {
    return text
      .split(/\s+/)
      .map((word) => {
        const clean = word.replace(/[^a-zA-Z]/g, "");
        if (clean.length === 0) return word;
        return clean[0] + ".".repeat(Math.max(1, clean.length - 1));
      })
      .join(" ");
  };

  const handleRecitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setEvaluatedResult(null);

    try {
      const response = await fetch("/api/tutor/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cue: card.cue,
          correctText: card.response,
          userText: userInput
        })
      });

      if (!response.ok) {
        throw new Error("Unable to complete evaluation from the AI tutor.");
      }

      const data = await response.json();
      setEvaluatedResult(data);
      onUpdateProgressScore(card.id, data.score);
    } catch (err: any) {
      console.error(err);
      setError("AI assessment currently offline. Simulating local check...");
      
      const localScore = Math.round(compareHeuristically(card.response, userInput) * 100);
      const fallbackData = {
        score: localScore,
        feedback: `Local assessment match: ${localScore}%. (For detailed feedback, confirm server configuration & Gemini API Key on Google AI Studio).`,
        matchedPhrases: [],
        missingPhrases: []
      };
      setEvaluatedResult(fallbackData);
      onUpdateProgressScore(card.id, localScore);
    } finally {
      setIsLoading(false);
    }
  };

  const compareHeuristically = (correct: string, user: string): number => {
    const normCorrect = correct.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const normUser = user.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    if (normCorrect.length === 0) return 0;
    
    let matches = 0;
    for (const w of normUser) {
      if (normCorrect.includes(w)) {
        matches++;
      }
    }
    return Math.min(matches / normCorrect.length, 1.0);
  };

  const inspirationalPhrases = [
    "Meditating on your recitation...",
    "Reconciling against councils...",
    "Validating assembly responses...",
    "Evaluating word choices..."
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % inspirationalPhrases.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className="space-y-6">
      
      {/* Quiz Top Controls / Progression Map */}
      <div className={`p-5 border rounded-3xl shadow-sm animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-205"}`}>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] block">Assembly recitation</span>
          <h2 className={`text-xl font-serif font-medium tracking-tight flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <span>{card.themeTitle}</span>
            <span className="text-xs font-mono font-normal text-slate-500">({card.phaseLabel})</span>
          </h2>
        </div>

        {/* Level Controls & Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousCard}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border shadow-xs cursor-pointer transition-all duration-305 ${isDark ? "text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border-slate-800" : "text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-50 border-slate-200"}`}
          >
            ← Previous
          </button>
          
          <div className={`text-xs font-mono px-4 py-2 border rounded-full font-bold transition-all duration-300 ${isDark ? "bg-[#1C1D24] border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-650"}`}>
            Card {card.id} / 13
          </div>

          <button
            onClick={handleNextCard}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border shadow-xs cursor-pointer transition-all duration-305 ${isDark ? "text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border-slate-800" : "text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-50 border-slate-200"}`}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Enter/Practice Form) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleRecitalSubmit} className="space-y-4">
            
            {/* The Cue display */}
            <div className={`p-6 border rounded-3xl space-y-2 shadow-xs transition-colors duration-305 ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-200"}`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Liturgical Lead-in Call</span>
              <p className={`font-serif italic text-xl md:text-2xl leading-snug transition-colors duration-300 ${isDark ? "text-slate-200" : "text-slate-800"}`}>"{card.cue}"</p>
            </div>

            {/* Prompt Area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider" htmlFor="user-recall">
                  Type the remainder of response:
                </label>
                
                <span className="text-[10.5px] text-slate-500 font-mono">
                  {card.response.length} characters • ~{card.response.split(/\s+/).length} words
                </span>
              </div>

              <textarea
                id="user-recall"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
                placeholder="Give the official creed response here..."
                className={`w-full h-36 rounded-2xl p-4 focus:outline-none focus:ring-1 text-base md:text-lg resize-none tracking-normal leading-relaxed shadow-xs transition-colors duration-300 ${isDark ? "bg-slate-900 border border-slate-800 text-slate-200 focus:border-slate-700 placeholder-[#475569]/70 focus:ring-slate-800" : "bg-white border border-slate-200 text-slate-850 focus:border-slate-450 placeholder-slate-400 focus:ring-slate-350"}`}
              />
            </div>

            {/* Assistants / Helper Widgets */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowFirstLetters(!showFirstLetters)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono border text-[11px] uppercase tracking-wider cursor-pointer transition-all duration-301 ${
                  showFirstLetters 
                    ? isDark ? "bg-amber-950/40 text-amber-450 border-amber-900/40 shadow-xs" : "bg-amber-50 text-amber-800 border-amber-250 shadow-xs"
                    : isDark ? "bg-[#1C1D24] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#252731]" : "bg-white text-slate-650 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {showFirstLetters ? <EyeOff size={11} /> : <Eye size={11} />}
                <span>Letters Blueprint</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCheatSheet(!showCheatSheet)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono border text-[11px] uppercase tracking-wider cursor-pointer transition-all duration-301 ${
                  showCheatSheet 
                    ? isDark ? "bg-red-950/40 text-red-400 border-red-900/45 shadow-xs" : "bg-red-50 text-red-650 border-red-200 shadow-xs" 
                    : isDark ? "bg-[#1C1D24] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-[#252731]" : "bg-white text-slate-650 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {showCheatSheet ? <EyeOff size={11} /> : <Eye size={11} />}
                <span>Cheat Reveal</span>
              </button>

              {userInput && (
                <button
                  type="button"
                  onClick={() => setUserInput("")}
                  className={`px-3.5 py-2 border rounded-full font-mono text-[11px] uppercase tracking-wider ml-auto cursor-pointer transition-colors duration-300 ${isDark ? "text-slate-400 hover:text-slate-200 bg-[#1C1D24] border-slate-800" : "text-slate-600 hover:text-slate-950 bg-white border-slate-200"}`}
                >
                  Clear Input
                </button>
              )}
            </div>

            {/* Dynamic Reveal Areas */}
            {showFirstLetters && (
              <div className={`p-4 border rounded-2xl text-xs font-mono leading-relaxed shadow-xs transition-colors duration-300 ${isDark ? "bg-slate-900/80 border-slate-800 text-amber-400" : "bg-amber-50/50 border-amber-200 text-amber-800"}`}>
                <span className="text-[10px] text-slate-500 block mb-1">Starting letter indicators:</span>
                {getFirstLetters(card.response)}
              </div>
            )}

            {showCheatSheet && (
              <div className={`p-4 border-l-2 rounded-r-2xl text-xs leading-relaxed transition-all duration-300 ${isDark ? "bg-[#1C1212]/50 border-red-900 bg-gradient-to-r from-red-950/20 to-transparent text-slate-300" : "bg-red-50/40 border-red-350 bg-gradient-to-r from-red-100/20 to-transparent text-slate-700"}`}>
                <span className={`text-[10px] font-mono block mb-1 ${isDark ? "text-red-400" : "text-red-700"}`}>Assembly Response Text:</span>
                <p className="font-serif italic text-sm">"{card.response}"</p>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="w-full py-4 bg-[#D4C9B4] hover:bg-[#C4963A] disabled:bg-[#1E2026] text-slate-950 disabled:text-slate-500 font-bold tracking-widest rounded-full transition text-xs uppercase shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={13} />
                  <span>{inspirationalPhrases[phraseIndex]}</span>
                </div>
              ) : (
                <span>Submit Recitation Evaluation</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (Evaluating Response) */}
        <div className="lg:col-span-5 flex flex-col">
          
          {/* Default blank state */}
          {!evaluatedResult && !isLoading && (
            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-3xl min-h-[300px] transition-colors duration-300 ${isDark ? "bg-[#131418] border-slate-800" : "bg-white border-slate-300/60"}`}>
              <Trophy size={28} className="text-slate-400 mb-3" />
              <h3 className={`font-semibold mb-1 text-sm tracking-tight ${isDark ? "text-slate-300" : "text-slate-800"}`}>Recitation evaluation ready</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                Test your knowledge by typing out the assembly response on the left, then trigger the evaluation engine for detailed feedback.
              </p>
            </div>
          )}

          {/* Loading state placeholders */}
          {isLoading && (
            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 border rounded-3xl min-h-[300px] shadow-sm transition-colors duration-300 ${isDark ? "bg-[#131418] border-slate-800/60" : "bg-white border-slate-205"}`}>
              <RefreshCw size={28} className="text-slate-600 animate-spin mb-4" />
              <div className={`h-3 w-28 rounded mb-2 mx-auto animate-pulse ${isDark ? "bg-[#1E2026]" : "bg-slate-100"}`}></div>
              <div className={`h-2 w-44 rounded mx-auto animate-pulse ${isDark ? "bg-[#1C1D24]" : "bg-slate-50"}`}></div>
            </div>
          )}

          {/* Result Card Layout */}
          {evaluatedResult && !isLoading && (
            <div className={`flex-1 p-6 border rounded-3xl space-y-4 shadow-sm transition-colors duration-300 ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-205"}`}>
              
              {/* Score bar / header */}
              <div className={`flex items-center justify-between border-b pb-3 transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Score Assessment</span>
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className={evaluatedResult.score >= 90 ? "text-amber-500" : "text-slate-500"} />
                  <span className={`text-xl font-mono font-bold ${
                    evaluatedResult.score >= 90
                      ? "text-emerald-500"
                      : evaluatedResult.score >= 60
                      ? "text-amber-600"
                      : "text-red-500"
                  }`}>
                    {evaluatedResult.score}%
                  </span>
                </div>
              </div>

              {/* Feedback text */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Tutor Verdict</span>
                <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-line font-serif italic transition-colors duration-305 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {evaluatedResult.feedback}
                </p>
              </div>

              {/* Matched phrases tags */}
              {evaluatedResult.matchedPhrases && evaluatedResult.matchedPhrases.length > 0 && (
                <div className={`space-y-1.5 pt-3 border-t transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 font-bold">
                    <Check size={11} className="text-emerald-500" /> Matches:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {evaluatedResult.matchedPhrases.map((phrase, i) => (
                      <span key={i} className={`px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-full border transition-all duration-300 ${isDark ? "bg-emerald-950/40 text-emerald-350 border-emerald-900/30" : "bg-emerald-50 text-emerald-805 border-emerald-200"}`}>
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing phrases tags */}
              {evaluatedResult.missingPhrases && evaluatedResult.missingPhrases.length > 0 && (
                <div className={`space-y-1.5 pt-3 border-t transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 font-bold">
                    <X size={11} className="text-red-500" /> Missed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {evaluatedResult.missingPhrases.map((phrase, i) => (
                      <span key={i} className={`px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider rounded-full border transition-all duration-300 ${isDark ? "bg-red-950/40 text-red-350 border-red-900/30" : "bg-red-50 text-red-800 border-red-200"}`}>
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips for continuing */}
              {evaluatedResult.score < 90 && (
                <div className={`p-3 rounded-2xl text-[11px] leading-relaxed animate-fadeIn transition-colors duration-300 border ${isDark ? "bg-amber-950/20 border-amber-900/40 text-amber-300" : "bg-amber-50/60 border-amber-205 text-amber-800"}`}>
                  Tip: Use the Letters Blueprint or consult the flashcards deck to master correct recitation.
                </div>
              )}
              
              {evaluatedResult.score >= 90 && (
                <div className={`p-3 rounded-2xl text-[11px] leading-relaxed flex items-center gap-1.5 animate-fadeIn transition-colors duration-305 border ${isDark ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300" : "bg-emerald-50/60 border-emerald-205 text-emerald-800"}`}>
                  <span>✨ Perfect score. Your recall corresponds exactly to canonical Liturgical standards.</span>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
