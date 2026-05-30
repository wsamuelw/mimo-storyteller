// ============================================================
// 有声书片段生成器 — MiMo-V2.5-TTS
// ============================================================

const API_STANDARD = 'https://api.xiaomimimo.com/v1/chat/completions';
const API_TOKEN_PLAN_CN = 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions';
const API_TOKEN_PLAN_SGP = 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions';

// --- State ---
let state = {
  apiRegion: localStorage.getItem('mimo_api_region') || 'standard',
  customBase: localStorage.getItem('mimo_custom_base') || '',
  apiKey: localStorage.getItem('mimo_api_key') || '',
  proxyUrl: localStorage.getItem('mimo_proxy_url') || '',
  segments: [],       // { idx, type, speaker, text }
  characters: {},     // speakerName -> { desc, isNarrator }
  audioBuffers: {},   // idx -> { blob, url }
  playingIdx: -1,
  audioElements: [],
};

// --- Presets ---
const PRESETS = {
  'narrator':    '一个沉稳温和的中年男性声音，语速适中，吐字清晰，像深夜电台主播，给人安定感。',
  'young-male':  '一个二十多岁的年轻男性，声音清朗有活力，语速偏快，带一点少年感。',
  'young-female':'一个二十多岁的年轻女性，声音温柔明亮，语速自然，像邻家姐姐。',
  'elder-male':  '一个六十多岁的老年男性，声音低沉沙哑，语速缓慢，带着岁月的厚重感。',
  'elder-female':'一个六十多岁的老年女性，声音温和慈祥，语速缓慢，像在讲睡前故事。',
  'child':       '一个七八岁的小孩，声音稚嫩清脆，语速稍快，充满好奇和天真。',
  'villain':     '一个阴险低沉的男性声音，语速缓慢，语气冰冷，带着压迫感和威胁。',
  'hero':        '一个磁性浑厚的男性声音，语速沉稳有力，语气坚定，给人安全感。',
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  if (state.apiKey) document.getElementById('apiKey').value = state.apiKey;
  if (state.proxyUrl) document.getElementById('proxyUrl').value = state.proxyUrl;
  document.getElementById('apiRegion').value = state.apiRegion;
  if (state.customBase) document.getElementById('customBase').value = state.customBase;
  document.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      applyPresetToActiveChar(preset);
    });
  });
});

// --- API Key ---
function toggleKeyVisibility() {
  const input = document.getElementById('apiKey');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function changeRegion() {
  state.apiRegion = document.getElementById('apiRegion').value;
  localStorage.setItem('mimo_api_region', state.apiRegion);
}

function saveCustomBase() {
  state.customBase = document.getElementById('customBase').value.trim();
  localStorage.setItem('mimo_custom_base', state.customBase);
}

function saveApiKey() {
  const key = document.getElementById('apiKey').value.trim();
  if (!key) return alert('请输入 API Key');
  state.apiKey = key;
  localStorage.setItem('mimo_api_key', key);
  alert('✅ API Key 已保存');
}

// --- Proxy ---
function saveProxyAndClose() {
  const url = document.getElementById('proxyUrl').value.trim();
  state.proxyUrl = url;
  localStorage.setItem('mimo_proxy_url', url);
  // corsModal removed for neon version
}

function closeModal() {
  // corsModal removed for neon version
}

// --- Text Segmentation ---
function segmentText() {
  const raw = document.getElementById('textInput').value.trim();
  if (!raw) return alert('请先粘贴文本');

  const segments = [];
  // Split by lines, keep non-empty
  const lines = raw.split('\n').filter(l => l.trim());

  let buffer = '';
  let lastSpeaker = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Check for dialogue: 「...」 or "..."
    const dialogueMatch = trimmed.match(/^["「](.+?)["」][:：]?\s*(.*)$/);
    const dialogueInline = trimmed.match(/^(.+?)[:：]\s*["「](.+?)["」]/);

    if (dialogueMatch) {
      // Flush narration buffer
      if (buffer.trim()) {
        segments.push({ idx: segments.length + 1, type: 'narration', speaker: '旁白', text: buffer.trim() });
        buffer = '';
      }
      const text = dialogueMatch[1];
      const speaker = dialogueMatch[2] || lastSpeaker || '未知';
      lastSpeaker = speaker;
      segments.push({ idx: segments.length + 1, type: 'dialogue', speaker, text });
    } else if (dialogueInline) {
      if (buffer.trim()) {
        segments.push({ idx: segments.length + 1, type: 'narration', speaker: '旁白', text: buffer.trim() });
        buffer = '';
      }
      const speaker = dialogueInline[1].trim();
      const text = dialogueInline[2];
      lastSpeaker = speaker;
      segments.push({ idx: segments.length + 1, type: 'dialogue', speaker, text });
    } else {
      buffer += (buffer ? '\n' : '') + trimmed;
    }
  }
  if (buffer.trim()) {
    segments.push({ idx: segments.length + 1, type: 'narration', speaker: '旁白', text: buffer.trim() });
  }

  if (!segments.length) return alert('未能识别出任何段落，请检查文本格式');

  state.segments = segments;
  buildCharacters();
  renderStep2();
}

