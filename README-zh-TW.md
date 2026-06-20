# 🎙️ MiMo Storyteller

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-magenta.svg)](https://wsamuelw.github.io/mimo-storyteller/)

[English](README.md) | [简体中文](README-zh-CN.md) | **繁體中文**

MiMo-V2.5 TTS 限時免費——所以我做咗一個多角色故事講述器。生成故事，自動分配角色聲音，文字實時高亮顯示。唔需要後端，零成本。

![MiMo Storyteller Demo](images/mimo-storyteller-demo.png)

### 免費攞 API 額度

喺 [platform.xiaomimimo.com](https://platform.xiaomimimo.com) 註冊嗰陣用邀請碼 **RRJPZE**，就可以攞到 $2 免費額度加首單 9 折優惠。

- 額度有效期 40 日 · 折扣即時生效
- 解鎖 MiMo-V2.5 同完整模型陣容

![MiMo Invite](images/RRJPZE.png)

---

## 快速開始

1. 喺瀏覽器開 `index.html`（或者去[線上示範](https://wsamuelw.github.io/mimo-storyteller/)）
2. 撳 ⚙️ 設定，貼你嘅 MiMo API key
3. 寫個故事（或者撳 ✨ 用 AI 生成）
4. 喺角色卡入面為每個角色分配聲音
5. 撳生成，聽故事

## 點樣運作

MiMo Storyteller 用小米嘅 [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) API 將文字變成多角色音訊旁白：

- **文字分段**自動偵測 `角色名：對白` 同 `"對白"` 格式入面嘅角色
- **聲音設計**俾你用自然語言描述任何聲音（例如「溫暖嘅中年男聲」）
- **平行 TTS 生成**同時為所有段落建立音訊
- **卡拉 OK 高亮**播放期間逐個字顯示文字

## 功能

### 核心
- **3 種文字分段模式** — 自動偵測 `角色名：對白` 同 `"對白"` 格式嘅角色
- **24 個預設聲音** — 一鍵分配聲音，支援 3 種語言標籤（顯示 12 個，可以展開睇埋剩餘 +12 個）
- **聲音設計** — 用自然語言輸入任何聲音描述
- **聲音預覽** — 每個角色卡上面有 ▶ 按鈕，生成之前可以試聽
- **AI 故事生成器** — prompt → LLM 故事 → 自動分段 → 分配聲音 → TTS
- **方言同唱歌** — 喺文字前面加 `(粤语)` 或者 `(唱歌)` 就可以切換語音模式
- **失敗重試** — 只重新生成失敗嘅段落

### 播放
- **平行生成** — 同時處理 3 個段落（快 3 倍）
- **順序播放** — 按次序播放所有段落，自動處理間隔
- **卡拉 OK 高亮** — 播放期間逐個字高亮顯示
- **簡約頂部列** — 播放/暫停 + 進度 + 時間，永遠可見
- **下拉選單** — 速度、音量、上一首/下一首、下載全部、分享（⋯ 按鈕）

### 用戶體驗
- **3 語言支援** — 简体中文、繁體中文、English
- **Toast 通知** — 可以關閉，錯誤訊息會停留到你撳為止
- **步驟指示器** — ① 文字 → ② 角色 → ③ 故事朗讀器
- **設定彈窗** — API key、endpoint、自訂 URL、proxy（有 focus trap）
- **API key 切換** — 眼仔圖示顯示/隱藏密碼
- **清除確認** — 清除所有內容前會警告
- **預設聲音標籤** — 角色卡上面會顯示揀咗嘅聲音
- **摺疊段落列表** — 摘要 chip 顯示講者數量，可以展開睇詳情

### 流動裝置
- **44px 觸控目標** — 所有互動元素都符合 Apple/Google 準則
- **響應式佈局** — 流動裝置單欄，桌面多欄
- **安全區域間距** — 彈窗底部會尊重 iPhone 底部橫條

### 無障礙
- **Focus trap** — 彈窗會攔截 Tab/Shift+Tab，關閉時歸還焦點
- **ARIA 標籤** — 所有表單輸入、按鈕同動態內容都有標籤
- **aria-live 區域** — 進度、段落數量、故事狀態會通報俾螢幕閱讀器
- **prefers-reduced-motion** — 用戶選擇減少動畫時會停用所有動畫
- **鍵盤導航** — 所有互動元素都可以用鍵盤到達

---

## 代碼結構

```
├── index.html          # App 結構
├── style.css           # 霓虹玻璃設計系統
├── app.js              # 核心邏輯（分段、TTS、播放）
├── i18n.js             # 3 語言翻譯（約 148 個 key）
└── API.md              # API 整合詳情
```

### app.js — 核心邏輯

| 區域 | 用途 |
|---------|---------|
| State | 全域狀態物件（段落、角色、音訊緩衝區） |
| PRESETS | 24 個聲音描述 × 3 種語言 |
| escapeHtml | innerHTML 嘅 XSS 防護 |
| Toast | 通知系統（錯誤訊息會停留到你撳為止） |
| segmentText | 3 種模式嘅文字分段引擎 |
| buildCharacters | 從段落中擷取角色 |
| renderStep2 | 角色卡 + 段落列表 UI |
| renderStoryReader | 卡拉 OK 風格文字顯示加角色高亮 |
| generateAll | 平行 TTS 生成加重試 |
| retryFailed | 只重新生成失敗嘅段落 |
| callTTS | MiMo API 整合 |
| togglePlayPause | 播放/暫停加圖示切換 |
| playAll/stopAll | 順序播放加間隔處理 |
| togglePlayerMenu | 速度、音量、操作嘅下拉選單 |
| setPlaybackSpeed | 速度控制（0.75x–2x） |
| setVolume/toggleMute | 音量控制 |
| seekProgress | 播放條點擊跳轉 |
| renderSegmentsList | 摘要 chip 嘅摺疊段落列表 |
| generateStory | 經 MiMo LLM 生成 AI 故事 |
| openSettings/closeSettings | 有 focus trap 嘅彈窗 |

### i18n.js — 翻譯

| 區域 | 用途 |
|---------|---------|
| I18N 物件 | 3 個 locale key（zh-CN, zh-TW, en），每個有約 148 個 key |
| t() 函數 | 翻譯查找加 fallback 鏈 |
| setLang() | 更新 DOM、`document.title`、`document.documentElement.lang` |
| data-i18n | 切換語言時自動翻譯文字內容 |
| data-i18n-aria | 切換語言時自動翻譯 aria-label 屬性 |
| data-i18n-placeholder | 切換語言時自動翻譯 placeholder 屬性 |

### 文字分段 — 3 種模式

```
模式 1: 角色名：對白     → 講者 = 角色名
模式 2: "對白"           → 講者 = 上一個講者
模式 3: 其他任何內容      → 旁白
```

**場景標記**（`【第三章】`、`---`、`***`）會被跳過。

---

## 預設聲音

24 個內建預設聲音，分為 3 類，支援 3 種語言：

- **旁白類** — 旁白、說書人、新聞主播、神秘、耳語
- **角色類** — 年輕男性/女性、兒童、英雄、反派、溫柔、熱血
- **動漫類** — 傲嬌、病嬌、大姐姐、冰山、千金、嫵媚、性感、女王

完整描述請睇 [`i18n.js`](i18n.js)。

---

## 部署

### GitHub Pages
1. Push 去 GitHub repo
2. 去 **Settings → Pages → Deploy from branch**（main）
3. 你嘅 app 就喺 `https://username.github.io/repo-name` 上線

### 環境
- **無需 build** — 純 HTML/CSS/JS
- **無需 server** — 完全喺瀏覽器入面運行
- **無依賴** — 零 npm packages
- **API key** — 儲存喺每個用戶嘅 localStorage（per-origin）

---

## 瀏覽器支援

支援 Chrome 66+、Firefox 57+、Safari 12.1+ 同 Edge 79+。唔支援 IE11。

---

## 安全事項

- **API key** 儲存喺 `localStorage`（明文，per-origin）
- **XSS 防護** — 所有用戶輸入都經 `escapeHtml()` 處理
- **CORS** — MiMo API 回傳 `Access-Control-Allow-Origin: *`
- **無追蹤** — 零分析、零 cookies、零外部服務
- 漏洞報告請睇 [SECURITY.md](SECURITY.md)

---

## 已知限制

1. **分段** — 只處理 `角色名：對白` 同 `"對白"` 格式。複雜對話如果引號中間有敘述文字，可能會搞亂講者分配。
2. **音訊格式** — 只輸出 WAV。冇 MP3/OGG 壓縮。
3. **段落上限** — 冇硬性限制，但 50+ 段落要幾分鐘先生成完。
4. **LLM prompt** — 故事生成嘅 prompt 係中文。英文故事質素可能會差啲。

---

## 參與貢獻

請睇 [CONTRIBUTING.md](CONTRIBUTING.md) 了解開發環境、代碼規範同 PR 流程。

請睇 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解社區準則。

---

## 授權條款

MIT — 自由使用，唔使標註出處。詳見 [LICENSE](LICENSE)。

---

## 鳴謝

- [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) — 小米嘅語音合成 API
- [Outfit](https://fonts.google.com/specimen/Outfit) — UI 字型
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) — 中文字型
