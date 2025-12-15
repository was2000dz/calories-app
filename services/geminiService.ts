import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodWithAI = async (description: string): Promise<AIAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the nutritional content of the following food description. Estimate the calories and macronutrients (protein, carbs, fat) for the specified portion size. If no portion is specified, assume a standard serving.
      
      Food description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "A short, concise name for the food item (e.g., 'Grilled Chicken Breast', 'Oatmeal with Berries').",
            },
            calories: {
              type: Type.NUMBER,
              description: "Total calories (kcal).",
            },
            protein: {
              type: Type.NUMBER,
              description: "Protein in grams.",
            },
            carbs: {
              type: Type.NUMBER,
              description: "Carbohydrates in grams.",
            },
            fat: {
              type: Type.NUMBER,
              description: "Fat in grams.",
            },
          },
          required: ["name", "calories", "protein", "carbs", "fat"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    throw error;
  }
};