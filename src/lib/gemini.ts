import { GoogleGenAI, Type } from "@google/genai";
import { BILL_CATEGORIES } from "@/features/bills/constants/categories";

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const validCategories = BILL_CATEGORIES.map((c) => c.id);

export const geminiService = {
  /**
   * Extracts bill information from an uploaded receipt image using Gemini 2.5 Flash.
   */
  extractReceiptData: async (base64Image: string, mimeType: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          "Extract the receipt details. Determine a short title (like 'Grocery Run' or the store name), the total amount charged, and pick the single most appropriate category from the allowed list.",
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "A short, descriptive title for the expense based on the merchant or items.",
              },
              amount: {
                type: Type.NUMBER,
                description: "The total amount charged on the receipt.",
              },
              category: {
                type: Type.STRING,
                description: `The best matching category from this list: ${validCategories.join(", ")}`,
              },
            },
            required: ["title", "amount", "category"],
          },
          temperature: 0.1, // Low temperature for factual extraction
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("No response from Gemini");
    } catch (error) {
      console.error("Gemini Receipt Extraction Error:", error);
      throw error;
    }
  },

  /**
   * Extracts bill information from a natural language voice transcript.
   */
  extractVoiceData: async (transcript: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          `Parse this spoken sentence into a structured expense: "${transcript}"`,
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "A short, descriptive title for the expense (e.g. 'Dinner', 'Movie Tickets').",
              },
              amount: {
                type: Type.NUMBER,
                description: "The total numerical amount spent.",
              },
              category: {
                type: Type.STRING,
                description: `The best matching category from this list: ${validCategories.join(", ")}`,
              },
              participants: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "A list of people's names who were involved in this expense.",
              },
            },
            required: ["title", "amount", "category", "participants"],
          },
          temperature: 0.1,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("No response from Gemini");
    } catch (error) {
      console.error("Gemini Voice Extraction Error:", error);
      throw error;
    }
  },
};
