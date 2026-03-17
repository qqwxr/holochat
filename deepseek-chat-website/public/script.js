// HoloChat风格聊天网站 - 主脚本文件
// 为亲朋好友设计的AI聊天界面交互逻辑

// ========== 1. DOM元素引用 ==========
// 侧边栏元素
const newChatBtn = document.getElementById('newChatBtn');
const chatHistoryList = document.getElementById('chatHistory');
const settingsBtn = document.getElementById('settingsBtn');

// 主聊天区域元素
const currentChatTitle = document.getElementById('currentChatTitle');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const tokenCount = document.getElementById('tokenCount');

// 设置面板元素
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const apiEndpointInput = document.getElementById('apiEndpoint');
const maxTokensSelect = document.getElementById('maxTokens');
const temperatureSlider = document.getElementById('temperature');
const temperatureValue = document.getElementById('temperatureValue');
const darkModeCheckbox = document.getElementById('darkMode');
const soundEffectsCheckbox = document.getElementById('soundEffects');

// 密码保护模态框元素
const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const submitPasswordBtn = document.getElementById('submitPasswordBtn');

// 加载动画元素
const loadingOverlay = document.getElementById('loadingOverlay');

// 连接状态元素
const connectionStatus = document.querySelector('.connection-status');

// 其他UI元素
const inputActions = document.querySelectorAll('.action-btn');
const hints = document.querySelectorAll('.hint');

console.log('DOM元素加载完成');

// ========== 2. 状态变量和常量 ==========
// 当前对话状态
let currentChat = {
    id: Date.now().toString(),
    title: '新对话',
    messages: [], // 格式: { role: 'user'|'assistant', content: string, timestamp: Date }
    createdAt: new Date(),
    updatedAt: new Date()
};

// 对话历史记录
let chatHistory = [];

// 应用程序设置
const defaultSettings = {
    apiEndpoint: '/api/chat',
    maxTokens: 1000,
    temperature: 0.7,
    darkMode: true,
    soundEffects: false,
    passwordProtected: false,
    password: null
};

let settings = { ...defaultSettings };

// UI状态
let isSending = false;
let totalTokens = 0;

// 常量
const ENTER_KEY = 13;
const SHIFT_ENTER_KEY = 13; // 与ENTER相同，但需要配合shift键检测
const MAX_INPUT_HEIGHT = 200; // 文本区域最大高度（像素）
const LOCAL_STORAGE_KEYS = {
    SETTINGS: 'deepseek_chat_settings',
    CHAT_HISTORY: 'deepseek_chat_history',
    CURRENT_CHAT: 'deepseek_current_chat'
};

console.log('状态变量初始化完成');

// ========== 3. 核心功能函数 ==========
// 3.1 添加消息到UI
function addMessageToUI(role, content, timestamp = new Date()) {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;
    
    // 根据角色选择图标
    const avatarIcon = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
    const senderName = role === 'user' ? '你' : 'HoloChat';
    
    // 格式化时间戳
    const timeString = formatTimestamp(timestamp);
    
    // 构建消息HTML
    messageElement.innerHTML = `
        <div class="avatar">
            <i class="${avatarIcon}"></i>
        </div>
        <div class="content">
            <div class="sender">${senderName}</div>
            <div class="text">${escapeHtml(content)}</div>
            <div class="timestamp">${timeString}</div>
        </div>
    `;
    
    // 添加到消息容器
    messagesContainer.appendChild(messageElement);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 添加到当前对话状态
    currentChat.messages.push({
        role,
        content,
        timestamp
    });
    
    // 更新对话更新时间
    currentChat.updatedAt = new Date();
    
    // 如果消息数量 > 1 且标题还是默认的，更新标题
    if (currentChat.messages.length >= 2 && currentChat.title === '新对话') {
        const firstUserMessage = currentChat.messages.find(m => m.role === 'user');
        if (firstUserMessage) {
            const newTitle = truncateText(firstUserMessage.content, 20);
            currentChat.title = newTitle;
            currentChatTitle.textContent = newTitle;
        }
    }
    
    console.log(`消息已添加到UI: ${role} - ${content.substring(0, 30)}...`);
}

