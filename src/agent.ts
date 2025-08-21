import { measureMemory } from "vm";
import { PromptRole } from "./types/prompt.types.js";
import { buildSystemPrompt, COT_STEPS } from "./utils/prompts/cot.helper..js";
import { PromptMessage } from "./types/prompt.types.js";
import { exec } from "child_process";
import OpenAiInstance, { OpenAiModel } from "./config/openAi/openAi.config.js";

/// Agent example  //

async function executeCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Execution failed: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error output: ${stderr}`);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

const runAgent = async function (messages: PromptMessage[]) {
  while (true) {
    const client = await OpenAiInstance.chatCompletions({
      model: OpenAiModel.GPT_4O_1_MINI,
      messages: messages,
      response_format: { type: "json_object" },
    });

    const rawOutput = client.choices[0].message.content!;
    const parsedOutput = JSON.parse(rawOutput);

    if (parsedOutput.step === COT_STEPS.START) {
      console.log(`🚀 ${parsedOutput.content}`);
    }
    if (parsedOutput.step === COT_STEPS.THINK) {
      console.log(`🧠 ${parsedOutput.content}`);
    }
    if (parsedOutput.step === COT_STEPS.TOOL_ANALYZE) {
      console.log(`🤔 ${parsedOutput.content}`);
    }

    if (parsedOutput.step === COT_STEPS.TOOL_CALL) {
      try {
        const res = await executeCommand(parsedOutput.input);
        messages.push({
          role: PromptRole.ASSISTANT,
          content: JSON.stringify({
            step: COT_STEPS.OBSERVE,
            content: res || "Command execution is completed !",
          }),
        });
      } catch (error) {
        messages.push({
          role: PromptRole.ASSISTANT,
          content: JSON.stringify({
            step: COT_STEPS.OBSERVE,
            content: `Command execution failed because of error: ${error}`,
          }),
        });
      }
      continue;
    }

    if (parsedOutput.step === COT_STEPS.OUTPUT) {
      console.log(`➡️ ${parsedOutput.content}`);
      break;
    }

    messages.push({
      role: PromptRole.ASSISTANT,
      content: rawOutput,
    });
  }
};

const getUserInput = (query: string): PromptMessage => {
  return {
    role: PromptRole.USER,
    content: query,
  };
};

runAgent([
  buildSystemPrompt({
    description:
      "You are a software engineer who develops applications in HTML, CSS and Javascript",
    steps: [
      COT_STEPS.START,
      COT_STEPS.THINK,
      COT_STEPS.TOOL_ANALYZE,
      COT_STEPS.TOOL_CALL,
      COT_STEPS.OBSERVE,
      COT_STEPS.OUTPUT,
    ],
    tools: [
      {
        name: "executeCommand",
        description:
          "Takes a linux/unix command as string input and executes the command on user's machine and returns the output. Can be used to create code files. IMPORTANT: Always return commands as plain strings without markdown, quotes, or escape sequences.",
      },
    ],
  }),
  getUserInput("Create a functional TODO application. Create Separate HTML, CSS and JS file"),
]);
