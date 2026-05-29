# 🎙️ 有声书片段生成器

把文字变成多角色有声书，使用 [MiMo-V2.5-TTS](https://mimo.xiaomi.com) 语音合成 API。

## 功能

- 📝 粘贴文本，自动识别「」和 "" 对话与旁白
- 🎭 为每个角色设计声音（Voice Design），8 种快速预设
- 🎵 一键生成全部音频
- 🎧 在线试听，支持连续播放
- 💾 单段或批量下载 WAV 音频
- 🔑 API Key 保存在浏览器 localStorage，不上传任何服务器

## 使用方法

1. 双击打开 `index.html`
2. 选择 API 端点（Token Plan 用户选国际版或中国版）
3. 输入 MiMo API Key → 点「保存」
4. 粘贴小说/故事文本
5. 点「✨ 智能分段」
6. 为每个角色编辑声音描述（或展开预设快速选择）
7. 点「🎵 生成全部音频」
8. 试听并下载

## API 端点

| 端点 | 地址 | 适用人群 |
|------|------|----------|
| 标准版 | `api.xiaomimimo.com` | 普通用户 |
| Token Plan 中国 | `token-plan-cn.xiaomimimo.com` | 国内 Token Plan |
| Token Plan 国际版 | `token-plan-sgp.xiaomimimo.com` | 海外 / Claude Code 用户 |

也支持自定义 Base URL 和代理地址（解决 CORS）。

## 本地运行

无需安装任何依赖，直接打开即可：

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

## 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "init: audiobook generator"
git remote add origin https://github.com/YOUR_USER/audiobook-generator.git
git push -u origin main
```

然后在仓库 Settings → Pages → Source 选择 `main` 分支。

## CORS 说明

浏览器直接调用 MiMo API 可能被 CORS 阻止。如果遇到，在「API 配置」填入代理地址：

1. **Cloudflare Worker**（推荐）— 免费，创建一个 Worker 转发请求到 MiMo API
2. **mimo-tts-studio 后端** — 用 [mimo-tts-studio](https://github.com/Chentx1243/mimo-tts-studio) 的 Express 后端做代理
3. **本地测试** — `open -n --args --disable-web-security index.html`

## 技术栈

- 纯 HTML + CSS + JavaScript（零依赖，零构建）
- MiMo-V2.5-TTS-VoiceDesign API
- localStorage 存储配置

## License

MIT
