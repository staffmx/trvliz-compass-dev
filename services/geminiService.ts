import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini AI client
// Note: process.env.API_KEY is injected by the environment.
const apiKey = process.env.API_KEY;

// Helper to get the AI instance. Checks if key exists.
const getAI = () => {
  if (!apiKey) {
    console.warn("API Key not found. AI features will be disabled or mock.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const askTravelizAssistant = async (query: string): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return "Lo siento, no puedo conectar con el servidor de inteligencia artificial en este momento. (Falta API Key)";
  }

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

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No pude generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al procesar tu solicitud. Por favor intenta más tarde.";
  }
};