// 辅助函数：转义HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 辅助函数：格式化时间戳
function formatTimestamp(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) {
        return '刚刚';
    } else if (diffMin < 60) {
        return `${diffMin}分钟前`;
    } else if (diffHour < 24) {
        return `${diffHour}小时前`;
    } else {
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 辅助函数：截断文本
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 3.2 发送消息事件监听器
function setupMessageSending() {
    // 发送按钮点击事件
    sendBtn.addEventListener('click', handleSendMessage);
    
    // 文本区域按键事件
    messageInput.addEventListener('keydown', (e) => {
        if (e.keyCode === ENTER_KEY && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        // Shift+Enter 允许换行（默认行为）
    });
    
    // 文本区域输入事件（自动调整高度）
    messageInput.addEventListener('input', autoResizeTextarea);
    
    // 提示点击事件
    hints.forEach(hint => {
        hint.addEventListener('click', () => {
            const text = hint.textContent.replace('尝试提问："', '').replace('"', '');
            messageInput.value = text;
            autoResizeTextarea();
            messageInput.focus();
        });
    });
    
    console.log('消息发送事件监听器设置完成');
}

// 处理发送消息
async function handleSendMessage() {
    const text = messageInput.value.trim();
    
    if (!text) {
        messageInput.focus();
        return;
    }
    
    if (isSending) {
        console.log('正在发送消息，请等待...');
        return;
    }
    
    // 清空输入框
    messageInput.value = '';
    autoResizeTextarea();
    
    // 添加用户消息到UI
    addMessageToUI('user', text);
    
    // 显示加载状态
    showLoading(true);
    isSending = true;
    
    try {
        // 调用API获取回复
        const reply = await sendMessageToAPI(text);
        
        // 添加助手回复到UI
        addMessageToUI('assistant', reply);
        
        // 更新token计数
        updateTokenCount(totalTokens + estimateTokens(text) + estimateTokens(reply));
        
        // 保存当前对话
        saveCurrentChat();
        
    } catch (error) {
        console.error('发送消息失败:', error);
        // 显示错误消息
        addMessageToUI('assistant', `抱歉，出现错误：${error.message}`);
    } finally {
        // 隐藏加载状态
        showLoading(false);
        isSending = false;
    }
}

// 估计token数量（简单估算：1个token ≈ 4个英文字符或2个中文字符）
function estimateTokens(text) {
    // 简单实现：中文字符数 * 2 + 英文字符数
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars * 2 + otherChars / 4);
}

// 更新token计数显示
function updateTokenCount(tokens) {
    totalTokens = tokens;
    tokenCount.textContent = `${tokens} tokens`;
}

// 显示/隐藏加载状态
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

// 自动调整文本区域高度
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    const newHeight = Math.min(messageInput.scrollHeight, MAX_INPUT_HEIGHT);
    messageInput.style.height = newHeight + 'px';
}

// ========== 4. API通信 ==========
// 4.1 发送消息到API
async function sendMessageToAPI(message) {
    // 准备请求体
    const requestBody = {
        message: message,
        history: currentChat.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        })),
        max_tokens: parseInt(maxTokensSelect.value) || settings.maxTokens,
        temperature: parseFloat(temperatureSlider.value) / 10 || settings.temperature
    };
    
    console.log('发送API请求:', {
        endpoint: settings.apiEndpoint,
        body: { ...requestBody, historyLength: requestBody.history.length }
    });
    
    try {
        const response = await fetch(settings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API请求失败 (${response.status}): ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'API返回错误');
        }
        
        // 更新总token计数（使用API返回的实际使用量）
        if (data.usage && data.usage.total_tokens) {
            totalTokens = data.usage.total_tokens;
            tokenCount.textContent = `${totalTokens} tokens`;
        }
        
        console.log('API响应成功:', data.reply.substring(0, 50) + '...');
        return data.reply;
        
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
}

