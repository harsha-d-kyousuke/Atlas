
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatMessage, AnalysisResult, ChartDataPoint } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: 'You are ATLAS, an AI-driven Cognitive Workspace Intelligence Platform. Your goal is to help users understand enterprise data, detect insights, and suggest automated actions. Be concise, professional, and helpful. You can generate insights from mock data if asked.',
  },
});

export const streamChatResponse = async (
  history: ChatMessage[], 
  newMessage: string,
  onChunk: (chunk: string) => void
) => {
  try {
    // Note: The current Gemini SDK chat doesn't directly take history. 
    // For a stateful conversation, we rely on the `chat` instance created above.
    // To implement a true history, you would rebuild context on each call if not using the stateful chat object.
    const responseStream = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error streaming chat response:", error);
    onChunk("Sorry, I encountered an error. Please check the console for details.");
  }
};

export const analyzeDataSource = async (fileName: string): Promise<AnalysisResult | null> => {
    try {
        const prompt = `You are ATLAS, an AI-driven Cognitive Workspace Intelligence Platform.
        Analyze the dataset named "${fileName}". 
        The content of the file is mocked for this exercise. Assume it contains relevant business data.
        Based on the file name, generate a plausible analysis.
        For example, if the name is 'Q3_Sales_EMEA.csv', assume it contains sales data for the EMEA region in Q3 and generate insights about sales performance.
        If the name is 'Customer_Feedback_Sept.json', assume it contains customer feedback and generate insights about sentiment or common issues.
        
        Provide the following:
        1. A brief summary of the dataset's likely contents.
        2. Three distinct, actionable insights with a title, a short summary, a severity level ('High', 'Medium', or 'Low'), and a brief 'explanation' for why this insight was generated.
        3. Two potential correlations discovered within the data.
        4. Two suggested automation actions based on the insights.

        Respond ONLY with a valid JSON object that adheres to the provided schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        insights: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    summary: { type: Type.STRING },
                                    severity: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                                    explanation: { type: Type.STRING },
                                },
                                required: ['title', 'summary', 'severity', 'explanation'],
                            },
                        },
                        correlations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    description: { type: Type.STRING },
                                },
                                required: ['description'],
                            },
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                },
                                required: ['title', 'description'],
                            },
                        },
                    },
                    required: ['summary', 'insights', 'correlations', 'suggestions'],
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing data source:", error);
        return null;
    }
};


export const forecastSalesData = async (currentData: ChartDataPoint[]): Promise<Omit<ChartDataPoint, 'isForecast'>[] | null> => {
    try {
        const lastMonth = currentData[currentData.length - 1]?.name;
        const prompt = `You are a data scientist. Given the following monthly sales data JSON: ${JSON.stringify(
            currentData.map(d => ({ month: d.name, sales: d.value }))
        )}. 
        The trend ends at ${lastMonth}. Predict the sales figures for the next 3 consecutive months, continuing the observed trend.
        Respond ONLY with a valid JSON array of objects, with each object having a "name" (the month) and a "value" (the predicted sales number) key.
        Example response format: [{"name": "Oct", "value": 700}, {"name": "Nov", "value": 750}, {"name": "Dec", "value": 800}]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                        },
                        required: ["name", "value"],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error forecasting sales data:", error);
        return null;
    }
};
