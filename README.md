# 🎙️ MiMo Storyteller

Paste a story, assign voices, listen to AI narration. Built with MiMo-V2.5-TTS API, hosted entirely on GitHub Pages — zero backend required.

---

## What is MiMo-V2.5-TTS?

[MiMo-V2.5-TTS](https://platform.xiaomimimo.com) is Xiaomi's text-to-speech API supporting:

| Model | Purpose |
|-------|---------|
| `mimo-v2.5-tts-voicedesign` | Custom voice via text description (e.g. "a warm female voice") |
| `mimo-v2.5-tts` | Preset voices + dialect/singing tags |
| `mimo-v2.5-pro` | LLM for AI story generation |

**Key features:**
- **Voice Design** — describe any voice in natural language, API generates it
- **Dialect support** — `(粤语)`, `(东北话)`, `(四川话)`, etc.
- **Singing** — `(唱歌)` tag switches to singing mode
- **CORS enabled** — `Access-Control-Allow-Origin: *`, no proxy needed

**API Endpoints:**

| Endpoint | Base URL |
|----------|----------|
| Standard / PAYG | `https://api.xiaomimimo.com` |
| Token Plan CN | `https://token-plan-cn.xiaomimimo.com` |
| Token Plan SGP | `https://token-plan-sgp.xiaomimimo.com` |

**Auth format:** Both `Authorization: Bearer <key>` AND `api-key: <key>` headers required.

---

## Features

### Core
- **3-pattern text segmentation** — auto-detects characters from `Name：dialogue` and `"dialogue"` formats
- **24 voice presets** — one-click voice assignment with 3-language labels (Top 8 visible, +16 more expandable)
- **Voice design** — type any voice description in natural language
- **AI story generator** — prompt → LLM story → auto-segment → assign voices → TTS. Outputs in selected language regardless of prompt language. Uses `Name：dialogue` format for reliable auto-segmentation
- **Dialect & singing** — prefix text with `(粤语)` or `(唱歌)` to switch voice mode
- **Retry failed segments** — regenerate only the segments that failed, not everything

### Playback
- **Voice preview** — ▶ button on each character card to hear the voice before generating
- **Parallel generation** — 3 segments simultaneously (3× faster)
- **Sequential playback** — play all segments in order with gap handling
- **Karaoke highlighting** — character-by-character text highlighting during playback
- **Minimal top bar** — play/pause + progress + time, always visible
- **Dropdown menu** — speed, volume, prev/next, download all, share (⋯ button)
- **Retry with backoff** — 3 retries on API failures (1s → 2s → 4s)
- **Error indication** — progress bar turns red when segments fail

### UX
- **3-language support** — 简体中文, 繁體中文, English
- **Toast notifications** — dismissible, errors stay until clicked
- **Step indicators** — ① Text → ② Characters → ③ Story Reader
- **Settings modal** — API key, endpoint, custom URL, proxy (with focus trap)
- **API key toggle** — eye icon to show/hide password
- **Clear confirmation** — warns before destroying all work
- **Story overwrite warning** — warns before replacing existing text
- **Empty states** — placeholder messages before content exists
- **Character selection highlight** — cyan glow on selected character card
- **Voice preset badges** — shows selected voice in character cards
- **Language-aware presets** — voice descriptions translate on language switch
- **Format instructions** — persistent helper text (not buried in placeholder)
- **Debounced settings** — URL inputs save after 500ms pause, not every keystroke
- **Collapsed segment list** — summary chips with speaker counts, expandable on demand
- **Story Reader section** — dedicated section with karaoke text display and minimal player

### Mobile
- **44px touch targets** — meets Apple/Google guidelines on all interactive elements
- **Responsive grid** — single column on mobile, multi-column on desktop
- **Text wrapping** — segment text wraps on mobile instead of truncating
- **Safe-area padding** — modal footer respects iPhone home indicator
- **Disabled animation** — background gradient stops animating on mobile for performance

### Accessibility
- **Focus trap** — modal traps Tab/Shift+Tab, returns focus on close
- **ARIA labels** — all form inputs, buttons, and dynamic content labeled
- **aria-live regions** — progress, segment count, story status announced to screen readers
- **prefers-reduced-motion** — all animations disabled for users who opt out
- **Keyboard navigation** — all interactive elements reachable via keyboard
- **Semantic HTML** — proper headings, landmarks, and roles

---

## Design System

### Color Tokens
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

### Components
- **Glass cards** — `backdrop-filter: blur(12px)`, semi-transparent backgrounds
- **Gradient buttons** — animated gradient backgrounds with glow effects
- **Neon accents** — cyan/magenta/violet highlights on interactive elements
- **Typography** — Outfit (UI) + Noto Sans SC (Chinese)

---

## Code Structure

```
neon version/
├── index.html          # App structure
├── style.css           # Neon glass design system
├── app.js              # Core logic (segmentation, TTS, playback)
├── i18n.js             # 3-language translations (zh-CN, zh-TW, en)
└── README.md           # This file
```

### app.js — Core Logic

| Section | Purpose |
|---------|---------|
| State | Global state object (segments, characters, audio buffers) |
| PRESETS | 24 voice descriptions × 3 languages |
| escapeHtml | XSS protection for innerHTML |
| Toast | Notification system (errors stay until clicked) |
| segmentText | 3-pattern text segmentation engine |
| buildCharacters | Extract characters from segments |
| renderStep2 | Character cards + segment list UI |
| renderStoryReader | Karaoke-style text display with character highlighting |
| generateAll | Parallel TTS generation with retry |
| retryFailed | Re-generate only failed segments |
| callTTS | MiMo API integration |
| callTTSWithRetry | Exponential backoff retry wrapper |
| togglePlayPause | Play/pause with icon swap |
| playAll/pauseAll/stopAll | Sequential playback with gap handling |
| togglePlayerMenu | Dropdown menu for speed, volume, actions |
| setPlaybackSpeed | Speed control (0.75x–2x) |
| setVolume/toggleMute | Volume control |
| seekProgress | Click-to-seek on progress bar |
| renderSegmentsList | Collapsed segment list with summary chips |
| generateStory | AI story generation via MiMo LLM |
| openSettings/closeSettings | Modal with focus trap |

### i18n.js — Translations

| Section | Purpose |
|---------|---------|
| I18N object | 3 locale keys (zh-CN, zh-TW, en) with 80+ keys each |
| t() function | Translation lookup with fallback chain |
| setLang() | Updates DOM, `document.title`, `document.documentElement.lang` |
| data-i18n | Auto-translates text content on language switch |
| data-i18n-aria | Auto-translates aria-label attributes |

### Text Segmentation — 3 Patterns

```
Pattern 1: Name：dialogue     → speaker = Name
Pattern 2: "dialogue"         → speaker = last speaker
Pattern 3: anything else      → narration → 旁白
```

**Scene markers** (`【第三章】`, `---`, `***`) are skipped.

---

## Voice Presets (24)

| Preset | Description |
|--------|-------------|
| 📖 Narrator | Calm, warm middle-aged male |
| 🧑 Young Male | Energetic, youthful voice |
| 👩 Young Female | Gentle, bright voice |
| 🧒 Child | Cute, high-pitched child voice |
| 😈 Villain | Sinister, threatening male voice |
| 🦸 Hero | Magnetic, powerful male voice |
| 🌸 Gentle | Warm, intellectual female voice |
| 🔥 Energetic | Passionate, youthful male voice |
| 📺 News Anchor | Professional, precise articulation |
| 📚 Storyteller | Dramatic, expressive storytelling |
| 🌙 Mysterious | Low, raspy, mysterious voice |
| 💋 Flirty | Lazy, charming female voice |
| 🖤 Seductive | Low, magnetic whispering voice |
| 👑 Domina | Cold, authoritative female voice |
| 💢 Tsundere | Tough outside, soft inside |
| 🔪 Yandere | Sweet surface, obsessive underneath |
| 🌺 Onee-San | Mature, caring big sister voice |
| ❄️ Kuudere | Flat, expressionless ice queen |
| 💎 Ojou-Sama | Arrogant, elegant wealthy lady |
| 💉 Nurse | Gentle, caring medical voice |
| 📋 Secretary | Crisp, professional voice |
| 💔 Ex-Girlfriend | Cold, distant, resentful voice |
| 🥂 Luxury | Elegant socialite voice |
| 🤫 Whisper | Extremely soft, secretive whisper |

---

## API Integration

### TTS Request
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

### Dialect/Singing Request
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

### Story Generation Request
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

## Deployment (GitHub Pages)

### Quick Deploy
1. Create a GitHub repository
2. Copy the `neon version/` folder contents to the repo root
3. Push to GitHub
4. Go to **Settings → Pages → Deploy from branch** (main)
5. Your app is live at `https://username.github.io/repo-name`

### Custom Domain (Optional)
1. Add a `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repo settings

### Environment
- **No build step** — pure HTML/CSS/JS
- **No server** — runs entirely in the browser
- **No dependencies** — zero npm packages
- **API key** — stored in each user's localStorage (per-origin)

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core app | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| AbortController | ✅ 66+ | ✅ 57+ | ✅ 12.1+ | ✅ 79+ |
| fetch API | ✅ 42+ | ✅ 39+ | ✅ 10.1+ | ✅ 14+ |
| backdrop-filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ |

**Not supported:** IE11 (EOL)

---

## Security Notes

- **API key** stored in `localStorage` (plaintext, per-origin)
- **XSS protection** via `escapeHtml()` on all user input
- **CORS** — MiMo API returns `Access-Control-Allow-Origin: *`
- **No tracking** — zero analytics, zero cookies, zero external services

---

## Known Limitations

1. **Segmentation** — Only handles `Name：dialogue` and `"dialogue"` formats. Complex dialogue with inline narration between quotes may misassign speakers.
2. **Voice descriptions** — Typed manually or via presets. No voice preview before generation.
3. **Audio format** — Outputs WAV only. No MP3/OGG compression.
4. **Max segments** — No hard limit, but 50+ segments take several minutes to generate.
5. **LLM prompt** — Story generation prompt is in Chinese. English stories may have lower quality.

---

## License

MIT — use freely, no attribution required.

---

## Acknowledgments

- [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) — Xiaomi's voice synthesis API
- [Outfit](https://fonts.google.com/specimen/Outfit) — UI typography
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) — Chinese typography