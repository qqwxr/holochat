# 项目目录结构详细说明

## 完整目录树

```
deepseek-chat-website/          # 项目根目录
├── public/                    # 静态文件（Vercel自动服务）
│   ├── index.html            # 主页面
│   ├── style.css             # 样式文件
│   ├── script.js             # 前端逻辑
│   └── assets/               # 静态资源
│       ├── favicon.ico       # 网站图标
│       ├── logo.png          # 网站Logo
│       └── loading.gif       # 加载动画
├── api/                      # Vercel Serverless Functions
│   ├── chat.js              # 聊天API端点
│   ├── verify.js            # 密码验证端点（可选）
│   └── health.js            # 健康检查端点
├── vercel.json              # Vercel配置文件
├── package.json             # Node.js依赖管理
├── .env.example             # 环境变量示例
├── .gitignore               # Git忽略文件
└── README.md               # 项目说明文档
```

## 目录创建步骤

### 手动创建命令（在终端中执行）

```bash
# 1. 创建项目根目录
mkdir deepseek-chat-website
cd deepseek-chat-website

# 2. 创建公共目录和文件
mkdir public
mkdir public/assets
touch public/index.html
touch public/style.css
touch public/script.js

# 3. 创建API目录
mkdir api
touch api/chat.js
touch api/verify.js
touch api/health.js

# 4. 创建配置文件
touch vercel.json
touch package.json
touch .env.example
touch .gitignore
touch README.md
```

### 或者使用单个命令

```bash
mkdir -p deepseek-chat-website/public/assets && \
mkdir -p deepseek-chat-website/api && \
cd deepseek-chat-website && \
touch public/index.html public/style.css public/script.js && \
touch api/chat.js api/verify.js api/health.js && \
touch vercel.json package.json .env.example .gitignore README.md
```

## 文件内容模板

### 1. package.json（基础版本）
```json
{
  "name": "deepseek-chat-website",
  "version": "1.0.0",
  "description": "A DeepSeek-style chat website for friends and family",
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "node-fetch": "^2.6.7"
  },
  "devDependencies": {
    "vercel": "^28.0.0"
  },
  "engines": {
    "node": ">=18.x"
  }
}
```

### 2. .gitignore
```
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db
```

### 3. .env.example
```
# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optional: Simple password protection
SITE_PASSWORD=your_password_here

# Optional: CORS allowed origins
ALLOWED_ORIGINS=https://your-domain.com,http://localhost:3000
```

### 4. vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/public/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 目录结构说明

### public/ 目录
- **index.html**: 主HTML文件，包含聊天界面
- **style.css**: 样式表，实现DeepSeek风格界面
- **script.js**: 前端JavaScript逻辑，处理用户交互和API调用
- **assets/**: 存放图片、图标等静态资源

### api/ 目录
- **chat.js**: 核心API端点，接收用户消息并调用DeepSeek API
- **verify.js**: 可选的身份验证端点，提供简单密码保护
- **health.js**: 健康检查端点，用于监控服务状态

### 配置文件
- **vercel.json**: Vercel平台配置，包括路由规则和HTTP头
- **package.json**: Node.js项目配置和依赖管理
- **.env.example**: 环境变量模板，不包含真实密钥
- **README.md**: 项目说明和部署指南

## 下一步操作

1. 按照上述目录结构创建文件和文件夹
2. 填充各个文件的基本内容
3. 进入下一阶段：设计前端界面

**注意**: 所有API密钥和敏感信息必须存储在Vercel环境变量中，而不是代码文件中。