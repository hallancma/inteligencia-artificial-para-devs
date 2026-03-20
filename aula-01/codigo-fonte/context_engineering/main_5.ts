import "dotenv/config";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { tools } from "./tools";
import { initLogFile, logStep } from "./logger";

async function main() {
  const prompt = process.argv.slice(2).join(" ");
  if (!prompt) {
    console.log("Usage: npx ts-node main_4.ts <your prompt>");
    process.exit(1);
  }
  initLogFile();

  const ollama = createOpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
  });

  const { text } = await generateText({
    model: ollama.chat("qwen3-vl:2b"),
    prompt,
    stopWhen: stepCountIs(5),
    tools,
    onStepFinish: logStep,
  });
  console.log(text);
}

main();
