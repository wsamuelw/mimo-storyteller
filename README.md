# 🎙️ 有声书片段生成器

把文字变成多角色有声书，使用 [MiMo-V2.5-TTS](https://mimo.xiaomi.com) 语音合成 API。

## 功能

- 📝 粘贴文本，自动识别对话和旁白
- 🎭 为每个角色设计声音（voice design）
- 🎵 一键生成全部音频
- 🎧 在线试听，支持连续播放
- 💾 单段或批量下载 WAV 音频

## 使用方法

1. 打开 `index.html`（或部署到 GitHub Pages）
2. 输入你的 MiMo API Key（在 [mimo.xiaomi.com](https://mimo.xiaomi.com) 获取）
3. 粘贴小说/故事文本
4. 点击「智能分段」
5. 为每个角色编辑声音描述（或使用预设）
6. 点击「生成全部音频」
7. 试听并下载

## 部署到 GitHub Pages

```bash
# 1. 在 GitHub 创建仓库
# 2. 推送代码
git init
git add .
git commit -m "init: audiobook generator"
git remote add origin https://github.com/YOUR_USER/audiobook-generator.git
git push -u origin main

# 3. 在仓库 Settings → Pages → Source 选择 "main" 分支
# 4. 访问 https://YOUR_USER.github.io/audiobook-generator/
```

## CORS 说明

浏览器直接调用 MiMo API 可能被 CORS 阻止。解决方案：

1. **Cloudflare Worker 代理**（推荐）— 免费，创建一个 Worker 转发请求
2. **mimo-tts-studio 后端** — 使用 [mimo-tts-studio](https://github.com/Chentx1243/mimo-tts-studio) 的 Express 后端做代理
3. **本地测试** — 用 `--disable-web-security` 启动 Chrome

在 app 的「API 配置」部分填入代理地址即可。

## 技术栈

- 纯 HTML + CSS + JavaScript（无框架依赖）
- MiMo-V2.5-TTS-VoiceDesign API
- localStorage 存储 API Key

## License

MIT
