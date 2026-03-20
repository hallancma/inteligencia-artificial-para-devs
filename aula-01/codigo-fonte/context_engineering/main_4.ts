import "dotenv/config";
import * as readline from "readline";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, stepCountIs } from "ai";
import { tools } from "./tools";
import { initLogFile, logStep } from "./logger";

type Message = { role: "user" | "assistant" | "system"; content: string };
const messages: Message[] = [];

async function chat(openrouter: ReturnType<typeof createOpenRouter>, userMessage: string) {
  messages.push({ role: "user", content: userMessage });

  const { text, response } = await generateText({
    model: openrouter(process.env.OPENROUTER_MODEL!),
    messages,
    stopWhen: stepCountIs(5),
    onStepFinish: logStep,
  });

  messages.push({ role: "assistant", content: text });

  return text;
}

async function main() {
  if (!process.env.OPENROUTER_MODEL) {
    throw new Error("OPENROUTER_MODEL not set in .env");
  }
  initLogFile();

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("CLI started. Type your message (Ctrl+C to exit)\n");

  const prompt = () => {
    rl.question("You: ", async (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        prompt();
        return;
      }

      try {
        const response = await chat(openrouter, trimmed);
        console.log(`\nAssistant: ${response}\n`);
      } catch (error) {
        console.error("Error:", error);
      }

      prompt();
    });
  };

  prompt();
}

main();
