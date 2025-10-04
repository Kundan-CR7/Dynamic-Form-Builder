import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";


// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3000;


console.log("API Key being used:", process.env.OPENROUTER_API_KEY);

app.use(cors());
app.use(express.json());

// Initialize OpenAI (OpenRouter)
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "AI Dynamic Form Builder",
  },
});

// Initialize Prisma Client
const prisma = new PrismaClient();

// -------------------- Generate Schema --------------------
app.post("/api/generate-schema", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const systemPrompt = `
      You are an expert JSON Schema generator. Your sole purpose is to convert a user's natural language description of a form into a valid JSON Schema (Draft 7) and a corresponding uiSchema for react-jsonschema-form.
      **RULES:**
      1.  **OUTPUT ONLY JSON.** Do NOT include any explanatory text.
      2.  The root JSON object MUST have two keys: "schema" and "uiSchema".
      3.  Infer field types and formats (e.g., "email", "date"). Use enums for multiple-choice options.
      4.  Populate the uiSchema with placeholders and hints.
      5.  Identify required fields and add them to the "required" array.
    `;

    const completion = await openrouter.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate schema for this form: "${description}"` },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const generatedJson = JSON.parse(completion.choices[0].message.content);

    // Save generated form schema in database
    const savedForm = await prisma.form.create({
      data: {
        title: description,
        schema: generatedJson.schema,
        uiSchema: generatedJson.uiSchema,
      },
    });

    return res.status(200).json({ id: savedForm.id, ...generatedJson });
  } catch (error) {
    console.error("Error generating schema:", error);
    return res.status(500).json({ error: "Failed to generate form schema." });
  }
});

// -------------------- Save Response --------------------
app.post("/api/save-response", async (req, res) => {
  try {
    const { formId, formData } = req.body;

    if (!formId || !formData) {
      return res.status(400).json({ error: "formId and formData are required" });
    }

    const savedResponse = await prisma.response.create({
      data: {
        formId: formId,
        data: formData,
      },
    });

    return res.status(200).json({ message: "Response saved successfully!", responseId: savedResponse.id });
  } catch (error) {
    console.error("Error saving response:", error);
    return res.status(500).json({ error: "Failed to save response." });
  }
});

// -------------------- Fetch Form with Responses --------------------
app.get("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const formWithResponses = await prisma.form.findUnique({
      where: { id },
      include: { responses: true },
    });

    if (!formWithResponses) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json(formWithResponses);
  } catch (error) {
    console.error("Error fetching form:", error);
    return res.status(500).json({ error: "Failed to fetch form." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
