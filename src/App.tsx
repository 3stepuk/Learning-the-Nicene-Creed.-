import { useState, useEffect } from "react";
import { CREED_CARDS } from "./data";
import { CardProgress, MasteryStatus } from "./types";
import { FlashcardDeck } from "./components/FlashcardDeck";
import { QuizRecital } from "./components/QuizRecital";
import { MainStudyGuide } from "./components/MainStudyGuide";
import { AITutorChat } from "./components/AITutorChat";
import { BookOpen, Layers, Award, MessageSquare, Compass, Sun, Moon } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"deck" | "quiz" | "guide" | "chat">("deck");
  const [progressList, setProgressList] = useState<CardProgress[]>([]);
  const [activeChatQuery, setActiveChatQuery] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("creed_memorizer_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("creed_memorizer_theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  // Initialize progress state from localStorage on boot
  useEffect(() => {
    const saved = localStorage.getItem("creed_memorizer_progress_v1");
    if (saved) {
      try {
        setProgressList(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing progress state:", e);
        initializeDefaultProgress();
      }
    } else {
      initializeDefaultProgress();
    }
  }, []);

  const initializeDefaultProgress = () => {
    const defaultProgress: CardProgress[] = CREED_CARDS.map((c) => ({
      cardId: c.id,
      status: "Not Started" as MasteryStatus,
      attemptsCount: 0,
    }));
    setProgressList(defaultProgress);
    localStorage.setItem("creed_memorizer_progress_v1", JSON.stringify(defaultProgress));
  };

  // Update card status Confidence rating from Deck
  const handleUpdateProgress = (cardId: number, status: MasteryStatus) => {
    const updated = progressList.map((p) => {
      if (p.cardId === cardId) {
        return {
          ...p,
          status,
          attemptsCount: p.attemptsCount + 1,
          lastPracticedDate: new Date().toLocaleDateString(),
        };
      }
      return p;
    });
    setProgressList(updated);
    localStorage.setItem("creed_memorizer_progress_v1", JSON.stringify(updated));
  };

  // Update card score from Quiz/Recital
  const handleUpdateProgressScore = (cardId: number, score: number) => {
    const updated = progressList.map((p) => {
      if (p.cardId === cardId) {
        // Decide status in alignment with score thresholds
        let newStatus = p.status;
        if (score >= 90) newStatus = "Mastered" as MasteryStatus;
        else if (score >= 60) newStatus = "Learning" as MasteryStatus;
        else newStatus = "Struggling" as MasteryStatus;

        return {
          ...p,
          status: newStatus,
          lastAttemptScore: score,
          attemptsCount: p.attemptsCount + 1,
          lastPracticedDate: new Date().toLocaleDateString(),
        };
      }
      return p;
    });
    setProgressList(updated);
    localStorage.setItem("creed_memorizer_progress_v1", JSON.stringify(updated));
  };

  const handleResetAllProgress = () => {
    if (window.confirm("Do you want to reset all your learning logs and memorization accomplishments? This is irreversible.")) {
      initializeDefaultProgress();
    }
  };

  // Calculate learning progress statistics
  const masteredCount = progressList.filter((p) => p.status === "Mastered").length;
  const learningCount = progressList.filter((p) => p.status === "Learning").length;
  const strugglingCount = progressList.filter((p) => p.status === "Struggling").length;
  const completionPercentage = Math.round((masteredCount / CREED_CARDS.length) * 100);

  const handleAskTutorElaboration = (query: string) => {
    setActiveChatQuery(query);
    setActiveTab("chat");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-[#0A0B0D] text-slate-200 selection:bg-slate-800" : "bg-[#F4F4F1] text-slate-800 selection:bg-slate-200"}`}>
      
      {/* Sleek Top Sticky Navigation */}
      <header className={`border-b transition-colors duration-300 sticky top-0 z-50 backdrop-blur-md ${isDark ? "border-slate-800/60 bg-[#0F1013]/90" : "border-slate-200/80 bg-[#FFFFFF]/90 shadow-sm shadow-slate-200/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border transition-colors duration-300 ${isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
              <Compass size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.25em] font-bold text-slate-500 block">Learning Series</span>
                <span className={`text-[9px] font-mono select-none px-2 py-0.5 rounded-full border transition-colors duration-300 font-bold uppercase tracking-wider ${isDark ? "bg-slate-900 text-slate-400 border-slate-850" : "bg-slate-150 text-slate-600 border-slate-200"}`}>Liturgical Memorizer</span>
              </div>
              <h1 className={`text-lg font-serif font-medium tracking-tight leading-tight mt-0.5 transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                Nicene Creed Study Companion
              </h1>
            </div>
          </div>

          {/* Pill-Shaped Tab Strip Selector & Theme Switcher */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <nav className={`flex items-center p-1 rounded-full text-xs md:text-sm font-medium border transition-colors duration-300 shadow-xs ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-[#EAEAE5] border-slate-200"}`}>
              <button
                onClick={() => setActiveTab("deck")}
                id="tab-flashcards"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "deck"
                    ? "bg-[#D4C9B4] text-slate-950 font-semibold shadow-xs"
                    : isDark ? "text-slate-400 hover:text-slate-100" : "text-slate-650 hover:text-slate-900"
                }`}
              >
                <Layers size={13} />
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => setActiveTab("quiz")}
                id="tab-reciter"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-[#D4C9B4] text-slate-950 font-semibold shadow-xs"
                    : isDark ? "text-slate-400 hover:text-slate-100" : "text-slate-650 hover:text-slate-900"
                }`}
              >
                <Award size={13} />
                <span>Reciter Tool</span>
              </button>
              <button
                onClick={() => setActiveTab("guide")}
                id="tab-guide"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "guide"
                    ? "bg-[#D4C9B4] text-slate-950 font-semibold shadow-xs"
                    : isDark ? "text-slate-400 hover:text-slate-100" : "text-slate-650 hover:text-slate-900"
                }`}
              >
                <BookOpen size={13} />
                <span>Structure Guide</span>
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                id="tab-companion"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-[#D4C9B4] text-slate-950 font-semibold shadow-xs"
                    : isDark ? "text-slate-400 hover:text-slate-100" : "text-slate-650 hover:text-slate-900"
                }`}
              >
                <MessageSquare size={13} />
                <span>AI Tutor</span>
              </button>
            </nav>

            {/* Dark & Light Theme Switcher */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              id="theme-toggle-btn"
              className={`p-2 rounded-full border transition-colors duration-300 shadow-xs cursor-pointer flex items-center justify-center ${isDark ? "bg-[#131418] border-slate-800/80 text-slate-400 hover:text-slate-100 hover:border-slate-700" : "bg-[#EAEAE5] border-slate-205 text-slate-600 hover:text-slate-900 hover:bg-[#DED9D1]"}`}
              aria-label="Toggle theme color"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">

        {/* Minimalist Dashboard Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border rounded-3xl relative overflow-hidden transition-colors duration-300 shadow-xs ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-200/90 shadow-sm shadow-slate-100/50"}`}>
          
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest block font-bold">Study Progress</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl md:text-3xl font-serif font-semibold italic transition-colors ${isDark ? "text-slate-100" : "text-slate-900"}`}>{completionPercentage}%</span>
              <span className="text-[10px] text-slate-500 font-mono">accomplished</span>
            </div>
            {/* Fine Light Progress Bar */}
            <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? "bg-[#1C1D24]" : "bg-slate-100"}`}>
              <div 
                className="bg-[#D4C9B4] h-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest block font-bold">Mastered Cards</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl md:text-3xl font-serif font-semibold italic transition-colors ${isDark ? "text-slate-100" : "text-slate-900"}`}>{masteredCount}</span>
              <span className="text-[10px] text-slate-500 font-mono">out of 13</span>
            </div>
            <p className={`text-[11px] leading-none ${isDark ? "text-slate-400" : "text-slate-600"}`}>Scores above 90% accuracy</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest block font-bold">In Learning State</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl md:text-3xl font-serif font-semibold italic transition-colors ${isDark ? "text-slate-100" : "text-slate-900"}`}>{learningCount}</span>
              <span className="text-[10px] text-slate-500 font-mono">active cards</span>
            </div>
            <p className={`text-[11px] leading-none ${isDark ? "text-slate-400" : "text-slate-600"}`}>Currently being reinforced</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest block font-bold">Practiced</span>
              <button
                onClick={handleResetAllProgress}
                className="text-[9px] text-red-500 hover:text-red-400 font-mono hover:underline uppercase tracking-wider bg-transparent outline-none cursor-pointer"
              >
                Reset stats
              </button>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl md:text-3xl font-serif font-semibold italic transition-colors ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {progressList.filter(p => p.attemptsCount > 0).length}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">reviewed</span>
            </div>
            <p className={`text-[11px] leading-none ${isDark ? "text-slate-400" : "text-slate-600"}`}>Total self-reported card trials</p>
          </div>

        </div>

        {/* Tab display */}
        <div className="transition-all duration-300">
          {activeTab === "deck" && (
            <div className="animate-fadeIn">
              <FlashcardDeck
                progressList={progressList}
                onUpdateProgress={handleUpdateProgress}
                isDark={isDark}
              />
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="animate-fadeIn">
              <QuizRecital
                progressList={progressList}
                onUpdateProgressScore={handleUpdateProgressScore}
                isDark={isDark}
              />
            </div>
          )}

          {activeTab === "guide" && (
            <div className="animate-fadeIn">
              <MainStudyGuide
                onAskTutor={handleAskTutorElaboration}
                isDark={isDark}
              />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="animate-fadeIn">
              <AITutorChat
                initialQuery={activeChatQuery}
                clearInitialQuery={() => setActiveChatQuery(null)}
                isDark={isDark}
              />
            </div>
          )}
        </div>

      </main>

      {/* Liturgical Editorial Footnote */}
      <footer className={`border-t transition-colors duration-300 py-12 mt-16 text-center text-xs ${isDark ? "border-slate-900 bg-[#0B0C0E] text-slate-500" : "border-slate-205 bg-[#EAEAE5] text-slate-600"}`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className={`font-serif italic max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-700"}`}>
            "The Nicene Creed (formulated in Nicaea, 325 AD, and Constantinople, 381 AD) remains the ecumenical standard of faith across traditional liturgies."
          </p>
          <p className="font-mono text-[9px] text-[#D4C9B4] dark:text-[#D4C9B4]/80 uppercase tracking-[0.25em] pt-4">
            Peace be with you on your study journey.
          </p>
        </div>
      </footer>

    </div>
  );
}
