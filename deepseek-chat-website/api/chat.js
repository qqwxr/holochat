// HoloChat聊天API端点 - Vercel Serverless Function
// 安全代理前端请求到HoloChat API，保护API密钥

export default async function handler(req, res) {
  // 设置CORS头，允许来自前端的请求
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量获取API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY环境变量未设置');
      return res.status(500).json({ 
        error: '服务器配置错误',
        message: 'API密钥未配置'
      });
    }

    // 验证请求体
    const { message, history = [], max_tokens = 1000, temperature = 0.7 } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: '无效请求',
        message: '消息内容不能为空'
      });
    }

    // 构建对话历史
    const messages = [];
    
    // 如果有历史记录，转换为HoloChat API格式
    if (history.length > 0) {
      history.forEach(item => {
        if (item.role && item.content) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      });
    }
    
    // 添加用户当前消息
    messages.push({
      role: 'user',
      content: message
    });

    // 调用HoloChat API
    const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        stream: false
      })
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('HoloChat API错误:', deepseekResponse.status, errorText);
      
      let errorMessage = 'AI服务暂时不可用';
      if (deepseekResponse.status === 401) {
        errorMessage = 'API密钥无效';
      } else if (deepseekResponse.status === 429) {
        errorMessage = '请求过于频繁，请稍后再试';
      } else if (deepseekResponse.status >= 500) {
        errorMessage = 'AI服务内部错误';
      }
      
      return res.status(deepseekResponse.status).json({
        error: 'AI服务错误',
        message: errorMessage,
        details: errorText.substring(0, 200)
      });
    }

    const data = await deepseekResponse.json();
    
    // 提取回复内容
    const reply = data.choices?.[0]?.message?.content || '抱歉，我没有收到回复。';
    const usage = data.usage || {};
    
    // 返回成功响应
    return res.status(200).json({
      success: true,
      reply: reply,
      usage: {
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: usage.total_tokens || 0
      },
      model: data.model || 'deepseek-chat',
      id: data.id || Date.now().toString()
    });

  } catch (error) {
    console.error('处理请求时发生错误:', error);
    
    return res.status(500).json({
      error: '内部服务器错误',
      message: '处理您的请求时出现问题',
      details: error.message
    });
  }
}