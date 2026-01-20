
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Service to interact with Gemini AI for the Traveliz Assistant.
 * Uses gemini-3-flash-preview for general Q&A and assistant tasks.
 */
export const askTravelizAssistant = async (query: string): Promise<string> => {
  // Always initialize with process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const systemInstruction = `
      Eres 'Compass AI', el asistente virtual inteligente de la intranet corporativa 'Traveliz Compass'.
      Tu trabajo es ayudar a los empleados de la agencia de viajes Traveliz.
      
      Información de contexto sobre Traveliz:
      - Somos una agencia líder en viajes corporativos y de placer.
      - La intranet tiene secciones de Avisos, Documentación, Directorio y Capacitación.
      - Si te preguntan sobre políticas de vacaciones: "Se deben solicitar con 2 semanas de anticipación en el módulo de RH."
      - Si te preguntan sobre viáticos: "Los viáticos se reportan los días 25 de cada mes."
      
      Responde de manera breve, profesional y amable. Usa formato Markdown si es necesario.
      Idioma: Español.
    `;

    // Using gemini-3-flash-preview for basic text tasks/Q&A.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // response.text is a property, not a method.
    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al procesar tu solicitud. Por favor intenta más tarde.";
  }
};
