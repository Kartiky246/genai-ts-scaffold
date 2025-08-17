import GeminiInstance, { GeminiModel } from "./config/gemini/gemini.config.js";
import {PromptRole } from "./types/prompt.types.js";

const main = async function(){
    const client = await GeminiInstance.chatCompletions({
        model: GeminiModel.GEMINI_2_5_FLASH,
        messages: [{
            role: PromptRole.USER,
            content: 'Hello'
        }]

    })
      console.log(client.choices[0]?.message);

}

main()