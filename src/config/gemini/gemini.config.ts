import 'dotenv/config';
import { OpenAiFactory } from '../openAi/openAi.config.js';
import OpenAI from 'openai';
import { config } from '../env.config.js';

export enum GeminiModel {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_5_PRO_PLUS = 'gemini-2.5-pro-plus',
  GEMINI_2_5_PRO_PLUS_1 = 'gemini-2.5-pro-plus-1',
  GEMINI_2_5_PRO_PLUS_2 = 'gemini-2.5-pro-plus-2',
}

class GeminiFactory extends OpenAiFactory {
  geminiInstance: OpenAI;
  constructor() {
    super(config.GEMINI_API_KEY, config.GEMINI_BASE_URL);
    this.geminiInstance = new OpenAI({ apiKey: config.GEMINI_API_KEY });
  }
}

export default new GeminiFactory().client;