// 4.2 测试API连接
async function testAPIConnection() {
    try {
        showLoading(true);
        const response = await fetch(settings.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '测试连接', history: [] })
        });
        
        const connected = response.ok;
        updateConnectionStatus(connected);
        return connected;
    } catch (error) {
        updateConnectionStatus(false);
        return false;
    } finally {
        showLoading(false);
    }
}

// 更新连接状态显示
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.classList.remove('disconnected');
        connectionStatus.classList.add('connected');
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>已连接</span>';
    } else {
        connectionStatus.classList.remove('connected');
        connectionStatus.classList.add('disconnected');
        connectionStatus.innerHTML = '<i class="fas fa-circle"></i><span>连接失败</span>';
    }
}

// ========== 5. 历史记录管理 ==========
// 5.1 管理对话历史数组
function saveCurrentChat() {
    // 如果当前对话没有消息，不保存
    if (currentChat.messages.length === 0) return;
    
    // 检查是否已存在于历史中
    const existingIndex = chatHistory.findIndex(chat => chat.id === currentChat.id);
    
    if (existingIndex >= 0) {
        // 更新现有对话
        chatHistory[existingIndex] = { ...currentChat };
    } else {
        // 添加到历史记录
        chatHistory.unshift({ ...currentChat });
        
        // 限制历史记录数量（最多保留20个）
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(0, 20);
        }
    }
    
    // 保存到本地存储
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY, chatHistory);
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_CHAT, currentChat);
    
    // 更新侧边栏UI
    updateChatHistoryUI();
    
    console.log('对话已保存:', currentChat.title);
}

// 创建新对话
function createNewChat() {
    // 保存当前对话
    saveCurrentChat();
    
    // 重置当前对话
    currentChat = {
        id: Date.now().toString(),
        title: '新对话',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    // 更新UI
    currentChatTitle.textContent = currentChat.title;
    messagesContainer.innerHTML = '';
    
    // 添加欢迎消息
    addMessageToUI('assistant',
        '你好！我是基于HoloChat AI的聊天，专为尊贵的VIP用户设计。\n有什么问题可以随时问我，我会尽力帮助你！');
    
    // 重置token计数
    updateTokenCount(0);
    
    console.log('新对话已创建');
}

// 加载对话
function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) {
        console.error('对话未找到:', chatId);
        return;
    }
    
    // 保存当前对话
    saveCurrentChat();
    
    // 加载选中的对话
    currentChat = { ...chat };
    
    // 更新UI
    currentChatTitle.textContent = currentChat.title;
    messagesContainer.innerHTML = '';
    
    // 重新渲染所有消息
    currentChat.messages.forEach(msg => {
        addMessageToUI(msg.role, msg.content, new Date(msg.timestamp));
    });
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 更新token计数（估算）
    const totalTokens = currentChat.messages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
    updateTokenCount(totalTokens);
    
    console.log('对话已加载:', chat.title);
}

// 删除对话
function deleteChat(chatId, event) {
    if (event) event.stopPropagation();
    
    if (confirm('确定要删除这个对话吗？删除后无法恢复。')) {
        // 从历史记录中移除
        chatHistory = chatHistory.filter(chat => chat.id !== chatId);
        
        // 如果删除的是当前对话，创建新对话
        if (currentChat.id === chatId) {
            createNewChat();
        }
        
        // 保存到本地存储
        saveToLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY, chatHistory);
        
        // 更新侧边栏UI
        updateChatHistoryUI();
        
        console.log('对话已删除:', chatId);
    }
}

