# 🎙️ MiMo Storyteller

粘贴故事文本，分配角色声音，聆听 AI 朗读。基于 MiMo-V2.5-TTS API 构建，完全托管在 GitHub Pages 上——无需任何后端服务。

---

## 什么是 MiMo-V2.5-TTS？

[MiMo-V2.5-TTS](https://platform.xiaomimimo.com) 是小米的文字转语音 API，支持以下模型：

| 模型 | 用途 |
|------|------|
| `mimo-v2.5-tts-voicedesign` | 通过文字描述自定义声音（如"温暖的女声"） |
| `mimo-v2.5-tts` | 预设声音 + 方言/唱歌标签 |
| `mimo-v2.5-pro` | 用于 AI 故事生成的大语言模型 |

**核心特性：**
- **声音设计** — 用自然语言描述任意声音，API 即可生成
- **方言支持** — `(粤语)`、`(东北话)`、`(四川话)` 等
- **唱歌模式** — `(唱歌)` 标签切换为唱歌模式
- **CORS 已启用** — `Access-Control-Allow-Origin: *`，无需代理

**API 端点：**

| 端点 | 基础 URL |
|------|----------|
| 标准 / 按量计费 | `https://api.xiaomimimo.com` |
| Token 套餐（中国大陆） | `https://token-plan-cn.xiaomimimo.com` |
| Token 套餐（新加坡） | `https://token-plan-sgp.xiaomimimo.com` |

**认证格式：** 需要同时发送 `Authorization: Bearer <key>` 和 `api-key: <key>` 两个请求头。

---

## 功能特性

### 核心功能
- **3 种文本分段模式** — 自动识别 `角色名：对白` 和 `"对白"` 格式中的角色
- **24 个预设声音** — 一键分配声音，支持 3 语言标签（默认显示 8 个，可展开查看更多）
- **声音设计** — 输入自然语言描述自定义声音
- **AI 故事生成** — 输入提示词 → LLM 生成故事 → 自动分段 → 分配声音 → TTS 合成。无论提示词语言如何，均以所选语言输出。使用 `角色名：对白` 格式确保可靠自动分段
- **方言与唱歌** — 在文本前添加 `(粤语)` 或 `(唱歌)` 即可切换声音模式
- **失败段落重试** — 仅重新生成失败的段落，无需全部重来

### 播放功能
- **声音预览** — 每个角色卡片上的 ▶ 按钮，生成前即可试听
- **并行生成** — 同时生成 3 个段落（速度提升 3 倍）
- **顺序播放** — 按顺序播放所有段落，自动处理间隔
- **卡拉 OK 高亮** — 播放时逐字高亮显示文本
- **精简顶栏** — 播放/暂停 + 进度 + 时间，始终可见
- **下拉菜单** — 语速、音量、上一段/下一段、下载全部、分享（⋯ 按钮）
- **指数退避重试** — API 失败时最多重试 3 次（1s → 2s → 4s）
- **错误提示** — 段落失败时进度条变红

### 用户体验
- **3 语言支持** — 简体中文、繁體中文、English
- **通知提示** — 可关闭，错误提示需点击才会消失
- **步骤引导** — ① 文本 → ② 角色 → ③ 故事朗读器
- **设置弹窗** — API 密钥、端点、自定义 URL、代理（带焦点陷阱）
- **API 密钥切换** — 眼睛图标显示/隐藏密码
- **清空确认** — 清空所有内容前弹出警告
- **覆盖提示** — 替换已有文本前弹出警告
- **空状态提示** — 内容为空时显示占位提示信息
- **角色选中高亮** — 选中角色卡片时显示青色光晕
- **声音预设标签** — 角色卡片中显示已选声音
- **语言感知预设** — 切换语言时声音描述自动翻译
- **格式说明** — 持续显示的辅助文本（不藏在输入框 placeholder 里）
- **防抖设置** — URL 输入在停止输入 500ms 后才保存
- **折叠段落列表** — 显示包含角色数量的摘要标签，按需展开
- **故事朗读器区域** — 专用区域，包含卡拉 OK 文字显示和精简播放器

### 移动端
- **44px 触控目标** — 所有交互元素均符合 Apple/Google 指南
- **响应式布局** — 移动端单列，桌面端多列
- **文本换行** — 移动端段落文本自动换行而非截断
- **安全区域适配** — 弹窗底部适配 iPhone 底部横条
- **禁用动画** — 移动端停止背景渐变动画以提升性能

### 无障碍
- **焦点陷阱** — 弹窗捕获 Tab/Shift+Tab，关闭时恢复焦点
- **ARIA 标签** — 所有表单输入、按钮和动态内容均有标注
- **aria-live 区域** — 进度、段落数量、故事状态实时通知屏幕阅读器
- **prefers-reduced-motion** — 为选择减少动画的用户禁用所有动画
- **键盘导航** — 所有交互元素均可通过键盘访问
- **语义化 HTML** — 正确的标题层级、地标区域和角色

---

## 设计系统

### 颜色变量
```css
--bg: #08081a          /* 深空背景 */
--surface: #0f0f2a     /* 卡片背景 */
--border: rgba(255,255,255,.08)  /* 细边框 */
--cyan: #00e5ff        /* 主强调色 */
--magenta: #ff2daa     /* 副强调色 */
--violet: #8b5cf6      /* 第三强调色 */
--text: #e8e8f0        /* 主要文字 */
--text-dim: #b8b7cc    /* 次要文字 */
```

### 组件
- **毛玻璃卡片** — `backdrop-filter: blur(12px)`，半透明背景
- **渐变按钮** — 带发光效果的动画渐变背景
- **霓虹强调** — 青色/洋红/紫色高亮用于交互元素
- **字体** — Outfit（UI）+ Noto Sans SC（中文）

---

## 代码结构

```
neon version/
├── index.html          # 应用结构
├── style.css           # 霓虹毛玻璃设计系统
├── app.js              # 核心逻辑（分段、TTS、播放）
├── i18n.js             # 3 语言翻译（zh-CN、zh-TW、en）
└── README.md           # 说明文档
```

### app.js — 核心逻辑

| 模块 | 用途 |
|------|------|
| State | 全局状态对象（段落、角色、音频缓冲区） |
| PRESETS | 24 个声音描述 × 3 种语言 |
| escapeHtml | innerHTML 的 XSS 防护 |
| Toast | 通知系统（错误提示需点击才消失） |
| segmentText | 3 种模式的文本分段引擎 |
| buildCharacters | 从段落中提取角色 |
| renderStep2 | 角色卡片 + 段落列表 UI |
| renderStoryReader | 卡拉 OK 式文字显示，支持角色高亮 |
| generateAll | 并行 TTS 生成，带重试机制 |
| retryFailed | 仅重新生成失败的段落 |
| callTTS | MiMo API 调用 |
| callTTSWithRetry | 指数退避重试封装 |
| togglePlayPause | 播放/暂停及图标切换 |
| playAll/pauseAll/stopAll | 顺序播放，自动处理间隔 |
| togglePlayerMenu | 语速、音量、操作的下拉菜单 |
| setPlaybackSpeed | 语速控制（0.75x–2x） |
| setVolume/toggleMute | 音量控制 |
| seekProgress | 点击进度条跳转 |
| renderSegmentsList | 折叠段落列表，显示摘要标签 |
| generateStory | 通过 MiMo LLM 生成故事 |
| openSettings/closeSettings | 设置弹窗，带焦点陷阱 |

### i18n.js — 国际化翻译

| 模块 | 用途 |
|------|------|
| I18N 对象 | 3 个语言键（zh-CN、zh-TW、en），每个包含 80+ 个键值对 |
| t() 函数 | 翻译查找，带回退机制 |
| setLang() | 更新 DOM、`document.title`、`document.documentElement.lang` |
| data-i18n | 切换语言时自动翻译文本内容 |
| data-i18n-aria | 切换语言时自动翻译 aria-label 属性 |

### 文本分段 — 3 种模式

```
模式 1: 角色名：对白     → 说话人 = 角色名
模式 2: "对白"           → 说话人 = 上一个说话人
模式 3: 其他内容          → 旁白 → 旁白
```

**场景标记**（`【第三章】`、`---`、`***`）会被跳过。

---

## 声音预设（24 个）

| 预设 | 描述 |
|------|------|
| 📖 旁白 | 沉稳温暖的中年男声 |
| 🧑 年轻男性 | 充满活力的年轻男声 |
| 👩 年轻女性 | 温柔明亮的女声 |
| 🧒 儿童 | 可爱高亢的童声 |
| 😈 反派 | 阴险威胁的男声 |
| 🦸 英雄 | 磁性有力的男声 |
| 🌸 温柔 | 温暖知性的女声 |
| 🔥 热血 | 热情洋溢的年轻男声 |
| 📺 新闻主播 | 专业精准的播音腔 |
| 📚 说书人 | 富有表现力的说书声 |
| 🌙 神秘 | 低沉沙哑的神秘嗓音 |
| 💋 妩媚 | 慵懒迷人的女声 |
| 🖤 性感 | 低沉磁性的耳语声 |
| 👑 女王 | 冷漠威严的女声 |
| 💢 傲娇 | 外冷内热的反差萌 |
| 🔪 病娇 | 甜美外表下的偏执占有欲 |
| 🌺 大姐姐 | 成熟体贴的姐姐音 |
| ❄️ 冰山 | 平淡无表情的冰山美人 |
| 💎 千金 | 高傲优雅的大小姐 |
| 💉 护士 | 温柔关怀的医护声 |
| 📋 秘书 | 干练专业的职场声 |
| 💔 前女友 | 冷漠疏远、带有怨念的声音 |
| 🥂 名媛 | 优雅的社交名媛声 |
| 🤫 耳语 | 极轻柔的私密耳语 |

---

## API 集成

### TTS 请求
```json
{
  "model": "mimo-v2.5-tts-voicedesign",
  "messages": [
    { "role": "user", "content": "Voice description here" },
    { "role": "assistant", "content": "Text to speak" }
  ],
  "audio": { "format": "wav" }
}
```

### 方言/唱歌请求
```json
{
  "model": "mimo-v2.5-tts",
  "messages": [
    { "role": "user", "content": "用自然的语气说" },
    { "role": "assistant", "content": "(粤语) Hello, how are you?" }
  ],
  "audio": { "format": "wav", "voice": "mimo_default" }
}
```

### 故事生成请求
```json
{
  "model": "mimo-v2.5-pro",
  "messages": [
    { "role": "user", "content": "Write a story about..." }
  ],
  "temperature": 0.8
}
```

---

## 部署（GitHub Pages）

### 快速部署
1. 创建 GitHub 仓库
2. 将 `neon version/` 文件夹内容复制到仓库根目录
3. 推送到 GitHub
4. 前往 **Settings → Pages → Deploy from branch**（main）
5. 应用将在 `https://username.github.io/repo-name` 上线

### 自定义域名（可选）
1. 添加包含你的域名的 `CNAME` 文件
2. 配置 DNS 指向 GitHub Pages
3. 在仓库设置中启用 HTTPS

### 环境要求
- **无需构建** — 纯 HTML/CSS/JS
- **无需服务器** — 完全在浏览器中运行
- **无依赖** — 零 npm 包
- **API 密钥** — 存储在每个用户的 localStorage 中（按域名隔离）

---

## 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 核心应用 | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| AbortController | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| fetch API | ✅ 42+ | ✅ 39+ | ✅ 10.1+ | ✅ 14+ |
| backdrop-filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |

**不支持：** IE11（已停止支持）

---

## 安全说明

- **API 密钥** 以明文存储在 `localStorage` 中（按域名隔离）
- **XSS 防护** 通过 `escapeHtml()` 处理所有用户输入
- **CORS** — MiMo API 返回 `Access-Control-Allow-Origin: *`
- **无追踪** — 零数据分析、零 Cookie、零外部服务

---

## 已知限制

1. **文本分段** — 仅支持 `角色名：对白` 和 `"对白"` 格式。引号内夹杂旁白的复杂对话可能导致说话人分配错误。
2. **声音描述** — 需手动输入或使用预设。生成前无法预览声音。
3. **音频格式** — 仅输出 WAV，无 MP3/OGG 压缩格式。
4. **段落数量上限** — 无硬性限制，但 50 个以上段落需要数分钟生成。
5. **LLM 提示词** — 故事生成提示词为中文，英文故事质量可能较低。

---

## 许可证

MIT — 自由使用，无需署名。

---

## 致谢

- [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) — 小米语音合成 API
- [Outfit](https://fonts.google.com/specimen/Outfit) — UI 字体
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) — 中文字体
