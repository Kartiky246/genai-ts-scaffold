import { PromptRole } from "../../types/prompt.types";

export type Example = {
    user: string;
    assistant: { step: string; content: string, toolName?:string, input?:string | number }[];
  };

  export enum COT_STEPS {
    START = 'START',
    THINK ='THINK',
    EVALUATE = 'EVALUATE',
    OUTPUT = 'OUTPUT',
    TOOL_CALL ='TOOL_CALL',
    OBSERVE = 'OBSERVE',
    TOOL_ANALYZE= 'TOOL_ANALYZE'
  }
  
  export interface SystemPromptInput {
    description: string;
    steps: COT_STEPS[];
    outputFormat?: Record<COT_STEPS, {content: string}>;
    rules?: string[];
    examples?: Example[];
    tools?: {name: string, description: string}[]
  }

const defaultExamples: Example[] = [
    {
      user: "Can you tell me the weather of Rewari, Haryana?",
      assistant: [
        { step: "START", content: "The user wants me to get the current weather of Rewari which is a city in Haryana" },
        { step: "THINK", content: "Lets breakdown the problem step by step" },
        { step: "THINK", content: "Here current data is required, so I need to check if any tool is available to fetch current data" },
        { step: "TOOL_ANALYZE", content: "getWeatherByCity tool is present for this task, let me check it's description to get the desired input for this tool function" },
        { step: "TOOL_CALL", toolName:'getWeatherByCity', input: 'rewari', content: 'I will call getWeatherByCity to get temperature of rewari ' },
        {step: "OBSERVE", content: "The tweather of rewari is cloudy with temo 29 Cel"},
        { step: "THINK", content: "Great, I got the weather of rewari" },
        { step: "OUTPUT", content: "The weather of rewari is cloudy and temperature is 29 Cel." }
      ]
    }
  ];

const defaultRules: string[] = [
  "Always return a valid JSON object matching the required schema.",
  "Follow the step sequence strictly: START → THINK → (optional: TOOL_ANALYZE → TOOL_CALL → OBSERVE) → OUTPUT.",
  "If no tool is required for the task, skip TOOL_ANALYZE, TOOL, and OBSERVE steps.",
  "Only perform one step per response. Do not combine multiple steps in a single output.",
  "In the TOOL step, include: 'toolName' (string), 'input' (structured parameters for the tool), and 'content' (a short natural language description of what is being done).",
  "When using a tool, always ensure inputs structure strictly match the tool’s description and examples.",
  "When using a tool, always ensure the toolName is exactly what is given in available tool section",
  "After TOOL execution, read the content of OBSERVE step carefully, if it has ERROR in it then give go to THINK step again and correct tool input",
  "Use multiple THINK steps for reasoning before producing the final OUTPUT.", 
  "OUTPUT must be concise, accurate, and based on reasoning + any tool observations."
]

  
  
  
  export function buildSystemPrompt(input: SystemPromptInput): {role: PromptRole.SYSTEM, content: string} {
    const { description, steps} = input;

    const tools = input.tools;
    
    const examples = input.examples ?? defaultExamples;

    const rules = input.rules ?? defaultRules;

    const outputFormat = input.outputFormat ?? {
      "step": "START | THINK | TOOL_ANALYZE | TOOL_CALL | OBSERVE | OUTPUT",
      "content": "string",
      "input": "string",
      "toolName": "string"
    };
    

    const toolsSection = tools?.length ?
        `You have following tools available:
        ${tools.map((v,idx)=>{
          return `${idx+1}) tool Name: ${v.name}
          tool description : ${v.description}`
        })}
        Each tool function is in camel case
        Read description of tools carefully to understand the expected input.
        Use exact tool names in your output` :''
  
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
          ${toolsSection}
          ${stepsSection}
          ${rulesSection}
          ${outputFormatSection}
          ${examplesSection}
    `.trim(),
    }
  }