// 5.2 更新侧边栏历史记录UI
function updateChatHistoryUI() {
    // 清空列表
    chatHistoryList.innerHTML = '';
    
    // 如果没有历史记录，显示提示
    if (chatHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-history';
        emptyItem.innerHTML = '<i class="fas fa-history"></i> 暂无历史对话';
        chatHistoryList.appendChild(emptyItem);
        return;
    }
    
    // 添加每个历史对话项
    chatHistory.forEach(chat => {
        const listItem = document.createElement('li');
        listItem.className = `history-item ${chat.id === currentChat.id ? 'active' : ''}`;
        listItem.dataset.chatId = chat.id;
        
        // 格式化时间
        const timeStr = formatTimestamp(new Date(chat.updatedAt));
        const messageCount = chat.messages.length;
        
        listItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-title">${escapeHtml(chat.title)}</div>
                <div class="history-meta">
                    <span class="history-time">${timeStr}</span>
                    <span class="history-count">${messageCount} 条消息</span>
                </div>
            </div>
            <button class="delete-history-btn" title="删除对话">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        // 点击项加载对话
        listItem.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-history-btn')) {
                loadChat(chat.id);
            }
        });
        
        // 删除按钮事件
        const deleteBtn = listItem.querySelector('.delete-history-btn');
        deleteBtn.addEventListener('click', (e) => deleteChat(chat.id, e));
        
        chatHistoryList.appendChild(listItem);
    });
}

// ========== 6. 设置面板功能 ==========
// 6.1 显示/隐藏设置面板
function setupSettingsPanel() {
    // 打开设置面板
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('hidden');
        loadSettingsToUI();
    });
    
    // 关闭设置面板
    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
    });
    
    // 温度滑块实时更新显示
    temperatureSlider.addEventListener('input', () => {
        const value = parseFloat(temperatureSlider.value) / 10;
        temperatureValue.textContent = value.toFixed(1);
    });
    
    // 保存设置
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // 暗色模式切换
    darkModeCheckbox.addEventListener('change', toggleDarkMode);
    
    // 点击面板外部关闭
    settingsPanel.addEventListener('click', (e) => {
        if (e.target === settingsPanel) {
            settingsPanel.classList.add('hidden');
        }
    });
    
    console.log('设置面板事件监听器设置完成');
}

// 加载设置到UI
function loadSettingsToUI() {
    // 更新UI控件
    apiEndpointInput.value = settings.apiEndpoint;
    maxTokensSelect.value = settings.maxTokens;
    temperatureSlider.value = settings.temperature * 10;
    temperatureValue.textContent = settings.temperature.toFixed(1);
    darkModeCheckbox.checked = settings.darkMode;
    soundEffectsCheckbox.checked = settings.soundEffects;
    
    console.log('设置已加载到UI');
}

// 6.2 保存和加载设置
function saveSettings() {
    // 从UI获取值
    settings.apiEndpoint = apiEndpointInput.value;
    settings.maxTokens = parseInt(maxTokensSelect.value);
    settings.temperature = parseFloat(temperatureSlider.value) / 10;
    settings.darkMode = darkModeCheckbox.checked;
    settings.soundEffects = soundEffectsCheckbox.checked;
    
    // 保存到本地存储
    saveToLocalStorage(LOCAL_STORAGE_KEYS.SETTINGS, settings);
    
    // 应用设置
    applySettings();
    
    // 关闭面板
    settingsPanel.classList.add('hidden');
    
    // 显示成功消息
    alert('设置已保存！');
    
    console.log('设置已保存:', settings);
}

// 加载设置
function loadSettings() {
    const saved = loadFromLocalStorage(LOCAL_STORAGE_KEYS.SETTINGS);
    if (saved) {
        settings = { ...defaultSettings, ...saved };
    } else {
        settings = { ...defaultSettings };
    }
    
    // 应用设置
    applySettings();
    
    console.log('设置已加载:', settings);
}

// 应用设置
function applySettings() {
    // 应用暗色模式
    toggleDarkMode(settings.darkMode);
    
    // 更新UI控件
    if (loadSettingsToUI) loadSettingsToUI();
}

