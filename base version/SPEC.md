# 有声书片段生成器 — Full Spec

## Overview

A browser-based tool that converts text into multi-voice audiobook snippets using the MiMo-V2.5-TTS API. Users paste a story, the app auto-segments dialogue vs narration, assigns voice designs per character, generates audio, and provides playback + download.

**Zero dependencies.** Pure HTML + CSS + JavaScript. No build step. Hosted on GitHub Pages.

---

## File Structure

```
/
├── index.html          # Main HTML (layout + inline elements)
├── style.css           # All styles (design-agnostic, use CSS variables)
├── app.js              # All logic (API calls, segmentation, playback)
└── README.md           # User-facing docs
```

To create a new design: create a new `index.html` + `style.css` that reference the same `app.js`. Or copy `app.js` into a new folder and adapt class names.

---

## Data Model

### State Object (in-memory, not persisted)

```javascript
let state = {
  apiRegion: 'standard' | 'cn' | 'sgp',   // API endpoint selector
  customBase: string,                       // Custom base URL override
  apiKey: string,                           // MiMo API key
  proxyUrl: string,                         // CORS proxy URL
  segments: Segment[],                      // Parsed text segments
  characters: { [name]: Character },        // Voice designs per character
  audioBuffers: { [idx]: AudioBuffer },     // Generated audio blobs
};
```

### Segment

```javascript
{
  idx: number,          // 1-based sequential index
  type: 'narration' | 'dialogue',
  speaker: string,      // '旁白' for narration, character name for dialogue
  text: string,         // The text to synthesize
}
```

### Character

```javascript
{
  desc: string,         // Voice design description (user-editable)
  isNarrator: boolean,  // true if speaker === '旁白'
}
```

### AudioBuffer

```javascript
{
  blob: Blob,           // WAV audio blob
  url: string,          // Object URL for <audio> playback
}
```

---

## UI Sections (3-Step Flow)

### Step 1 — API Config + Text Input

| Element | ID | Type | Behavior |
|---------|-----|------|----------|
| API Key input | `apiKey` | `input[type=password]` | User enters key |
| Save Key button | — | `button onclick="saveApiKey()"` | Saves to localStorage |
| Endpoint selector | `apiRegion` | `select` | Options: standard / cn / sgp |
| Custom Base URL | `customBase` | `input[type=url]` | Overrides endpoint |
| Proxy URL | `proxyUrl` | `input[type=url]` | CORS proxy |
| Text textarea | `textInput` | `textarea` | Auto-segments after 800ms debounce when >20 chars |

### Step 2 — Character Voice Assignment (hidden until segmented)

| Element | ID | Type | Behavior |
|---------|-----|------|----------|
| Characters panel | `charactersPanel` | `div` container | Dynamic character cards |
| Segment preview | `segmentsList` | `div` container | Shows parsed segments |
| Segment count | `segmentCount` | `span` | Updated count |
| Preset buttons | — | `.preset-btn[data-preset]` | 8 voice presets |

**Character Card Structure (dynamically generated):**

```html
<div class="char-card [narrator]">
  <div class="char-header">
    <span class="char-name">
      [emoji] [name]
      <span class="char-badge [narrator-badge|dialogue-badge]">[旁白|对话]</span>
    </span>
    <span>[count] 段</span>
  </div>
  <textarea class="char-textarea" data-speaker="[name]">[voice description]</textarea>
</div>
```

**Preset Buttons:**

| Key | Label | Voice Description |
|-----|-------|-------------------|
| `narrator` | 📖 沉稳旁白 | 一个沉稳温和的中年男性声音... |
| `young-male` | 🧑 年轻男性 | 一个二十多岁的年轻男性... |
| `young-female` | 👩 年轻女性 | 一个二十多岁的年轻女性... |
| `elder-male` | 👴 老年男性 | 一个六十多岁的老年男性... |
| `elder-female` | 👵 老年女性 | 一个六十多岁的老年女性... |
| `child` | 🧒 童声 | 一个七八岁的小孩... |
| `villain` | 😈 反派 | 一个阴险低沉的男性声音... |
| `hero` | 🦸 英雄 | 一个磁性浑厚的男性声音... |

**Preset behavior:** Clicking a preset applies the voice description to the last focused character textarea. Falls back to the first character if none focused.

### Step 3 — Player (hidden until audio generated)

| Element | ID | Type | Behavior |
|---------|-----|------|----------|
| Audio list | `audioList` | `div` container | Dynamic audio items |
| Play All | — | `button onclick="playAll()"` | Plays segments sequentially |
| Pause | — | `button onclick="pauseAll()"` | Pauses all |
| Stop | — | `button onclick="stopAll()"` | Stops + resets all |
| Download All | — | `button onclick="downloadAll()"` | Downloads all WAV files |

**Audio Item Structure (dynamically generated):**

```html
<div class="audio-item [playing]" id="audio-item-[idx]">
  <div class="audio-label">
    #[idx]
    <small>[speaker]</small>
  </div>
  <audio controls src="[blobUrl]" id="audio-[idx]"></audio>
  <button class="btn btn-sm" onclick="downloadSingle([idx])">💾</button>
</div>
```

**Playback behavior:** `ended` event on each audio triggers `playNext(currentIdx)` for sequential playback. `play` event adds `.playing` class for visual feedback.

---

## Text Segmentation Algorithm

**Input:** Raw text from `#textInput` textarea
**Output:** Array of `Segment` objects

### Rules

