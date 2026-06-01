# API Integration

MiMo Storyteller uses three [MiMo-V2.5-TTS](https://platform.xiaomimimo.com) API endpoints.

## Endpoints

| Endpoint | Base URL |
|----------|----------|
| Standard / PAYG | `https://api.xiaomimimo.com` |
| Token Plan CN | `https://token-plan-cn.xiaomimimo.com` |
| Token Plan SGP | `https://token-plan-sgp.xiaomimimo.com` |

**Auth:** Both `Authorization: Bearer <key>` AND `api-key: <key>` headers required.

## Models

| Model | Purpose |
|-------|---------|
| `mimo-v2.5-tts-voicedesign` | Custom voice via text description |
| `mimo-v2.5-tts` | Preset voices + dialect/singing tags |
| `mimo-v2.5-pro` | LLM for AI story generation |

## Key Features

- **Voice Design** — describe any voice in natural language, API generates it
- **Dialect support** — `(粤语)`, `(东北话)`, `(四川话)`, etc.
- **Singing** — `(唱歌)` tag switches to singing mode
- **CORS enabled** — `Access-Control-Allow-Origin: *`, no proxy needed

## Request Examples

### TTS (Voice Design)
```json
{
  "model": "mimo-v2.5-tts-voicedesign",
  "messages": [
    { "role": "user", "content": "A warm, calm middle-aged male voice" },
    { "role": "assistant", "content": "Hello, welcome to the story." }
  ],
  "audio": { "format": "wav" }
}
```

### TTS (Dialect/Singing)
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

### Story Generation (LLM)
```json
{
  "model": "mimo-v2.5-pro",
  "messages": [
    { "role": "user", "content": "Write a short story about a dragon and a princess" }
  ],
  "temperature": 0.8
}
```
