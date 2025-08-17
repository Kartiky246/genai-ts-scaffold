import { measureMemory } from "vm";
import GeminiInstance, { GeminiModel } from "./config/gemini/gemini.config.js";
import {PromptRole } from "./types/prompt.types.js";
import { buildSystemPrompt, COT_STEPS } from "./utils/prompts/cot.helper..js";
import { PromptMessage } from "./types/prompt.types.js";
import { json } from "stream/consumers";


// zero shot prompting
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

// main()

/// cot example //
const travelDestinationSuggestion = async function(messages: PromptMessage[]){

    while(true){
        const client = await GeminiInstance.chatCompletions({
            model: GeminiModel.GEMINI_2_5_FLASH,
            messages: messages,
            response_format: { type: "json_object" }
        })
        const rawContent = client.choices[0].message.content!;
        messages.push({
            role: PromptRole.ASSISTANT,
            content: rawContent,
        })

        const parsedContent = JSON.parse(rawContent);

        if(parsedContent.step === COT_STEPS.START){
            console.log(`🚀 ${parsedContent.content}`)
        }
        if(parsedContent.step === COT_STEPS.THINK){
            console.log(`🧠 ${parsedContent.content}`)
        }

        if(parsedContent.step === COT_STEPS.EVALUATE){
            console.log(`📝 ${parsedContent.content}`)
        }

        if(parsedContent.step === COT_STEPS.OUTPUT){
            console.log(`➡️ ${parsedContent.content}`);
            break;
        }
    }
}


const getUserInput = (query: string): PromptMessage =>{
    return {
        role: PromptRole.USER,
        content: query,
    }
}

travelDestinationSuggestion([
    buildSystemPrompt({
        description: 'You are a travel agent that help in making travel plans',
        steps: [COT_STEPS.START, COT_STEPS.THINK, COT_STEPS.EVALUATE, COT_STEPS.OUTPUT],
    }),
     getUserInput('How to go to paris, France from rewari, India')
    ])