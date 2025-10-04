import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

console.log(import.meta.env.VITE_API_URL)

export default function FormBuilder() {
  const [description, setDescription] = useState("");
  const [formSchema, setFormSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a description for the form.");
      return;
    }
    setIsLoading(true);
    setError("");
    setFormSchema(null);
    setFormSubmitted(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-schema`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something went wrong on the server."
        );
      }

      const data = await response.json();
      setFormSchema(data.schema || {});
      setUiSchema(data.uiSchema || {});
    } catch (err) {
      console.error(err);
      setError(`Failed to generate form: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async ({ formData }) => {
    console.log("Submitting form data:", formData);
    try {
      await fetch(`${API_BASE_URL}/api/save-response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          formTitle: formSchema?.title || "Untitled Form",
        }),
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error("Failed to submit form:", err);
      setError("There was an error submitting your response.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          1. Describe your form in plain English
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., A registration form for a hackathon with fields for name, email, GitHub URL, and T-shirt size (S, M, L, XL)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isLoading ? "🧠 Generating..." : "✨ Generate Form"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-8 border-t pt-8">
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          2. Preview your generated form
        </h2>
        {isLoading && (
          <div className="text-center p-8">
            <p className="text-gray-500">The AI is building your form...</p>
          </div>
        )}

        {formSchema && !isLoading && (
          <div className="p-4 border rounded-md bg-gray-50">
            {formSubmitted ? (
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-green-600">
                  ✅ Thank You!
                </h3>
                <p className="text-gray-600 mt-2">
                  Your response has been submitted successfully.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <Form
                schema={formSchema}
                uiSchema={uiSchema}
                validator={validator}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
