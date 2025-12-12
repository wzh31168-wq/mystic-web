import { GoogleGenAI } from "@google/genai";
import { UserData, PlanLevel } from '../types';
import { SYSTEM_PROMPT_TEMPLATE, PLAN_REQUIREMENTS } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFortune = async (
  userData: UserData, 
  plan: PlanLevel
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct the prompt
    let prompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{{name}}', userData.name)
      .replace('{{gender}}', userData.gender)
      .replace('{{birth_date}}', userData.birthDate)
      .replace('{{birth_time}}', userData.birthTime)
      .replace('{{birth_place}}', userData.birthPlace);

    // Inject plan specific requirements
    let requirements = PLAN_REQUIREMENTS[plan];
    
    if (plan === PlanLevel.PREMIUM && userData.customQuestion) {
       requirements = requirements.replace('{{custom_question}}', userData.customQuestion);
    } else {
       requirements = requirements.replace('{{custom_question}}', '無');
    }

    prompt = prompt.replace('{{plan_requirements}}', requirements);

    // Use gemini-2.5-flash for faster response or gemini-3-pro-preview for deep reasoning
    // Using 2.5 Flash with thinking budget for a balance of speed and "thoughtfulness"
    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Give it some time to "think" like a master
        temperature: 0.7, // Creativity balanced with structure
      }
    });

    return response.text || "大師正在閉關，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("天機難測，請檢查網絡連接或稍後再試。");
  }
};