1. Split text by newlines, filter empty lines
2. For each line, check two regex patterns:
   - **dialogueMatch:** `/^["「](.+?)["」][:：]?\s*(.*)$/` — dialogue starts with quotes
   - **dialogueInline:** `/^(.+?)[:：]\s*["「](.+?)["」]/` — speaker before quotes
3. Non-dialogue lines accumulate in a narration buffer
4. When dialogue is found, flush the narration buffer as a segment
5. After all lines, flush any remaining buffer
6. Each segment gets an auto-incrementing `idx` (1-based)

### Speaker tracking

- `lastSpeaker` remembers the most recent dialogue speaker
- If a dialogue line has no speaker name (e.g., `「text」`), it uses `lastSpeaker`
- Narration always uses speaker `'旁白'`

---

## API Integration

### Endpoint Selection

```
Priority:
1. proxyUrl → {proxyUrl}/v1/chat/completions
2. customBase → {customBase}/v1/chat/completions
3. apiRegion === 'cn' → token-plan-cn.xiaomimimo.com
4. apiRegion === 'sgp' → token-plan-sgp.xiaomimimo.com
5. default → api.xiaomimimo.com
```

### Request Format

```
POST {endpoint}/v1/chat/completions
Headers:
  Content-Type: application/json
  Authorization: Bearer {apiKey}
  api-key: {apiKey}

Body:
{
  "model": "mimo-v2.5-tts-voicedesign",
  "messages": [
    { "role": "user", "content": "{voiceDescription}" },
    { "role": "assistant", "content": "{text}" }
  ],
  "audio": { "format": "wav" }
}
```

### Response Handling

- Response JSON → `choices[0].message.audio.data` (base64 WAV)
- Convert base64 → Blob → Object URL
- Store in `state.audioBuffers[idx]`

### Error Handling

- HTTP errors: throw with status code + first 500 chars of response body
- Missing audio data: throw "响应中没有音频数据"
- Errors collected per-segment, shown in summary alert after all segments complete

---

## localStorage Keys

| Key | Value | Default |
|-----|-------|---------|
| `mimo_api_key` | API key string | `''` |
| `mimo_api_region` | `'standard'` / `'cn'` / `'sgp'` | `'standard'` |
| `mimo_custom_base` | Custom base URL | `''` |
| `mimo_proxy_url` | Proxy URL | `''` |

---

## CSS Variables (Design Tokens)

All styles should use these CSS custom properties for easy theming:

```css
:root {
  --bg: #0f0f13;
  --surface: #1a1a24;
  --surface-hover: #22223a;
  --border: #2a2a40;
  --text: #e8e8f0;
  --text-dim: #8888a8;
  --accent: #7c6cf0;
  --accent-hover: #6a5cd8;
  --accent-glow: rgba(124, 108, 240, 0.25);
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #f87171;
  --radius: 12px;
  --radius-sm: 8px;
}
```

---

## Required HTML Element IDs

These IDs must exist in the HTML for `app.js` to work:

| ID | Element | Purpose |
|----|---------|---------|
| `apiKey` | `<input>` | API key input |
| `apiRegion` | `<select>` | Endpoint selector |
| `customBase` | `<input>` | Custom base URL |
| `proxyUrl` | `<input>` | CORS proxy |
| `textInput` | `<textarea>` | Text input |
| `step2` | `<div>` | Character section (toggled hidden) |
| `charactersPanel` | `<div>` | Character cards container |
| `segmentPreview` | `<div>` | Segment list wrapper |
| `segmentCount` | `<span>` | Segment count display |
| `segmentsList` | `<div>` | Segment list container |
| `actionRow` | `<div>` | Generate button wrapper |
| `generateBtn` | `<button>` | Generate audio button |
| `progressArea` | `<div>` | Progress bar wrapper |
| `progressText` | `<div>` | Progress text |
| `progressFill` | `<div>` | Progress bar fill |
| `step3` | `<div>` | Player section (toggled hidden) |
| `audioList` | `<div>` | Audio items container |

---

## Required CSS Classes

These classes are referenced by `app.js`:

| Class | Applied To | Purpose |
|-------|-----------|---------|
| `hidden` | Any element | `display: none !important` |
| `preset-btn` | Preset buttons | `data-preset` attribute matches PRESETS keys |
| `char-card` | Character cards | Generated dynamically |
| `char-textarea` | Voice description inputs | `data-speaker` attribute |
| `narrator` | Character card | Narrator styling |
| `narrator-badge` | Badge span | Narrator badge styling |
| `dialogue-badge` | Badge span | Dialogue badge styling |
| `audio-item` | Player row | Generated dynamically |
| `playing` | Audio item | Active playback state |

---

## Design-Swap Checklist

To create a new design:

1. **Copy** `app.js` to a new folder
2. **Create** new `index.html` with all required element IDs (see table above)
3. **Create** new `style.css` with all required classes (see table above)
4. **Ensure** preset buttons have class `preset-btn` and `data-preset="key"`
5. **Ensure** character textareas have class `char-textarea` and `data-speaker="name"`
6. **Ensure** the `.hidden` class exists: `.hidden { display: none !important; }`
7. **Test** the flow: paste text → auto-segment → assign voices → generate → play → download

---

## Limitations

- **No WAV merging:** Downloads are individual files per segment (browser can't merge WAV without a library)
- **Sequential generation:** Segments generate one-by-one (not parallel) due to API rate limits
- **No streaming:** Audio is returned as a complete base64 blob, not streamed
- **No persistence:** Generated audio is lost on page refresh (stored as Object URLs)
- **CORS:** Direct browser calls may be blocked; requires proxy for some endpoints
