# 🎙️ MiMo Storyteller

貼個故事落去，分配唔同聲音，聽 AI 旁白。用 MiMo-V2.5-TTS API 打造，完全喺 GitHub Pages 上面運行 — 唔需要後端。

---

## MiMo-V2.5-TTS 係咩？

[MiMo-V2.5-TTS](https://platform.xiaomimimo.com) 係小米嘅文字轉語音 API，支援以下功能：

| Model | 用途 |
|-------|---------|
| `mimo-v2.5-tts-voicedesign` | 用文字描述自訂聲音（例如 "a warm female voice"） |
| `mimo-v2.5-tts` | 預設聲音 + 方言/唱歌標籤 |
| `mimo-v2.5-pro` | LLM，用嚟 AI 生成故事 |

**主要功能：**
- **聲音設計** — 用自然語言描述任何聲音，API 就會生成
- **方言支援** — `(粤语)`、`(东北话)`、`(四川话)` 等等
- **唱歌** — 用 `(唱歌)` 標籤切換到唱歌模式
- **CORS 已啟用** — `Access-Control-Allow-Origin: *`，唔需要 proxy

**API Endpoints：**

| Endpoint | Base URL |
|----------|----------|
| Standard / PAYG | `https://api.xiaomimimo.com` |
| Token Plan CN | `https://token-plan-cn.xiaomimimo.com` |
| Token Plan SGP | `https://token-plan-sgp.xiaomimimo.com` |

**驗證格式：** 需要同時帶 `Authorization: Bearer <key>` 同 `api-key: <key>` 兩個 header。

---

## 功能

### 核心
- **3 種文字分段模式** — 自動偵測 `Name：dialogue` 同 `"dialogue"` 格式嘅角色
- **24 個預設聲音** — 一鍵分配聲音，支援 3 種語言標籤（顯示 Top 8，可以展開睇埋剩餘 +16 個）
- **聲音設計** — 用自然語言輸入任何聲音描述
- **AI 故事生成器** — prompt → LLM 故事 → 自動分段 → 分配聲音 → TTS。不論 prompt 用咩語言，輸出都係選定嘅語言。用 `Name：dialogue` 格式確保自動分段可靠
- **方言同唱歌** — 喺文字前面加 `(粤语)` 或者 `(唱歌)` 就可以切換語音模式
- **失敗重試** — 只重新生成失敗嘅段落，唔使全部重嚟

### 播放
- **聲音預覽** — 每個角色卡上面有 ▶ 按鈕，生成之前可以試聽
- **平行生成** — 同時處理 3 個段落（快 3 倍）
- **順序播放** — 按次序播放所有段落，自動處理間隔
- **卡拉 OK 高亮** — 播放期間逐個字高亮顯示
- **簡約頂部列** — 播放/暫停 + 進度 + 時間，永遠可見
- **下拉選單** — 速度、音量、上一首/下一首、下載全部、分享（⋯ 按鈕）
- **退避重試** — API 失敗時重試 3 次（1s → 2s → 4s）
- **錯誤提示** — 段落失敗時進度條會變紅

### 用戶體驗
- **3 語言支援** — 简体中文、繁體中文、English
- **Toast 通知** — 可以關閉，錯誤訊息會停留到你撳為止
- **步驟指示器** — ① 文字 → ② 角色 → ③ 故事朗讀器
- **設定彈窗** — API key、endpoint、自訂 URL、proxy（有 focus trap）
- **API key 切換** — 眼仔圖示顯示/隱藏密碼
- **清除確認** — 清除所有內容前會警告
- **故事覆蓋警告** — 覆蓋現有文字前會警告
- **空白狀態** — 內容未有之前會顯示佔位訊息
- **角色選擇高亮** — 選中嘅角色卡會有青色發光效果
- **預設聲音標籤** — 角色卡上面會顯示揀咗嘅聲音
- **語言感知預設** — 切換語言時聲音描述會自動翻譯
- **格式說明** — 持續顯示嘅輔助文字（唔係收埋喺 placeholder 入面）
- **防抖設定** — URL 輸入停打 500ms 先儲存，唔係每個 keystroke 都存
- **摺疊段落列表** — 摘要 chip 顯示講者數量，可以展開睇詳情
- **故事朗讀器區域** — 專屬區域，有卡拉 OK 文字顯示同簡約播放器

### 流動裝置
- **44px 觸控目標** — 所有互動元素都符合 Apple/Google 準則
- **響應式佈局** — 流動裝置單欄，桌面多欄
- **文字換行** — 流動裝置上段落文字會換行而唔係截斷
- **安全區域間距** — 彈窗底部會尊重 iPhone 底部橫條
- **停用動畫** — 流動裝置上停止背景漸變動畫以提升效能

### 無障礙
- **Focus trap** — 彈窗會攔截 Tab/Shift+Tab，關閉時歸還焦點
- **ARIA 標籤** — 所有表單輸入、按鈕同動態內容都有標籤
- **aria-live 區域** — 進度、段落數量、故事狀態會通報俾螢幕閱讀器
- **prefers-reduced-motion** — 用戶選擇減少動畫時會停用所有動畫
- **鍵盤導航** — 所有互動元素都可以用鍵盤到達
- **語義化 HTML** — 正確嘅標題、landmark 同 role

---

## 設計系統

### 色彩 Tokens
```css
--bg: #08081a          /* Deep space background */
--surface: #0f0f2a     /* Card background */
--border: rgba(255,255,255,.08)  /* Subtle borders */
--cyan: #00e5ff        /* Primary accent */
--magenta: #ff2daa     /* Secondary accent */
--violet: #8b5cf6      /* Tertiary accent */
--text: #e8e8f0        /* Primary text */
--text-dim: #b8b7cc    /* Secondary text */
```

### 組件
- **玻璃卡片** — `backdrop-filter: blur(12px)`，半透明背景
- **漸變按鈕** — 動態漸變背景加發光效果
- **霓虹點綴** — 青色/洋紅/紫色高亮喺互動元素上
- **字型** — Outfit（UI）+ Noto Sans SC（中文）

---

## 代碼結構

```
neon version/
├── index.html          # App 結構
├── style.css           # 霓虹玻璃設計系統
├── app.js              # 核心邏輯（分段、TTS、播放）
├── i18n.js             # 3 語言翻譯（zh-CN, zh-TW, en）
└── README.md           # 呢個檔案
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
| callTTSWithRetry | 指數退避重試包裝器 |
| togglePlayPause | 播放/暫停加圖示切換 |
| playAll/pauseAll/stopAll | 順序播放加間隔處理 |
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
| I18N 物件 | 3 個 locale key（zh-CN, zh-TW, en），每個有 80+ 個 key |
| t() 函數 | 翻譯查找加 fallback 鏈 |
| setLang() | 更新 DOM、`document.title`、`document.documentElement.lang` |
| data-i18n | 切換語言時自動翻譯文字內容 |
| data-i18n-aria | 切換語言時自動翻譯 aria-label 屬性 |

### 文字分段 — 3 種模式

```
模式 1: Name：dialogue     → speaker = Name
模式 2: "dialogue"         → speaker = 上一個講者
模式 3: 其他任何內容        → narration → 旁白
```

**場景標記**（`【第三章】`、`---`、`***`）會被跳過。

---

## 預設聲音（24 個）

| 預設 | 描述 |
|--------|-------------|
| 📖 Narrator | 平靜、溫暖嘅中年男聲 |
| 🧑 Young Male | 充滿活力、年輕嘅男聲 |
| 👩 Young Female | 溫柔、明亮嘅女聲 |
| 🧒 Child | 可愛、高音嘅細路聲 |
| 😈 Villain | 陰險、帶威脅嘅男聲 |
| 🦸 Hero | 有磁性、強而有力嘅男聲 |
| 🌸 Gentle | 溫暖、知性嘅女聲 |
| 🔥 Energetic | 熱情、年輕嘅男聲 |
| 📺 News Anchor | 專業、咬字清晰 |
| 📚 Storyteller | 富戲劇性、有感染力嘅講故事聲 |
| 🌙 Mysterious | 低沉、沙啞、神秘嘅聲音 |
| 💋 Flirty | 懶洋洋、迷人嘅女聲 |
| 🖤 Seductive | 低沉、有磁性嘅耳語聲 |
| 👑 Domina | 冷酷、有權威嘅女聲 |
| 💢 Tsundere | 外硬內軟 |
| 🔪 Yandere | 表面甜蜜、內心偏執 |
| 🌺 Onee-San | 成熟、關心人嘅家姐聲 |
| ❄️ Kuudere | 平淡、無表情嘅冰山美人 |
| 💎 Ojou-Sama | 傲慢、優雅嘅大小姐 |
| 💉 Nurse | 溫柔、關懷嘅醫護聲 |
| 📋 Secretary | 爽快、專業嘅聲音 |
| 💔 Ex-Girlfriend | 冷淡、疏遠、帶怨恨嘅聲音 |
| 🥂 Luxury | 優雅嘅社交名媛聲 |
| 🤫 Whisper | 超輕聲、秘密嘅耳語 |

---

## API 整合

### TTS 請求
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

### 方言/唱歌請求
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

### 故事生成請求
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
1. 建一個 GitHub repository
2. 將 `neon version/` 資料夾嘅內容複製到 repo 根目錄
3. Push 去 GitHub
4. 去 **Settings → Pages → Deploy from branch**（main）
5. 你嘅 app 就喺 `https://username.github.io/repo-name` 上線

### 自訂域名（可選）
1. 加一個 `CNAME` 檔案寫低你嘅域名
2. 設定 DNS 指向 GitHub Pages
3. 喺 repo 設定啟用 HTTPS

### 環境
- **無需 build** — 純 HTML/CSS/JS
- **無需 server** — 完全喺瀏覽器入面運行
- **無依賴** — 零 npm packages
- **API key** — 儲存喺每個用戶嘅 localStorage（per-origin）

---

## 瀏覽器支援

| 功能 | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| 核心 app | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| AbortController | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| fetch API | ✅ 42+ | ✅ 39+ | ✅ 10.1+ | ✅ 14+ |
| backdrop-filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |

**不支援：** IE11（已停止服務）

---

## 安全事項

- **API key** 儲存喺 `localStorage`（明文，per-origin）
- **XSS 防護** — 所有用戶輸入都經 `escapeHtml()` 處理
- **CORS** — MiMo API 回傳 `Access-Control-Allow-Origin: *`
- **無追蹤** — 零分析、零 cookies、零外部服務

---

## 已知限制

1. **分段** — 只處理 `Name：dialogue` 同 `"dialogue"` 格式。複雜對話如果引號中間有敘述文字，可能會搞亂講者分配。
2. **聲音描述** — 需要手動輸入或者用預設。生成前冇聲音預覽。
3. **音訊格式** — 只輸出 WAV。冇 MP3/OGG 壓縮。
4. **段落上限** — 冇硬性限制，但 50+ 段落要幾分鐘先生成完。
5. **LLM prompt** — 故事生成嘅 prompt 係中文。英文故事質素可能會差啲。

---

## 授權條款

MIT — 自由使用，唔使標註出處。

---

## 鳴謝

- [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) — 小米嘅語音合成 API
- [Outfit](https://fonts.google.com/specimen/Outfit) — UI 字型
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) — 中文字型
