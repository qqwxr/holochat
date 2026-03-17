# HoloChat风格聊天网站

一个基于HoloChat AI的聊天网站，专为亲朋好友设计。采用简洁的HoloChat风格界面，后端代理保护API密钥，通过Vercel免费部署。

## ✨ 功能特性

- 🎨 **HoloChat风格界面** - 简洁现代的聊天界面，响应式设计
- 🔒 **API密钥安全** - 后端代理保护，前端不暴露密钥
- 🌐 **Vercel部署** - 免费托管，全球CDN加速
- 💾 **本地存储** - 对话历史自动保存到浏览器
- ⚙️ **可配置设置** - 模型参数、主题、密码保护等
- 📱 **移动端友好** - 适配手机和平板设备

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/deepseek-chat-website.git
cd deepseek-chat-website
```

### 2. 环境配置

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

2. 在 `.env.local` 中设置你的DeepSeek API密钥：
   ```
   DEEPSEEK_API_KEY=你的_api_密钥
   ```

3. 安装依赖：
   ```bash
   npm install
   ```

### 3. 本地开发

```bash
npm run dev
```
访问 http://localhost:3000 查看效果。

### 4. 部署到Vercel

#### 方法一：Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### 方法二：Vercel Web界面
1. 将项目推送到GitHub仓库
2. 访问 [vercel.com](https://vercel.com)
3. 导入GitHub仓库
4. 在环境变量设置中添加 `DEEPSEEK_API_KEY`
5. 点击部署

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | **必需** DeepSeek API密钥 | 无 |
| `SITE_PASSWORD` | 可选密码保护 | 无 |
| `ALLOWED_ORIGINS` | CORS允许的来源 | `*` |
| `DEFAULT_MODEL` | 默认模型 | `deepseek-chat` |
| `DEFAULT_MAX_TOKENS` | 默认最大tokens | `1000` |
| `DEFAULT_TEMPERATURE` | 默认温度参数 | `0.7` |

### 项目结构

```
deepseek-chat-website/
├── public/                    # 静态文件
│   ├── index.html            # 主页面
│   ├── style.css             # 样式文件
│   ├── script.js             # 前端逻辑
│   └── assets/               # 静态资源
├── api/                      # Vercel Serverless Functions
│   ├── chat.js              # 主要聊天API端点
│   ├── verify.js            # 密码验证端点（可选）
│   └── health.js            # 健康检查端点
├── vercel.json              # Vercel配置
├── package.json             # Node.js依赖
├── .env.example             # 环境变量示例
├── .gitignore               # Git忽略文件
└── README.md               # 本文档
```

## 📖 使用指南

### 基本使用

1. 访问网站后，在输入框中输入消息
2. 按 `Enter` 发送消息，`Shift+Enter` 换行
3. 查看AI回复，对话历史自动保存
4. 点击侧边栏的"新对话"开始新的聊天

### 高级功能

- **对话历史**：侧边栏显示所有历史对话，点击可切换
- **设置面板**：点击右下角设置按钮调整参数
- **暗色模式**：在设置中切换亮色/暗色主题
- **密码保护**：在环境变量中设置 `SITE_PASSWORD` 启用

## 🔒 安全说明

### API密钥保护

- **零前端暴露**：API密钥仅存储在Vercel环境变量中
- **后端代理**：所有请求通过 `/api/chat` 端点转发
- **CORS限制**：可配置允许的来源域名

### 密码保护（可选）

在 `.env.local` 中设置：
```
SITE_PASSWORD=your_password
```
启用后，首次访问需要输入密码。

### 请求限制

- 内置基础频率限制
- 可配置API使用量监控
- 建议在生产环境添加更严格的限制

## 💰 成本估算

### Vercel Hobby计划（免费）
- 每月100GB带宽
- 每月1000小时Serverless Functions运行时间
- 自动HTTPS/SSL证书

### DeepSeek API成本
- 按实际使用量计费（tokens数量）
- 个人使用成本极低（约$0.001/1000 tokens）
- 可在DeepSeek控制台设置使用量限制

## 🛠️ 开发指南

### 前端修改
- `public/index.html` - 页面结构
- `public/style.css` - 样式设计
- `public/script.js` - 交互逻辑

### 后端修改
- `api/chat.js` - 主要聊天API逻辑
- `api/verify.js` - 密码验证逻辑
- `api/health.js` - 健康检查端点

### 本地测试API

```bash
# 测试聊天API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，介绍一下你自己"}'
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供强大的AI API
- [Vercel](https://vercel.com) - 提供优秀的部署平台
- [Font Awesome](https://fontawesome.com) - 提供图标
- [Google Fonts](https://fonts.google.com) - 提供字体

## 📞 支持

如有问题，请：
1. 查看 [常见问题](#)
2. 提交 [GitHub Issue](https://github.com/yourusername/deepseek-chat-website/issues)
3. 联系维护者

---

**注意**：本项目仅供个人学习和亲友使用，请遵守DeepSeek API的使用条款。