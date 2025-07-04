require("dotenv").config();
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  console.log("🔁 main() started");

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "what is 2+2?"
      }
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0,
    max_completion_tokens: 100,
    top_p: 1,
    stream: true,
  });

  console.log("📥 Streaming response...");

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }

  console.log("\n✅ Done streaming.");
}

main().catch((err) => console.error("❌ Error in main():", err));
