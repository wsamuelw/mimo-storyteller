# 🎙️ MiMo Storyteller

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-magenta.svg)](https://wsamuelw.github.io/mimo-storyteller/)

粘贴故事文本，分配角色声音，聆听 AI 朗读，支持卡拉 OK 逐字高亮。基于 MiMo-V2.5-TTS API 构建——无需后端，无需构建。

[English](README.md) | **简体中文** | [繁體中文](README-zh-TW.md)

---

## 快速开始

1. 在浏览器中打开 `index.html`（或访问[在线演示](https://wsamuelw.github.io/mimo-storyteller/)）
2. 点击 ⚙️ 设置，粘贴你的 MiMo API 密钥
3. 写一个故事（或点击 ✨ 用 AI 生成）
4. 在角色卡片中为每个角色分配声音
5. 点击生成，聆听故事

## 工作原理

MiMo Storyteller 使用小米的 [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) API 将文本转换为多角色音频旁白：

- **文本分段**自动识别 `角色名：对白` 和 `"对白"` 格式中的角色
- **声音设计**让你用自然语言描述任意声音（如"温暖的中年男声"）
- **并行 TTS 生成**同时为所有段落创建音频
- **卡拉 OK 高亮**在播放时逐字显示文本

## 功能特性

### 核心功能
- **3 种文本分段模式** — 自动识别 `角色名：对白` 和 `"对白"` 格式中的角色
- **24 个预设声音** — 一键分配声音，支持 3 语言标签（默认显示 12 个，可展开查看更多）
- **声音设计** — 输入自然语言描述自定义声音
- **声音预览** — 每个角色卡片上的 ▶ 按钮，生成前即可试听
- **AI 故事生成** — 输入提示词 → LLM 生成故事 → 自动分段 → 分配声音 → TTS 合成
- **方言与唱歌** — 在文本前添加 `(粤语)` 或 `(唱歌)` 即可切换声音模式
- **失败段落重试** — 仅重新生成失败的段落

### 播放功能
- **并行生成** — 同时生成 3 个段落（速度提升 3 倍）
- **顺序播放** — 按顺序播放所有段落，自动处理间隔
- **卡拉 OK 高亮** — 播放时逐字高亮显示文本
- **精简顶栏** — 播放/暂停 + 进度 + 时间，始终可见
- **下拉菜单** — 语速、音量、上一段/下一段、下载全部、分享（⋯ 按钮）

### 用户体验
- **3 语言支持** — 简体中文、繁體中文、English
- **通知提示** — 可关闭，错误提示需点击才会消失
- **步骤引导** — ① 文本 → ② 角色 → ③ 故事朗读器
- **设置弹窗** — API 密钥、端点、自定义 URL、代理（带焦点陷阱）
- **API 密钥切换** — 眼睛图标显示/隐藏密码
- **清空确认** — 清空所有内容前弹出警告
- **声音预设标签** — 角色卡片中显示已选声音
- **折叠段落列表** — 显示包含角色数量的摘要标签，按需展开

### 移动端
- **44px 触控目标** — 所有交互元素均符合 Apple/Google 指南
- **响应式布局** — 移动端单列，桌面端多列
- **安全区域适配** — 弹窗底部适配 iPhone 底部横条

### 无障碍
- **焦点陷阱** — 弹窗捕获 Tab/Shift+Tab，关闭时恢复焦点
- **ARIA 标签** — 所有表单输入、按钮和动态内容均有标注
- **aria-live 区域** — 进度、段落数量、故事状态实时通知屏幕阅读器
- **prefers-reduced-motion** — 为选择减少动画的用户禁用所有动画
- **键盘导航** — 所有交互元素均可通过键盘访问

---

## 代码结构

```
├── index.html          # 应用结构
├── style.css           # 霓虹毛玻璃设计系统
├── app.js              # 核心逻辑（分段、TTS、播放）
├── i18n.js             # 3 语言翻译（约 148 个键值对）
└── API.md              # API 集成详情
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
| togglePlayPause | 播放/暂停及图标切换 |
| playAll/stopAll | 顺序播放，自动处理间隔 |
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
| I18N 对象 | 3 个语言键（zh-CN、zh-TW、en），每个包含约 148 个键值对 |
| t() 函数 | 翻译查找，带回退机制 |
| setLang() | 更新 DOM、`document.title`、`document.documentElement.lang` |
| data-i18n | 切换语言时自动翻译文本内容 |
| data-i18n-aria | 切换语言时自动翻译 aria-label 属性 |
| data-i18n-placeholder | 切换语言时自动翻译 placeholder 属性 |

### 文本分段 — 3 种模式

```
模式 1: 角色名：对白     → 说话人 = 角色名
模式 2: "对白"           → 说话人 = 上一个说话人
模式 3: 其他内容          → 旁白
```

**场景标记**（`【第三章】`、`---`、`***`）会被跳过。

---

## 声音预设

24 个内置声音预设，分为 3 类，支持 3 种语言：

- **旁白类** — 旁白、说书人、新闻主播、神秘、耳语
- **角色类** — 年轻男性/女性、儿童、英雄、反派、温柔、热血
- **动漫类** — 傲娇、病娇、大姐姐、冰山、千金、妩媚、性感、女王

完整描述请查看 [`i18n.js`](i18n.js)。

---

## 部署

### GitHub Pages
1. 推送到 GitHub 仓库
2. 前往 **Settings → Pages → Deploy from branch**（main）
3. 应用将在 `https://username.github.io/repo-name` 上线

### 环境要求
- **无需构建** — 纯 HTML/CSS/JS
- **无需服务器** — 完全在浏览器中运行
- **无依赖** — 零 npm 包
- **API 密钥** — 存储在每个用户的 localStorage 中（按域名隔离）

---

## 浏览器兼容性

支持 Chrome 66+、Firefox 57+、Safari 12.1+ 和 Edge 79+。不支持 IE11。

---

## 安全说明

- **API 密钥**以明文存储在 `localStorage` 中（按域名隔离）
- **XSS 防护**通过 `escapeHtml()` 处理所有用户输入
- **CORS** — MiMo API 返回 `Access-Control-Allow-Origin: *`
- **无追踪** — 零数据分析、零 Cookie、零外部服务
- 漏洞报告请查看 [SECURITY.md](SECURITY.md)

---

## 已知限制

1. **文本分段** — 仅支持 `角色名：对白` 和 `"对白"` 格式。引号内夹杂旁白的复杂对话可能导致说话人分配错误。
2. **音频格式** — 仅输出 WAV，无 MP3/OGG 压缩格式。
3. **段落数量上限** — 无硬性限制，但 50 个以上段落需要数分钟生成。
4. **LLM 提示词** — 故事生成提示词为中文，英文故事质量可能较低。

---

## 参与贡献

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解开发环境、代码规范和 PR 流程。

请查看 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解社区准则。

---

## 许可证

MIT — 自由使用，无需署名。详见 [LICENSE](LICENSE)。

---

## 致谢

- [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) — 小米语音合成 API
- [Outfit](https://fonts.google.com/specimen/Outfit) — UI 字体
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) — 中文字体
