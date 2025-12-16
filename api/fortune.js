// api/fortune.js
import { GoogleGenerativeAI } from "@google/generative-ai";
// 确保你的 constants 文件路径正确，如果是 .ts 文件，Vercel 有时也能解析，
// 但如果报错找不到模块，建议把常量直接复制到这个文件里来。
import { SYSTEM_PROMPT_TEMPLATE, PLAN_REQUIREMENTS } from '../constants';

export default async function handler(req, res) {
  // 1. 安全检查：只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. 解析数据
    const { userData, plan } = req.body;
    
    // 3. 获取 API Key
    // 兼容两种写法：API_KEY 或 GOOGLE_API_KEY
    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Server API Key not configured");
    }

    // 4. 初始化 Google Gemini (使用稳定版 SDK)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 5. 选择模型
    // 建议使用 gemini-1.5-pro，它比 2.5-flash 更稳定且适合算命
    // 如果你坚持要用 flash，可以填 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-pro-preview",
        // Pro 模型不需要 thinkingConfig，加上会报错，所以这里去掉了
        generationConfig: {
            temperature: 0.7,
        }
    });

    // 6. 构造提示词 (保留你原来的优秀逻辑)
    let prompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{{name}}', userData.name)
      .replace('{{gender}}', userData.gender)
      .replace('{{birth_date}}', userData.birthDate)
      .replace('{{birth_time}}', userData.birthTime)
      .replace('{{birth_place}}', userData.birthPlace);

    // 获取对应的计划要求
    // 注意：JS 中不需要 'as keyof typeof...' 这种 TS 类型断言
    let requirements = PLAN_REQUIREMENTS[plan];
    
    // 处理自定义问题
    if (plan === 'PREMIUM' && userData.customQuestion) {
       requirements = requirements.replace('{{custom_question}}', userData.customQuestion);
    } else {
       requirements = requirements.replace('{{custom_question}}', '無');
    }

    prompt = prompt.replace('{{plan_requirements}}', requirements);

    // 7. 调用 API
    console.log("正在请求 Gemini..."); // 加个日志方便调试
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 8. 返回结果
    res.status(200).json({ result: text });

  } catch (error) {
    console.error("API Error:", error);
    // 返回更详细的错误信息以便排查
    res.status(500).json({ error: 'Fate calculation failed', details: error.message });
  }
}
