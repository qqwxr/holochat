// 健康检查API端点 - Vercel Serverless Function
// 用于监控服务状态和API可用性

export default async function handler(req, res) {
  // 设置CORS头
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

  // 允许GET和POST请求
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取当前时间
    const now = new Date();
    
    // 检查API密钥是否配置
    const apiKeyConfigured = !!process.env.DEEPSEEK_API_KEY;
    
    // 构建健康检查响应
    const healthInfo = {
      status: 'healthy',
      timestamp: now.toISOString(),
      service: 'HoloChat Website',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        api_key_configured: apiKeyConfigured,
        server_time: now.toISOString(),
        uptime: process.uptime(),
        memory_usage: process.memoryUsage(),
      },
      endpoints: {
        chat: '/api/chat',
        verify: '/api/verify',
        health: '/api/health'
      }
    };

    // 如果API密钥未配置，添加警告
    if (!apiKeyConfigured) {
      healthInfo.status = 'degraded';
      healthInfo.warning = 'DEEPSEEK_API_KEY环境变量未配置，聊天功能将不可用';
    }

    // 返回健康状态
    return res.status(200).json(healthInfo);

  } catch (error) {
    console.error('健康检查过程中发生错误:', error);
    
    // 返回错误状态
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: '服务器内部错误',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}