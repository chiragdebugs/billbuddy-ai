import { geminiService } from "@/lib/gemini";

export interface ParsedBill {
  title: string;
  amount: number;
  category: string;
  participants: string[];
}

export const voiceParserService = {
  /**
   * Uses Gemini AI to parse the voice input.
   */
  parseVoiceInput: async (transcript: string): Promise<ParsedBill> => {
    return await geminiService.extractVoiceData(transcript);
  }
};
