// api/fortune.js
// 采用 "无依赖" 方案，直接用原生 fetch 调用 HiAPI

// 1. 将常量直接定义在这里，防止 import 路径报错 (最稳妥的做法)
const SYSTEM_PROMPT_TEMPLATE = `你是一位精通易经、紫微斗数和西方占星学的命理大师。
用户资料：{{name}}, {{gender}}, 生日: {{birth_date}}。
用户购买等级：{{plan_requirements}}。
用户问题：{{custom_question}}。
请输出一份详尽的运势分析报告，语气要神秘、权威、富有哲理。`;

const PLAN_REQUIREMENTS = {
    BASIC: "基础版分析：包含流年运势和性格分析，约300字。",
    PREMIUM: "高级详批：包含未来10年大运、事业财运深度分析、风水建议，约800字。"
};

export default async function handler(req, res) {
  // 2. 安全检查
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3. 解析数据
    const { userData, plan } = req.body;
    
    // 4. 获取 API Key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Server Config Error: API_KEY is missing");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 5. 构造提示词
    let prompt = SYSTEM_PROMPT_TEMPLATE
      .replace('{{name}}', userData.name || '缘主')
      .replace('{{gender}}', userData.gender || '未知')
      .replace('{{birth_date}}', userData.birthDate || '未知')
      .replace('{{birth_time}}', userData.birthTime || '')
      .replace('{{birth_place}}', userData.birthPlace || '');

    // 容错处理：确保 planKey 存在
    const planKey = (plan || 'BASIC').toUpperCase();
    let requirements = PLAN_REQUIREMENTS[planKey] || PLAN_REQUIREMENTS.BASIC;
    
    // 处理自定义问题
    if (planKey === 'PREMIUM' && userData.customQuestion) {
       requirements = requirements.replace('{{custom_question}}', userData.customQuestion);
    } else {
       requirements = requirements.replace('{{custom_question}}', '无');
    }

    prompt = prompt.replace('{{plan_requirements}}', requirements);

    // 6. 关键步骤：调用 HiAPI (OpenAI 兼容接口)
    console.log("正在连接 HiAPI...");

    const response = await fetch("https://hiapi.online/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // 确保 API_KEY 是 sk- 开头的 HiAPI Key
      },
      body: JSON.stringify({
        // 👇 建议先用 1.5-pro，这是目前中转商支持最好的模型
        model: "gemini-3-pro-preview", 
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        stream: false
      })
    });

    // 7. 处理异常
    if (!response.ok) {
        const errorText = await response.text();
        console.error("HiAPI 报错:", errorText);
        throw new Error(`Upstream API Error: ${response.status}`);
    }

    // 8. 解析结果
    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
        throw new Error("API 返回内容为空");
    }

    // 9. 成功返回
    res.status(200).json({ result: resultText });

  } catch (error) {
    console.error("Final Handler Error:", error);
    res.status(500).json({ error: 'Fate calculation failed', details: error.message });
  }
}
