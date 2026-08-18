export type PhaseId = 1 | 2 | 3 | 4;

export interface Card {
  id: number;
  phaseId: PhaseId;
  phaseLabel: string;
  themeTitle: string; // e.g. "Identity & Origin", "Incarnation"
  cue: string;
  response: string;
  note?: string; // Additional info or context
  imageThemeHint?: string; // To supply background stylistic vibes in visualizer
}

export type MasteryStatus = 'Not Started' | 'Struggling' | 'Learning' | 'Mastered';

export interface CardProgress {
  cardId: number;
  status: MasteryStatus;
  attemptsCount: number;
  lastAttemptScore?: number;
  notes?: string;
  lastPracticedDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TermExplanation {
  term: string;
  definition: string;
  theology: string;
}
