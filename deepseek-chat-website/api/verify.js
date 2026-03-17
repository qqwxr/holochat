// 密码验证API端点 - Vercel Serverless Function
// 可选功能：为网站添加简单密码保护

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

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量获取配置的密码
    const configuredPassword = process.env.SITE_PASSWORD;
    
    // 如果没有配置密码，直接通过验证
    if (!configuredPassword || configuredPassword.trim() === '') {
      return res.status(200).json({
        success: true,
        valid: true,
        message: '密码保护未启用，自动通过验证'
      });
    }

    // 获取请求体中的密码
    const { password } = req.body;
    
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        message: '请输入密码'
      });
    }

    // 验证密码
    const isValid = password === configuredPassword;
    
    if (isValid) {
      // 密码正确
      return res.status(200).json({
        success: true,
        valid: true,
        message: '密码验证成功'
      });
    } else {
      // 密码错误
      return res.status(401).json({
        success: false,
        valid: false,
        message: '密码错误'
      });
    }

  } catch (error) {
    console.error('密码验证过程中发生错误:', error);
    
    return res.status(500).json({
      success: false,
      valid: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
}