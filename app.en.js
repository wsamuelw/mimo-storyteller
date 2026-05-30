// ============================================================
// Audiobook Snippet Generator — MiMo-V2.5-TTS (English)
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

// --- Presets (English voice descriptions) ---
const PRESETS = {
  'narrator':    'A calm, warm middle-aged male voice, moderate pace, clear articulation, like a late-night radio host, reassuring and steady.',
  'young-male':  'A young man in his twenties, bright and energetic voice, slightly fast pace, with a touch of youthful charm.',
  'young-female':'A young woman in her twenties, gentle and bright voice, natural pace, like a friendly next-door neighbor.',
  'elder-male':  'An elderly man in his sixties, deep and slightly raspy voice, slow pace, carrying the weight of years.',
  'elder-female':'An elderly woman in her sixties, warm and kind voice, slow pace, like someone telling a bedtime story.',
  'child':       'A seven or eight year old child, high-pitched and crisp voice, slightly fast pace, full of curiosity and innocence.',
  'villain':     'A deep, sinister male voice, slow pace, cold tone, carrying a sense of pressure and menace.',
  'hero':        'A deep, magnetic male voice, steady and powerful pace, resolute tone, conveying safety and strength.',
  'cantonese-m': 'A middle-aged male speaking Cantonese, steady voice, natural pace, like a local chatting in a tea house.',
  'cantonese-f': 'A young female speaking Cantonese, gentle and bright voice, lively pace, like shopping at the market.',
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  if (state.apiKey) document.getElementById('apiKey').value = state.apiKey;
  if (state.proxyUrl) document.getElementById('proxyUrl').value = state.proxyUrl;
  document.getElementById('apiRegion').value = state.apiRegion;
  if (state.customBase) document.getElementById('customBase').value = state.customBase;
  document.querySelectorAll('.preset-btn').forEach(btn => {
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
  if (!key) return alert('Please enter an API Key');
  state.apiKey = key;
  localStorage.setItem('mimo_api_key', key);
  alert('✅ API Key saved');
}

// --- Proxy ---
function saveProxyAndClose() {
  const url = document.getElementById('proxyUrl').value.trim();
  state.proxyUrl = url;
  localStorage.setItem('mimo_proxy_url', url);
  document.getElementById('corsModal').classList.add('hidden');
}

function closeModal() {
  document.getElementById('corsModal').classList.add('hidden');
}

// --- Text Segmentation ---
function segmentText() {
  const raw = document.getElementById('textInput').value.trim();
  if (!raw) return alert('Please paste some text first');

  const segments = [];
  const lines = raw.split('\n').filter(l => l.trim());

  let buffer = '';
  let lastSpeaker = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Dialogue: 「...」or "..."
    const dialogueMatch = trimmed.match(/^["「](.+?)["」]\s*[:：]?\s*(.*)$/);
    const dialogueInline = trimmed.match(/^(.+?)\s*[:：]\s*["「](.+?)["」]/);

    if (dialogueMatch) {
      if (buffer.trim()) {
        segments.push({ idx: segments.length + 1, type: 'narration', speaker: 'Narrator', text: buffer.trim() });
        buffer = '';
      }
      const text = dialogueMatch[1];
      const speaker = dialogueMatch[2] || lastSpeaker || 'Unknown';
      lastSpeaker = speaker;
      segments.push({ idx: segments.length + 1, type: 'dialogue', speaker, text });
    } else if (dialogueInline) {
      if (buffer.trim()) {
        segments.push({ idx: segments.length + 1, type: 'narration', speaker: 'Narrator', text: buffer.trim() });
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
    segments.push({ idx: segments.length + 1, type: 'narration', speaker: 'Narrator', text: buffer.trim() });
  }

  if (!segments.length) return alert('No segments found. Check your text format.');

  state.segments = segments;
  buildCharacters();
  renderStep2();
}

function buildCharacters() {
  const chars = {};
  for (const seg of state.segments) {
    if (!chars[seg.speaker]) {
      chars[seg.speaker] = {
        desc: seg.speaker === 'Narrator' ? PRESETS['narrator'] : '',
        isNarrator: seg.speaker === 'Narrator',
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
      <div class="char-header">
        <span class="char-name">
          ${char.isNarrator ? '📖' : '🎭'} ${name}
          <span class="char-badge ${char.isNarrator ? 'narrator-badge' : 'dialogue-badge'}">
            ${char.isNarrator ? 'Narrator' : 'Dialogue'}
          </span>
        </span>
        <span style="font-size:12px;color:var(--text-dim)">
          ${state.segments.filter(s => s.speaker === name).length} segments
        </span>
      </div>
      <textarea class="char-textarea" data-speaker="${name}"
        placeholder="Describe this character's voice..."
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
        ${seg.type === 'narration' ? 'Narrator' : seg.speaker}
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

  let targetSpeaker = lastFocusedSpeaker;
  if (!targetSpeaker || !state.characters[targetSpeaker]) {
    targetSpeaker = Object.keys(state.characters)[0];
  }
  if (!targetSpeaker) return;

  state.characters[targetSpeaker].desc = desc;

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
  if (!state.apiKey) return alert('Please save your API Key first');
  if (!state.segments.length) return alert('Please segment your text first');

  for (const [name, char] of Object.entries(state.characters)) {
    if (!char.desc.trim()) {
      return alert(`Please fill in a voice description for "${name}"`);
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
      `Generating... (${done + 1}/${total}) — ${seg.speaker}: ${seg.text.substring(0, 20)}...`;
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
    errors.length ? `Done, ${errors.length} failed` : `✅ All ${total} segments generated`;

  btn.disabled = false;

  if (errors.length) {
    alert('Some segments failed:\n' + errors.join('\n'));
  }

  if (Object.keys(state.audioBuffers).length > 0) {
    renderStep3();
  }
}

async function callTTS(voiceDescription, text) {
  // Detect dialect from voice description and prepend style tag
  let dialect = '';
  if (/粤语|cantonese/i.test(voiceDescription)) dialect = '粤语';
  else if (/上海话|shanghainese/i.test(voiceDescription)) dialect = '上海话';
  else if (/四川话|sichuan/i.test(voiceDescription)) dialect = '四川话';
  else if (/东北话|dongbei/i.test(voiceDescription)) dialect = '东北话';
  else if (/台湾话|taiwanese|hokkien/i.test(voiceDescription)) dialect = '台湾闽南话';
  else if (/河南话|henan/i.test(voiceDescription)) dialect = '河南话';

  const styledText = dialect ? `<style>${dialect}</style>${text}` : text;

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
      { role: 'assistant', content: styledText },
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
  if (!audioData) throw new Error('No audio data in response');
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
        <small>${seg.type === 'narration' ? 'Narrator' : seg.speaker}</small>
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
  const filename = `segment${idx}_${seg?.speaker || 'audio'}.wav`;
  triggerDownload(buf.blob, filename);
}

function downloadAll() {
  const buffers = state.segments
    .filter(s => state.audioBuffers[s.idx])
    .map(s => ({ seg: s, buf: state.audioBuffers[s.idx] }));

  if (!buffers.length) return alert('No audio to download');

  for (const { seg, buf } of buffers) {
    const filename = `segment${seg.idx}_${seg.speaker}.wav`;
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