// 6.3 切换暗色模式
function toggleDarkMode(enable = darkModeCheckbox.checked) {
    if (enable) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // 更新设置
    settings.darkMode = enable;
    
    console.log(`暗色模式: ${enable ? '开启' : '关闭'}`);
}

// 本地存储辅助函数
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('保存到本地存储失败:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('从本地存储加载失败:', error);
        return null;
    }
}

// ========== 7. 密码保护模态框 ==========
// 8.1 密码保护模态框逻辑
function setupPasswordModal() {
    // 检查是否需要密码保护
    if (settings.passwordProtected && settings.password) {
        passwordModal.classList.remove('hidden');
    } else {
        passwordModal.classList.add('hidden');
    }
    
    // 提交密码按钮
    submitPasswordBtn.addEventListener('click', () => {
        const input = passwordInput.value.trim();
        
        if (!settings.passwordProtected || !settings.password) {
            // 如果没有设置密码，直接进入
            passwordModal.classList.add('hidden');
            return;
        }
        
        if (input === settings.password) {
            passwordModal.classList.add('hidden');
            alert('验证成功，欢迎使用！');
        } else {
            alert('密码错误，请重试！');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // 回车键提交
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitPasswordBtn.click();
        }
    });
    
    // 如果没有设置密码，点击"进入聊天"直接关闭
    if (!settings.passwordProtected || !settings.password) {
        submitPasswordBtn.addEventListener('click', () => {
            passwordModal.classList.add('hidden');
        });
    }
    
    console.log('密码保护模态框设置完成');
}

// ========== 8. 应用程序初始化 ==========
// 9.1 初始化应用程序
function initializeApp() {
    console.log('初始化HoloChat聊天应用程序...');
    
    // 加载设置
    loadSettings();
    
    // 加载历史记录
    loadChatHistory();
    
    // 加载当前对话
    loadCurrentChat();
    
    // 设置事件监听器
    setupMessageSending();
    setupSettingsPanel();
    setupPasswordModal();
    
    // 设置新对话按钮
    newChatBtn.addEventListener('click', createNewChat);
    
    // 设置操作按钮（占位符）
    inputActions.forEach(btn => {
        btn.addEventListener('click', () => {
            // 暂时只显示提示
            alert('功能开发中...');
        });
    });
    
    // 测试API连接
    testAPIConnection().then(connected => {
        if (connected) {
            console.log('API连接测试成功');
        } else {
            console.warn('API连接测试失败，请检查后端服务');
        }
    });
    
    // 初始调整文本区域高度
    autoResizeTextarea();
    
    // 隐藏加载动画（如果可见）
    showLoading(false);
    
    console.log('应用程序初始化完成');
}

// 9.2 加载保存的数据
function loadChatHistory() {
    const saved = loadFromLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
    if (saved && Array.isArray(saved)) {
        chatHistory = saved;
        updateChatHistoryUI();
        console.log(`加载了 ${chatHistory.length} 个历史对话`);
    }
}

function loadCurrentChat() {
    const saved = loadFromLocalStorage(LOCAL_STORAGE_KEYS.CURRENT_CHAT);
    if (saved) {
        currentChat = saved;
        currentChatTitle.textContent = currentChat.title;
        
        // 重新渲染消息
        messagesContainer.innerHTML = '';
        currentChat.messages.forEach(msg => {
            addMessageToUI(msg.role, msg.content, new Date(msg.timestamp));
        });
        
        // 更新token计数
        const totalTokens = currentChat.messages.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
        updateTokenCount(totalTokens);
        
        console.log('当前对话已加载:', currentChat.title);
    } else {
        // 初始欢迎消息
        addMessageToUI('assistant',
            '你好！我是基于HoloChat AI的聊天，专为尊贵的VIP用户设计。\n有什么问题可以随时问我，我会尽力帮助你！');
    }
}

// 启动应用程序
document.addEventListener('DOMContentLoaded', initializeApp);