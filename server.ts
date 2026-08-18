import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize representation of GoogleGenAI
let ai: GoogleGenAI | null = null;
function getGeminiSDK(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI features will fallback to client-side heuristics.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FALLBACK_IF_MISSING",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Explain Creed Terms or Phrases
  app.post("/api/tutor/explain", async (req, res) => {
    try {
      const { phrase, context } = req.body;
      if (!phrase) {
        return res.status(400).json({ error: "Phrase is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback response if API key is missing
        return res.json({
          explanation: `**Explanation for "${phrase}":**\n\nThis is a central concept in the Nicene Creed. (To obtain deeper theological and historical insights from the AI Tutor, please configure a valid \`GEMINI_API_KEY\` in your Secrets platform settings).`
        });
      }

      const sdk = getGeminiSDK();
      const response = await sdk.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Explain the theological significance, historical background, and specific terminology (e.g., Greek origins if applicable) of this phrase from the Nicene Creed: "${phrase}". Context: ${context || "General Creed confession"}. Keep the response structured, clear, and readable with Markdown.`,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Error in /api/tutor/explain:", error);
      res.status(500).json({ error: error.message || "Failed to generate explanation." });
    }
  });

  // API 2: Evaluate Practice
  app.post("/api/tutor/evaluate", async (req, res) => {
    try {
      const { cue, correctText, userText } = req.body;
      if (!userText) {
        return res.status(400).json({ error: "User text is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback assessment if API key is missing
        const similarity = compareHeuristically(correctText || "", userText);
        return res.json({
          score: Math.round(similarity * 100),
          feedback: `Your attempt: "${userText}" matches approximately ${Math.round(similarity * 100)}% of the correct text. (Configure \`GEMINI_API_KEY\` for rich and precise word-level feedback and memorization guidance).`,
          matches: [],
          missing: []
        });
      }

      const sdk = getGeminiSDK();
      const response = await sdk.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an encouraging and precise Catholic/Orthodox Liturgical Memorization Coach. 
Analyse the student's attempt to recite a line of the Nicene Creed.

Prompt cue were: "${cue}"
The correct exact liturgical line is: "${correctText}"
The student's recall attempt was: "${userText}"

Construct a structured assessment comparing the attempt to the correct exact text. Give a percentage score of correctness (0 to 100) based on alignment, word choice, and order (ignoring simple capitalization and small punctuation differences, but noting theological omissions or crucial words). Providing structured, friendly feedback.
You must return the response strictly in JSON format matching the schema provided.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: {
                type: Type.INTEGER,
                description: "Accuracy score from 0 to 100"
              },
              feedback: {
                type: Type.STRING,
                description: "Encouraging verbal feedback explaining any errors made, missing central terms, or celebrating high accuracy."
              },
              matchedPhrases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of key words or phrases they successfully remembered."
              },
              missingPhrases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Major parts or terms they left out or got wrong."
              }
            },
            required: ["score", "feedback"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Error in /api/tutor/evaluate:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate response." });
    }
  });

  // API 3: General Tutor Chat
  app.post("/api/tutor/chat", async (req, res) => {
    try {
      const { messages } = req.body; // array of {role, content}
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: "Peace be with you! I am your Nicene Creed Companion. To enable real-time replies and interactive theological queries, please provide a valid `GEMINI_API_KEY` in the Secrets panel."
        });
      }

      const sdk = getGeminiSDK();
      // Compile messages into contents structure
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const response = await sdk.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are a warm, wise, and holy academic and pastoral companion named 'Creed Companion'. Your goal is to guide the user in learning, memorizing, and understanding the depth of the Nicene Creed. You support Roman Catholic, Eastern Orthodox, and classical Protestant historical texts, recognizing slight differences in translation (like the Filioque 'and the Son' in the West versus East, or capitalization) with absolute historical clarity, respect, and ecumenical charity. Help the user memorize perfectly, explain theological words simply, and provide historic context."
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/tutor/chat:", error);
      res.status(500).json({ error: error.message || "Failed to chat." });
    }
  });

  // Serve Vite or static assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support React Routing fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Simple heuristic fallback comparison function
function compareHeuristically(correct: string, user: string): number {
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
}

startServer();
