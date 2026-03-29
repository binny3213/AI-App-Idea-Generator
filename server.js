import express from "express";
import OpenAI, { APIError } from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// port
const port = process.env.PORT || 3000;

// Validate OpenAI key before attempting to instantiate
if (!process.env.OPENAI_API_KEY) {
  console.error(
    "❌ OPENAI_API_KEY is missing. Set it in .env or environment variables.",
  );
  process.exit(1);
}

// authenticate with OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Pass incoming data
app.use(express.json());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// routes

// For platforms like Render (health checks)
app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

// Route: Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Route: Generate app idea
app.post("/generate", async (req, res) => {
  try {
    // Extract the custom prompt from the request body
    const { customPrompt } = req.body;
    // validations
    if (!customPrompt || !customPrompt.trim()) {
      // return 400
      return res.status(400).json({
        success: false,
        error: "Please provide a prompt",
      });
    }
    // Build the complete prompt by adding structure instructions to user's input
    const prompt = `
        ${customPrompt}
        please provide a comprehensive app idea with a following structure:
        1. App name(creative and catchy)
        2. One-line Description
        3. Target Audience
        4. Core Features(list 3-5 key features)
        5. Unique Value Proposition
        6. Monetization Strategy
        7. Technology Stack Suggestions
        Format the response in a clear, structured way.
        `;
    // call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a creative product manager and entrepreneur who generates innovative, practical, and unique app ideas.
                 Your ideas are well-thought-out and consider market viability. Always provide detailed, structured response.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    });
    const idea = response.choices?.[0]?.message?.content;
    if (!idea) {
      return res.status(502).json({
        success: false,
        error: "The model returned an empty reply. Try again in a moment.",
      });
    }
    res.json({
      success: true,
      idea,
    });
  } catch (err) {
    console.error("[/generate]", err);

    let httpStatus = 500;
    let message = err?.message || "Something went wrong";

    if (err instanceof APIError && err.status) {
      httpStatus = err.status;
      if (err.status === 401) {
        message =
          "Invalid OpenAI API key. Set OPENAI_API_KEY in .env locally, or in your host’s environment variables.";
      } else if (err.status === 429) {
        message =
          "OpenAI quota or rate limit exceeded. Add billing or credits at https://platform.openai.com/account/billing , then try again.";
      } else if (err.status === 402) {
        message =
          "OpenAI billing issue (for example, no payment method or insufficient balance). Check https://platform.openai.com/account/billing";
      }
    }

    if (httpStatus < 400 || httpStatus >= 600) {
      httpStatus = 500;
    }

    return res.status(httpStatus).json({
      success: false,
      error: message,
    });
  }
});

// start the server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
