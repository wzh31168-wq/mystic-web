import { UserData, PlanLevel } from '../types';

export const generateFortune = async (
  userData: UserData, 
  plan: PlanLevel
): Promise<string> => {
  try {
    // Call the serverless function instead of direct API call
    const response = await fetch('/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userData,
        plan
      })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.result || "大師正在閉關，請稍後再試。";
    
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("天機難測，請檢查網絡連接或稍後再試。");
  }
};
