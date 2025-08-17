import OpenAI from "openai";
import { config } from "../env.config.js";

export enum OpenAiModel {
    GPT_4O = 'gpt-4o',
    GPT_4O_MINI = 'gpt-4o-mini',
    GPT_4O_1 = 'gpt-4o-1',
    GPT_4O_1_MINI = 'gpt-4o-1-mini',
    GPT_4O_2 = 'gpt-4o-2',
    GPT_4O_2_MINI = 'gpt-4o-2-mini',
}

class OpenAiFactory{
    openAiInstance!: OpenAI;
    constructor(apiKey?: string, baseURL?: string){
        this.openAiInstance = new OpenAI({
            apiKey : apiKey ?? config.OPENAI_API_KEY,
            ...(baseURL && {baseURL})
        })
    }

    get client(): OpenAI{
        return this.openAiInstance
    }
}

export default new OpenAiFactory().client;
export { OpenAiFactory };