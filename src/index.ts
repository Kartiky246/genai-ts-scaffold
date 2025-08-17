import GeminiClient, { GeminiModel } from "./config/gemini/gemini.config.js";
import {PromptRole } from "./types/prompt.types.js";

const main = async function(){
    const client = await GeminiClient.chat.completions.create({
        model: GeminiModel.GEMINI_2_5_FLASH,
        messages: [{
            role: PromptRole.USER,
            content: 'Hello'
        }]

    })
      console.log(client.choices[0]?.message);

}

main()