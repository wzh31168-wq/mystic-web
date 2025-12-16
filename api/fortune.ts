import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT_TEMPLATE, PLAN_REQUIREMENTS } from '../constants';

export default async function handler(req: any, res: any) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Parse Data
    const { userData, plan } = req.body;
    
    // 3. Get API Key from Environment
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server API Key not configured' });
    }

    // 4. Initialize Gemini (using correct SDK @google/genai)
    const ai = new GoogleGenAI({ apiKey });

    // 5. Construct Prompt
    let prompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{{name}}', userData.name)
      .replace('{{gender}}', userData.gender)
      .replace('{{birth_date}}', userData.birthDate)
      .replace('{{birth_time}}', userData.birthTime)
      .replace('{{birth_place}}', userData.birthPlace);

    let requirements = PLAN_REQUIREMENTS[plan as keyof typeof PLAN_REQUIREMENTS];
    
    // Handle Custom Question
    if (plan === 'PREMIUM' && userData.customQuestion) {
       requirements = requirements.replace('{{custom_question}}', userData.customQuestion);
    } else {
       requirements = requirements.replace('{{custom_question}}', '無');
    }

    prompt = prompt.replace('{{plan_requirements}}', requirements);

    // 6. Call API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 },
        temperature: 0.7,
      }
    });

    // 7. Return Result
    res.status(200).json({ result: response.text });

  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'Fate calculation failed', details: error.message });
  }
}
