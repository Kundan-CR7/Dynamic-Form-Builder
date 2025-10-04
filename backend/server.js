import express from "express";
import cors from "cors";
import "dotenv/config"; // Loads .env file
import OpenAI from "openai";




// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

console.log("API Key being used:", process.env.OPENROUTER_API_KEY);

// --- OpenRouter Client Configuration ---
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", // Your frontend URL
    "X-Title": "AI Dynamic Form Builder",
  },
});

// --- API Routes ---

/**
 * Route to generate a form schema from a description.
 */
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
        {
          role: "user",
          content: `Generate schema for this form: "${description}"`,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const generatedJson = JSON.parse(completion.choices[0].message.content);
    return res.status(200).json(generatedJson);
  } catch (error) {
    console.error("Error generating schema:", error);
    return res.status(500).json({ error: "Failed to generate form schema." });
  }
});

/**
 * Route to save a form response.
 */
app.post("/api/save-response", async (req, res) => {
  try {
    const { formData, formTitle } = req.body;
    console.log(`Received submission for form: ${formTitle}`);
    console.log("Form Data:", formData);

    // --- TODO: Add your Supabase database logic here ---

    return res.status(200).json({ message: "Response saved successfully!" });
  } catch (error) {
    console.error("Error saving response:", error);
    return res.status(500).json({ error: "Failed to save response." });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