function buildCharacters() {
  const chars = {};
  for (const seg of state.segments) {
    if (!chars[seg.speaker]) {
      chars[seg.speaker] = {
        desc: seg.speaker === '旁白' ? PRESETS['narrator'] : '',
        isNarrator: seg.speaker === '旁白',
      };
    }
  }
  state.characters = chars;
}

// --- Render Step 2 ---
function renderStep2() {
  document.getElementById('step2').classList.remove('hidden');
  document.getElementById('step3').classList.add('hidden');

  const panel = document.getElementById('charactersPanel');
  panel.innerHTML = '';

  for (const [name, char] of Object.entries(state.characters)) {
    const card = document.createElement('div');
    card.className = `char-card ${char.isNarrator ? 'narrator' : ''}`;
    card.innerHTML = `
      <div class="char-top">
        <span class="char-name">
          ${char.isNarrator ? '📖' : '🎭'} ${name}
          <span class="char-badge ${char.isNarrator ? 'nar' : 'dia'}">
            ${char.isNarrator ? '旁白' : '对话'}
          </span>
        </span>
        <span style="font-size:12px;color:var(--text-dim)">
          ${state.segments.filter(s => s.speaker === name).length} 段
        </span>
      </div>
      <textarea class="char-textarea" data-speaker="${name}"
        placeholder="描述这个角色的声音特征..."
        oninput="updateCharDesc('${name}', this.value)" onfocus="lastFocusedSpeaker='${name}'">${char.desc}</textarea>
    `;
    panel.appendChild(card);
  }

  renderSegmentsList();
}

function updateCharDesc(name, value) {
  if (state.characters[name]) state.characters[name].desc = value;
  lastFocusedSpeaker = name;
}

function renderSegmentsList() {
  const list = document.getElementById('segmentsList');
  document.getElementById('segmentCount').textContent = state.segments.length;
  list.innerHTML = state.segments.map(seg => `
    <div class="segment-item">
      <span class="segment-idx">#${seg.idx}</span>
      <span class="segment-type ${seg.type === 'narration' ? 'type-narration' : 'type-dialogue'}">
        ${seg.type === 'narration' ? '旁白' : seg.speaker}
      </span>
      <span class="segment-text">${seg.text.substring(0, 80)}${seg.text.length > 80 ? '...' : ''}</span>
    </div>
  `).join('');
}

// --- Presets ---
let lastFocusedSpeaker = null;

function applyPresetToActiveChar(presetKey) {
  const desc = PRESETS[presetKey];
  if (!desc) return;

  // Find the target: last focused textarea, or first character
  let targetSpeaker = lastFocusedSpeaker;
  if (!targetSpeaker || !state.characters[targetSpeaker]) {
    // Fallback: first character (narrator first, then others)
    targetSpeaker = Object.keys(state.characters)[0];
  }
  if (!targetSpeaker) return;

  state.characters[targetSpeaker].desc = desc;

  // Update the textarea directly if it exists
  const textarea = document.querySelector(`.char-textarea[data-speaker="${targetSpeaker}"]`);
  if (textarea) textarea.value = desc;
}

// --- Clear ---
function clearAll() {
  document.getElementById('textInput').value = '';
  state.segments = [];
  state.characters = {};
  state.audioBuffers = {};
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
}

