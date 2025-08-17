import { PromptRole } from "../../types/prompt.types";

export type Example = {
    user: string;
    assistant: { step: string; content: string }[];
  };

  export enum COT_STEPS {
    START = 'START',
    THINK ='THINK',
    EVALUATE = 'EVALUATE',
    OUTPUT = 'OUTPUT'
  }
  
  export interface SystemPromptInput {
    description: string;
    steps: COT_STEPS[];
    outputFormat?: Record<COT_STEPS, {content: string}>;
    rules?: string[];
    examples?: Example[];
  }

const defaultExamples: Example[] = [
    {
      user: "Can you solve 3 + 4 * 10 - 4 * 3",
      assistant: [
        { step: "START", content: "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" },
        { step: "THINK", content: "This is typical math problem where we use BODMAS formula for calculation" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "Lets breakdown the problem step by step" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "As per bodmas, first lets solve all multiplications and divisions" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "So, first we need to solve 4 * 10 that is 40" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "Great, now the equation looks like 3 + 40 - 4 * 3" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "Now, I can see one more multiplication to be done that is 4 * 3 = 12" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "Great, now the equation looks like 3 + 40 - 12" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "As we have done all multiplications lets do the add and subtract" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "so, 3 + 40 = 43" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "new equations look like 43 - 12 which is 31" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "THINK", content: "great, all steps are done and final result is 31" },
        { step: "EVALUATE", content: "Alright, Going good" },
        { step: "OUTPUT", content: "3 + 4 * 10 - 4 * 3 = 31" }
      ]
    }
  ];

const defaultRules: string[] = [
    "Strictly follow the output JSON format.",
    "Always follow the sequence: START, THINK, EVALUATE, then OUTPUT.",
    "After every THINK step, an EVALUATE step is performed manually; wait for it before proceeding.",
    "Perform only one step at a time and wait for the next step.",
    "Make multiple THINK steps before producing the final OUTPUT."
  ];
  
  
  
  export function buildSystemPrompt(input: SystemPromptInput): {role: PromptRole.SYSTEM, content: string} {
    const { description, steps } = input;
    
    const examples = input.examples ?? defaultExamples;

    const rules = input.rules ?? defaultRules;

    const outputFormat = input.outputFormat ?? {
      "step": "START | THINK | EVALUATE | OUTPUT",
      "content": "string"
    };
    

  
    const stepsSection = steps.length
      ? `Steps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`
      : "";
  
    const rulesSection = rules.length
      ? `Rules:\n${rules.map((r) => `- ${r}`).join("\n")}\n`
      : "";
  
    const outputFormatSection = Object.keys(outputFormat).length
      ? `Output JSON Format:\n${JSON.stringify(outputFormat, null, 2)}\n`
      : "";
  
    const examplesSection = examples.length
      ? `Examples:\n${examples
          .map(
            (ex, idx) =>
              `Example ${idx + 1}:\nUser: ${ex.user}\n${ex.assistant
                .map(
                  (a) =>
                    `ASSISTANT: ${JSON.stringify(
                      { step: a.step, content: a.content },
                      null,
                      0
                    )}`
                )
                .join("\n")}`
          )
          .join("\n\n")}`
      : "";
  
    return {
      role: PromptRole.SYSTEM,
      content: 
      `  
          You are an AI assistant.
          Description:
          ${description}   
          ${stepsSection}
          ${rulesSection}
          ${outputFormatSection}
          ${examplesSection}
    `.trim(),
    }
  }