import React, { useState } from "react";
import { CREED_CARDS, THEOLOGICAL_GLOSSARY } from "../data";
import { Card, TermExplanation } from "../types";
import { BookOpen, ChevronDown, ChevronUp, Landmark, Shield, Globe, Award, Sparkles, RefreshCw } from "lucide-react";

interface Props {
  onAskTutor: (query: string) => void;
  isDark?: boolean;
}

export const MainStudyGuide: React.FC<Props> = ({ onAskTutor, isDark = true }) => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(1);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);
  
  const [elaborationCache, setElaborationCache] = useState<Record<string, string>>({});
  const [loadingTerm, setLoadingTerm] = useState<string | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleElaborateTerm = async (term: string, context: string) => {
    if (elaborationCache[term]) {
      setSelectedGlossaryTerm(term);
      return;
    }

    setLoadingTerm(term);
    try {
      const response = await fetch("/api/tutor/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: term,
          context: context
        })
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve term explanation");
      }

      const data = await response.json();
      setElaborationCache(prev => ({
        ...prev,
        [term]: data.explanation
      }));
      setSelectedGlossaryTerm(term);
    } catch (err) {
      console.error(err);
      setSelectedGlossaryTerm(term);
    } finally {
      setLoadingTerm(null);
    }
  };

  const phases = [
    { title: "Phase 1: The Father", cards: CREED_CARDS.filter(c => c.phaseId === 1) },
    { title: "Phase 2: The Son", cards: CREED_CARDS.filter(c => c.phaseId === 2) },
    { title: "Phase 3: The Holy Spirit", cards: CREED_CARDS.filter(c => c.phaseId === 3) },
    { title: "Phase 4: The Church & Last Things", cards: CREED_CARDS.filter(c => c.phaseId === 4) }
  ];

  const churchChars = [
    { name: "One", desc: "United in one faith, one Lord, one baptism.", icon: Shield },
    { name: "Holy", desc: "Set apart and sanctified by the Spirit.", icon: Landmark },
    { name: "Catholic", desc: "Universal, for all peoples and all times.", icon: Globe },
    { name: "Apostolic", desc: "Founded on the teaching of the Apostles.", icon: Award }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Deep Structural Outline of the Creed */}
      <div className="lg:col-span-8 space-y-6">
        <div className={`flex items-center justify-between pb-2 border-b transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-205"}`}>
          <h2 className={`text-xl font-serif font-medium tracking-tight flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <BookOpen size={18} className="text-[#D4C9B4]" />
            <span>Liturgical Structure & Outline</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">13 Core Memorization Units</span>
        </div>

        <div className="space-y-6 animate-fadeIn">
          {phases.map((p, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em] uppercase">
                {p.title}
              </h3>
              
              <div className="space-y-2">
                {p.cards.map((card) => {
                  const isExpanded = expandedCardId === card.id;
                  return (
                    <div 
                      key={card.id} 
                      className={`border rounded-3xl transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? isDark 
                            ? "bg-[#131418] border-[#3a3730]/65 shadow-md"
                            : "bg-white border-[#D4C9B4] shadow-md shadow-slate-100/40"
                          : isDark 
                            ? "bg-[#131418] border-slate-850 hover:border-slate-800"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                      }`}
                    >
                      {/* Header row */}
                      <button
                        onClick={() => toggleCard(card.id)}
                        className={`w-full px-5 py-4 flex items-center justify-between text-left select-none outline-none focus:outline-none cursor-pointer transition-colors duration-200 ${isDark ? "hover:bg-slate-900/40" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono select-none px-2 rounded-full border transition-colors ${isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {card.id}
                          </span>
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-555 text-slate-500 block tracking-wider uppercase mb-0.5">
                              {card.themeTitle}
                            </span>
                            <p className={`font-medium text-sm md:text-base italic line-clamp-1 font-serif transition-colors duration-300 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                              "{card.cue}"
                            </p>
                          </div>
                        </div>

                        <div>
                          {isExpanded ? <ChevronUp size={16} className={isDark ? "text-slate-100" : "text-slate-800"} /> : <ChevronDown size={16} className="text-slate-500" />}
                        </div>
                      </button>

                      {/* Expanded Section with response and note */}
                      {isExpanded && (
                        <div className={`px-5 pb-5 pt-1 space-y-4 border-t transition-colors duration-300 ${isDark ? "border-slate-850/80 bg-slate-950/20" : "border-slate-150 bg-slate-50/50"}`}>
                          
                          {/* Formal slate formatted response */}
                          <div className={`p-4 rounded-2xl border space-y-1 transition-colors duration-305 ${isDark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-201"}`}>
                            <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest uppercase">
                              Complete Response Segment:
                            </span>
                            <p className={`text-base italic font-serif leading-relaxed transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              "{card.response}"
                            </p>
                          </div>

                          {/* Historical Significance notes */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase block mb-1">
                              Theological Significance:
                            </span>
                            <p className={`text-xs leading-relaxed font-sans transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-650"}`}>
                              {card.note}
                            </p>
                          </div>

                          {/* Trigger Elaborate directly */}
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => onAskTutor(`Tell me more about the section on: "${card.themeTitle}" with the line "${card.response}"`)}
                              className={`text-[11px] font-mono flex items-center gap-1.5 px-4 py-2 rounded-full border shadow-xs cursor-pointer transition-all duration-300 ${isDark ? "text-slate-300 hover:text-slate-100 bg-[#1C1D24] hover:bg-[#252731] border-slate-800" : "text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border-slate-200"}`}
                            >
                              <Sparkles size={11} className="text-[#D4C9B4]" />
                              <span>Discuss with AI Companion</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* MARKS CALLOUT */}
        <div className={`p-6 border rounded-3xl space-y-4 transition-colors duration-300 shadow-xs ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-200"}`}>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase block">Special Markings</span>
            <h3 className={`text-base font-serif font-medium uppercase transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>The Four Marks of the Church</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {churchChars.map((cc, i) => {
              const IconComp = cc.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl space-y-1 border transition-colors duration-300 ${isDark ? "bg-slate-900/40 border-slate-800/60" : "bg-slate-50/80 border-slate-150"}`}>
                  <div className={`flex items-center gap-2 text-xs font-semibold font-sans transition-colors ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    <IconComp size={13} className="text-slate-500" />
                    <span>{cc.name}</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed font-sans transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                     {cc.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <div className={`text-[10px] font-mono italic leading-relaxed pt-3 border-t transition-colors duration-300 ${isDark ? "border-slate-850 text-slate-550" : "border-slate-150 text-slate-500"}`}>
            Cue: "I believe in one…" → Response: "…holy, catholic and apostolic Church."
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Theological Glossary Terms */}
      <div className="lg:col-span-4 space-y-6">
        <div className={`space-y-1 pb-2 border-b transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-205"}`}>
          <h2 className={`text-xl font-serif font-medium tracking-tight flex items-center gap-2 transition-colors duration-400 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <Landmark size={18} className="text-[#D4C9B4]" />
            <span>Theological Glossary</span>
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed">Select a vocabulary landmark below to unpack Council definitions.</p>
        </div>

        <div className="space-y-3">
          {THEOLOGICAL_GLOSSARY.map((item, idx) => {
            const isSelected = selectedGlossaryTerm === item.term;
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? isDark 
                      ? "bg-[#131418] border-[#3a3730] shadow-xs" 
                      : "bg-white border-[#D4C9B4] shadow-md shadow-slate-100/30"
                    : isDark 
                      ? "bg-[#131418] border-slate-850 hover:border-slate-805" 
                      : "bg-white border-slate-201 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${isDark ? "text-slate-200" : "text-slate-850"}`}>{item.term}</h4>
                  
                  {loadingTerm === item.term ? (
                    <RefreshCw className="text-slate-450 animate-spin" size={11} />
                  ) : (
                    <button
                      onClick={() => handleElaborateTerm(item.term, item.theology)}
                      className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 cursor-pointer ${isDark ? "text-slate-500 hover:text-[#D4C9B4]" : "text-slate-500 hover:text-[#B48E3D]"}`}
                    >
                      {isSelected ? "Less" : "Ask AI"}
                    </button>
                  )}
                </div>

                <p className={`text-[11px] mt-1 italic leading-relaxed font-serif transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-650"}`}>
                  {item.definition}
                </p>

                {isSelected && (
                  <div className={`mt-3 pt-3 border-t space-y-3 animate-fadeIn transition-colors duration-301 ${isDark ? "border-slate-855" : "border-slate-150"}`}>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Standard Context</span>
                      <p className={`text-[11px] leading-relaxed font-sans transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-655"}`}>
                        {item.theology}
                      </p>
                    </div>

                    {/* Show dynamic AI elaboration if cached */}
                    {elaborationCache[item.term] && (
                      <div className={`py-2.5 px-3 rounded-xl border space-y-1 transition-colors duration-300 ${isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-slate-50 border-slate-201"}`}>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1 font-bold">
                          <Sparkles size={8} className="text-[#D4C9B4]" /> AI Companion Elaboration
                        </span>
                        <p className={`text-[11.5px] leading-relaxed font-serif italic transition-colors duration-300 ${isDark ? "text-[#A4A198]" : "text-slate-700"}`}>
                          {elaborationCache[item.term]}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => onAskTutor(`Can you give me a deep historical and ecumenical lesson about the theological term: "${item.term}"?`)}
                      className={`w-full text-center py-2 text-[10px] font-mono rounded-full border uppercase tracking-wider cursor-pointer font-bold transition duration-301 ${isDark ? "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400" : "bg-slate-105 hover:bg-slate-205 border-slate-201 text-slate-700"}`}
                    >
                      Discuss in Chat →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