// --- Audio Generation ---
async function generateAll() {
  if (!state.apiKey) return alert('请先保存 API Key');
  if (!state.segments.length) return alert('请先分段文本');

  // Validate all characters have descriptions
  for (const [name, char] of Object.entries(state.characters)) {
    if (!char.desc.trim()) {
      return alert(`请为「${name}」填写声音描述`);
    }
  }

  const btn = document.getElementById('generateBtn');
  const progressArea = document.getElementById('progressArea');
  btn.disabled = true;
  progressArea.classList.remove('hidden');

  const total = state.segments.length;
  let done = 0;
  const errors = [];

  for (const seg of state.segments) {
    const char = state.characters[seg.speaker];
    const progress = Math.round((done / total) * 100);
    document.getElementById('progressText').textContent =
      `生成中... (${done + 1}/${total}) — ${seg.speaker}: ${seg.text.substring(0, 20)}...`;
    document.getElementById('progressFill').style.width = progress + '%';

    try {
      const audioData = await callTTS(char.desc, seg.text);
      if (audioData) {
        const blob = base64ToBlob(audioData, 'audio/wav');
        const url = URL.createObjectURL(blob);
        state.audioBuffers[seg.idx] = { blob, url };
      }
    } catch (e) {
      console.error(`Segment ${seg.idx} failed:`, e);
      errors.push(`#${seg.idx} ${seg.speaker}: ${e.message}`);
    }
    done++;
  }

  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressText').textContent =
    errors.length ? `完成，${errors.length} 个失败` : `✅ 全部 ${total} 段生成完成`;

  btn.disabled = false;

  if (errors.length) {
    alert('部分段落生成失败：\n' + errors.join('\n'));
  }

  if (Object.keys(state.audioBuffers).length > 0) {
    renderStep3();
  }
}

async function callTTS(voiceDescription, text) {
  const url = state.proxyUrl
    ? state.proxyUrl.replace(/\/$/, '') + '/v1/chat/completions'
    : state.customBase
      ? state.customBase.replace(/\/$/, '') + '/v1/chat/completions'
      : state.apiRegion === 'cn' ? API_TOKEN_PLAN_CN : state.apiRegion === 'sgp' ? API_TOKEN_PLAN_SGP : API_STANDARD;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${state.apiKey}`,
    'api-key': state.apiKey,
  };

  const payload = {
    model: 'mimo-v2.5-tts-voicedesign',
    messages: [
      { role: 'user', content: voiceDescription },
      { role: 'assistant', content: text },
    ],
    audio: { format: 'wav' },
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${resp.status}: ${errText.substring(0, 500)}`);
  }

  const data = await resp.json();
  const audioData = data?.choices?.[0]?.message?.audio?.data;
  if (!audioData) throw new Error('响应中没有音频数据');
  return audioData;
}

function base64ToBlob(b64, mime) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// --- Render Step 3 ---
function renderStep3() {
  document.getElementById('step3').classList.remove('hidden');
  const list = document.getElementById('audioList');
  list.innerHTML = '';

  for (const seg of state.segments) {
    const buf = state.audioBuffers[seg.idx];
    if (!buf) continue;

    const item = document.createElement('div');
    item.className = 'audio-item';
    item.id = `audio-item-${seg.idx}`;
    item.innerHTML = `
      <div class="audio-label">
        #${seg.idx}
        <small>${seg.type === 'narration' ? '旁白' : seg.speaker}</small>
      </div>
      <audio controls src="${buf.url}" id="audio-${seg.idx}"></audio>
      <button class="btn btn-sm" onclick="downloadSingle(${seg.idx})">💾</button>
    `;
    list.appendChild(item);

    const audioEl = item.querySelector('audio');
    audioEl.addEventListener('play', () => {
      document.querySelectorAll('.audio-item').forEach(el => el.classList.remove('playing'));
      item.classList.add('playing');
    });
    audioEl.addEventListener('ended', () => {
      item.classList.remove('playing');
      playNext(seg.idx);
    });
  }
}

// --- Playback ---
function playAll() {
  stopAll();
  playNext(0);
}

function playNext(afterIdx) {
  const nextIdx = afterIdx + 1;
  const buf = state.audioBuffers[nextIdx];
  if (!buf) return;
  const audioEl = document.getElementById(`audio-${nextIdx}`);
  if (audioEl) audioEl.play();
}

function pauseAll() {
  document.querySelectorAll('#audioList audio').forEach(a => a.pause());
}

function stopAll() {
  document.querySelectorAll('#audioList audio').forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  document.querySelectorAll('.audio-item').forEach(el => el.classList.remove('playing'));
}

// --- Downloads ---
function downloadSingle(idx) {
  const buf = state.audioBuffers[idx];
  if (!buf) return;
  const seg = state.segments.find(s => s.idx === idx);
  const filename = `段${idx}_${seg?.speaker || 'audio'}.wav`;
  triggerDownload(buf.blob, filename);
}

function downloadAll() {
  const buffers = state.segments
    .filter(s => state.audioBuffers[s.idx])
    .map(s => ({ seg: s, buf: state.audioBuffers[s.idx] }));

  if (!buffers.length) return alert('没有可下载的音频');

  // Download individually (browser can't merge WAV without a library)
  for (const { seg, buf } of buffers) {
    const filename = `段${seg.idx}_${seg.speaker}.wav`;
    triggerDownload(buf.blob, filename);
  }
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
