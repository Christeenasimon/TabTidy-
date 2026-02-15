
import { GoogleGenAI, Type } from "@google/genai";
import { Tab, TabCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartTabGrouping = async (tabs: Tab[]): Promise<Record<string, TabCategory>> => {
  if (!process.env.API_KEY) return {};

  const prompt = `Categorize the following browser tabs into exactly one of these categories: Study, Shopping, Social, Research, or Uncategorized. Return a JSON object where keys are tab IDs and values are categories.
  
  Tabs: ${tabs.map(t => `ID: ${t.id}, Title: ${t.title}, URL: ${t.url}`).join('\n')}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          description: "Categorization result",
          properties: tabs.reduce((acc, tab) => ({
            ...acc,
            [tab.id]: { type: Type.STRING, description: "The category of the tab" }
          }), {})
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Grouping failed:", error);
    return {};
  }
};

export const getTabSummary = async (tabs: Tab[]): Promise<string> => {
  if (!process.env.API_KEY) return "No summary available.";

  const prompt = `Summarize these ${tabs.length} tabs in exactly 3 short, calming lines. Focus on common themes or important takeaways.
  
  Tabs: ${tabs.map(t => t.title).join(', ')}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Summary failed to generate.";
  } catch (error) {
    console.error("AI Summary failed:", error);
    return "Something went wrong with the AI.";
  }
};
