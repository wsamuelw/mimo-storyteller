// ============================================================
// MiMo Storyteller — MiMo-V2.5-TTS
// ============================================================

const NARRATOR_KEY = '__narrator__';
const API_STANDARD = 'https://api.xiaomimimo.com/v1/chat/completions';
const API_TOKEN_PLAN_CN = 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions';
const API_TOKEN_PLAN_SGP = 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions';

// --- State ---
let state = {
  apiRegion: localStorage.getItem('mimo_api_region') || 'sgp',
  customBase: localStorage.getItem('mimo_custom_base') || '',
  apiKey: sessionStorage.getItem('mimo_api_key') || '',
  proxyUrl: localStorage.getItem('mimo_proxy_url') || '',
  segments: [],       // { idx, type, speaker, text }
  characters: {},     // speakerName -> { desc, isNarrator }
  audioBuffers: {},   // idx -> { blob, url }
  generating: false,
  abortController: null,
  lastFocusedSpeaker: null,
  storyReader: {
    enabled: true,
    currentIndex: 0,
    startTime: null,
    animFrame: null,
    playbackRate: 1,
    volume: 1,
    prevVolume: 1,
    autoScroll: true,
    wordCounts: null,
    prefixSums: null,
    totalWords: 0,
    cachedCharSpans: null,
  },
};

// --- Presets (language-aware) ---
const PRESETS = {
  'zh-CN': {
    'narrator':    '一个沉稳温和的中年男性声音，语速适中，吐字清晰，像深夜电台主播，给人安定感。',
    'young-male':  '一个二十多岁的年轻男性，声音清朗有活力，语速偏快，带一点少年感。',
    'young-female':'一个二十多岁的年轻女性，声音温柔明亮，语速自然，像邻家姐姐。',    'child':       '一个七八岁的小孩，声音稚嫩清脆，语速稍快，充满好奇和天真。',
    'villain':     '一个阴险低沉的男性声音，语速缓慢，语气冰冷，带着压迫感和威胁。',
    'hero':        '一个磁性浑厚的男性声音，语速沉稳有力，语气坚定，给人安全感。',
    'gentle-female':'一个三十多岁的温柔女性，声音知性温暖，像在讲睡前故事。',
    'energetic-male':'一个十几岁的少年，声音充满朝气，语速偏快，带着少年的热血。',
    'news-anchor': '一个专业新闻主播，字正腔圆，语速平稳，正式严肃。',
    'storyteller': '一个说书人，抑扬顿挫，富有戏剧性，像在茶馆里讲评书。',
    'mysterious':  '一个低沉沙哑的声音，语速缓慢，带着神秘感，像深夜的讲述者。',
    'flirty':      '一个成熟女性，声音慵懒迷人，带一丝挑逗，让人无法抗拒。',
    'seductive':   '一个低沉磁性的女声，语速缓慢，像在耳边低语，充满诱惑。',
    'domina':      '一个冷艳高傲的女性，语气居高临下，不容置疑，像女王发号施令。',
    'tsundere':    '一个年轻女性，嘴硬心软，语气又凶又可爱，明明关心却要装作不在乎。',
    'yandere':     '一个年轻女性，表面温柔甜美，实则疯狂偏执，让人毛骨悚然。',    'onee-san':    '一个成熟女性，温柔大方，像大姐姐在照顾你，让人感到安心。',
    'kuudere':     '一个年轻女性，声音平淡无波，面无表情，像冰山美人。',
    'ojou-sama':   '一个富家千金，语气高傲优雅，带着优越感，像在俯视平民。',    'nurse':       '一个温柔的女护士，声音关切体贴，像在安慰生病的你。',
    'secretary':   '一个干练的女秘书，声音利落专业，一丝不苟地汇报工作。',
    'ex-girlfriend':'一个年轻女性，声音冷淡疏离，带着怨气和不甘。',    'luxury':      '一个成熟名媛，优雅从容，声音里带着红酒和香水的味道。',
    'whisper':     '极轻柔的气声，像在耳边说秘密，让人忍不住凑近去听。',
  },
  'zh-TW': {
    'narrator':    '一個沉穩溫和的中年男性聲音，語速適中，吐字清晰，像深夜電台主播，給人安定感。',
    'young-male':  '一個二十多歲的年輕男性，聲音清朗有活力，語速偏快，帶一點少年感。',
    'young-female':'一個二十多歲的年輕女性，聲音溫柔明亮，語速自然，像鄰家姐姐。',    'child':       '一個七八歲的小孩，聲音稚嫩清脆，語速稍快，充滿好奇和天真。',
    'villain':     '一個陰險低沉的男性聲音，語速緩慢，語氣冰冷，帶著壓迫感和威脅。',
    'hero':        '一個磁性渾厚的男性聲音，語速沉穩有力，語氣堅定，給人安全感。',
    'gentle-female':'一個三十多歲的溫柔女性，聲音知性溫暖，像在講睡前故事。',
    'energetic-male':'一個十幾歲的少年，聲音充滿朝氣，語速偏快，帶著少年的熱血。',
    'news-anchor': '一個專業新聞主播，字正腔圓，語速平穩，正式嚴肅。',
    'storyteller': '一個說書人，抑揚頓挫，富有戲劇性，像在茶館裡講評書。',
    'mysterious':  '一個低沉沙啞的聲音，語速緩慢，帶著神秘感，像深夜的講述者。',
    'flirty':      '一個成熟女性，聲音慵懶迷人，帶一絲挑逗，讓人無法抗拒。',
    'seductive':   '一個低沉磁性的女聲，語速緩慢，像在耳邊低語，充滿誘惑。',
    'domina':      '一個冷豔高傲的女性，語氣居高臨下，不容置疑，像女王發號施令。',
    'tsundere':    '一個年輕女性，嘴硬心軟，語氣又凶又可愛，明明關心卻要裝作不在乎。',
    'yandere':     '一個年輕女性，表面溫柔甜美，實則瘋狂偏執，讓人毛骨悚然。',    'onee-san':    '一個成熟女性，溫柔大方，像大姐姐在照顧你，讓人感到安心。',
    'kuudere':     '一個年輕女性，聲音平淡無波，面無表情，像冰山美人。',
    'ojou-sama':   '一個富家千金，語氣高傲優雅，帶著優越感，像在俯視平民。',    'nurse':       '一個溫柔的女護士，聲音關切體貼，像在安慰生病的你。',
    'secretary':   '一個幹練的女秘書，聲音利落專業，一絲不苟地匯報工作。',
    'ex-girlfriend':'一個年輕女性，聲音冷淡疏離，帶著怨氣和不甘。',    'luxury':      '一個成熟名媛，優雅從容，聲音裡帶著紅酒和香水的味道。',
    'whisper':     '極輕柔的氣聲，像在耳邊說秘密，讓人忍不住湊近去聽。',
  },
  'en': {
    'narrator':    'A calm, warm middle-aged male voice, moderate pace, clear articulation, like a late-night radio host.',
    'young-male':  'A man in his twenties, clear and energetic voice, slightly fast pace, with a youthful feel.',
    'young-female':'A woman in her twenties, gentle and bright voice, natural pace, like a friendly neighbor.',    'child':       'A seven or eight year old child, tender and crisp voice, slightly fast, full of curiosity and innocence.',
    'villain':     'A sinister, deep male voice, slow pace, cold tone, with a sense of pressure and threat.',
    'hero':        'A magnetic, resonant male voice, steady and powerful pace, firm tone, giving a sense of security.',
    'gentle-female':'A gentle woman in her thirties, intellectual and warm voice, like telling a bedtime story.',
    'energetic-male':'A teenager, voice full of energy, slightly fast pace, with youthful passion.',
    'news-anchor': 'A professional news anchor, precise articulation, steady pace, formal and serious.',
    'storyteller': 'A storyteller, dramatic and expressive, like performing in a teahouse.',
    'mysterious':  'A low, raspy voice, slow pace, with a sense of mystery, like a late-night narrator.',
    'flirty':      'A mature woman, lazy and charming voice, with a hint of teasing, irresistible.',
    'seductive':   'A low, magnetic female voice, slow pace, like whispering in your ear, full of seduction.',
    'domina':      'A cold, arrogant woman, condescending tone, unquestionable, like a queen giving orders.',
    'tsundere':    'A young woman, tough on the outside but soft inside, acts fierce but cute, pretends not to care.',
    'yandere':     'A young woman, gentle and sweet on the surface, actually obsessive and paranoid.',    'onee-san':    'A mature woman, gentle and generous, like a big sister taking care of you.',
    'kuudere':     'A young woman, flat and expressionless voice, like an ice-cold beauty.',
    'ojou-sama':   'A wealthy young lady, arrogant and elegant tone, with a sense of superiority.',    'nurse':       'A gentle nurse, caring and considerate voice, like comforting a sick patient.',
    'secretary':   'A capable secretary, crisp and professional voice, reporting work meticulously.',
    'ex-girlfriend':'A young woman, cold and distant voice, with resentment and unwillingness.',    'luxury':      'A mature socialite, elegant and composed voice, with the scent of red wine and perfume.',
    'whisper':     'Extremely soft whispering voice, like telling a secret in your ear.',
  },
};

function getPreset(key) {
  return PRESETS[currentLang]?.[key] || PRESETS['zh-CN']?.[key] || '';
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  // Init language
  setLang(currentLang);

  // Init settings modal
  if (state.apiKey) document.getElementById('apiKey').value = state.apiKey;
  document.getElementById('apiRegion').value = state.apiRegion;
  if (state.customBase) {
    document.getElementById('customBase').value = state.customBase;
    document.getElementById('useCustomBase').checked = true;
    document.getElementById('customBaseGroup').classList.remove('hidden');
  }
  if (state.proxyUrl) {
    document.getElementById('proxyUrl').value = state.proxyUrl;
    document.getElementById('useProxy').checked = true;
    document.getElementById('proxyGroup').classList.remove('hidden');
  }

  // Prompt for API key if missing
  if (!state.apiKey) {
    showToast(t('enterApiKey'), 'warning');
  }

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });

  // Close modal on overlay click
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSettings();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;
      applyPresetToActiveChar(preset);
    });
  });

  // Revoke blob URLs when tab closes
  window.addEventListener('beforeunload', () => {
    for (const buf of Object.values(state.audioBuffers)) {
      if (buf?.url) URL.revokeObjectURL(buf.url);
    }
    if (_previewUrl) URL.revokeObjectURL(_previewUrl);
  });

  // Network status monitoring
  window.addEventListener('offline', () => showToast(t('offlineError'), 'error'));
  window.addEventListener('online', () => showToast(t('onlineRestored') || 'Connection restored', 'success'));

  // Clear validation errors on input
  document.getElementById('textInput').addEventListener('input', function() { clearFieldError(this); });
  document.getElementById('apiKey').addEventListener('input', function() { clearFieldError(this); });

  // Auto-scroll: disable on manual scroll, re-enable on play
  const storyText = document.getElementById('storyReaderText');
  if (storyText) {
    storyText.addEventListener('scroll', () => {
      state.storyReader.autoScroll = false;
    }, { passive: true });
  }

  // Animate generate button only when visible
  const genBtn = document.getElementById('generateBtn');
  if (genBtn && 'IntersectionObserver' in window) {
    const genObserver = new IntersectionObserver(([entry]) => {
      genBtn.classList.toggle('animate', entry.isIntersecting);
    }, { threshold: 0.1 });
    genObserver.observe(genBtn);
  }

});

// --- Storage helper ---
function safeSetItem(storage, key, value) {
  try { storage.setItem(key, value); } catch (e) {
    console.error('Storage write failed:', e);
    showToast(t('storageError'), 'warning');
  }
}

// --- API Key ---
function changeRegion() {
  state.apiRegion = document.getElementById('apiRegion').value;
  safeSetItem(localStorage, 'mimo_api_region', state.apiRegion);
}

function toggleMorePresets(btn) {
  const el = document.getElementById('morePresets');
  el.classList.toggle('show');
  const expanded = el.classList.contains('show');
  btn.textContent = expanded ? t('lessPresets') : t('morePresets');
  btn.setAttribute('aria-expanded', expanded);
}

function toggleAdvanced() {
  const section = document.getElementById('advancedSection');
  const arrow = document.getElementById('advancedArrow');
  const isOpen = section.classList.toggle('hidden') === false;
  arrow.classList.toggle('open', isOpen);
}

function toggleCustomBase() {
  const checked = document.getElementById('useCustomBase').checked;
  document.getElementById('customBaseGroup').classList.toggle('hidden', !checked);
  if (!checked) {
    state.customBase = '';
    document.getElementById('customBase').value = '';
    safeSetItem(localStorage, 'mimo_custom_base', '');
  }
}

function toggleProxy() {
  const checked = document.getElementById('useProxy').checked;
  document.getElementById('proxyGroup').classList.toggle('hidden', !checked);
  if (!checked) {
    state.proxyUrl = '';
    document.getElementById('proxyUrl').value = '';
    safeSetItem(localStorage, 'mimo_proxy_url', '');
  }
}

let _customBaseTimer, _proxyUrlTimer;

function isValidUrl(str) {
  if (!str) return true;
  try { const u = new URL(str); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
}

function saveCustomBase() {
  clearTimeout(_customBaseTimer);
  _customBaseTimer = setTimeout(() => {
    const val = document.getElementById('customBase').value.trim();
    if (val && !isValidUrl(val)) return showToast(t('invalidUrl'), 'warning');
    state.customBase = val;
    safeSetItem(localStorage, 'mimo_custom_base', val);
  }, 500);
}

function saveProxyUrl() {
  clearTimeout(_proxyUrlTimer);
  _proxyUrlTimer = setTimeout(() => {
    const url = document.getElementById('proxyUrl').value.trim();
    if (url && !isValidUrl(url)) return showToast(t('invalidUrl'), 'warning');
    state.proxyUrl = url;
    safeSetItem(localStorage, 'mimo_proxy_url', url);
  }, 500);
}

function saveApiKey() {
  const input = document.getElementById('apiKey');
  const key = input.value.trim();
  clearFieldError(input);

  if (!key) {
    showFieldError(input, t('enterApiKey'));
    return showToast(t('enterApiKey'), 'warning');
  }
  if (key.length < 8) {
    showFieldError(input, t('apiKeyTooShort'));
    return;
  }
  state.apiKey = key;
  safeSetItem(sessionStorage, 'mimo_api_key', key);
  localStorage.removeItem('mimo_api_key'); // migrate away from persistent storage
  showToast(t('apiKeySaved'), 'success');
}

// --- Settings Modal ---
let _previousFocus = null;

function openSettings() {
  _previousFocus = document.activeElement;
  const modal = document.getElementById('settingsModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Focus first input in modal
  const firstInput = modal.querySelector('input, button, select, textarea');
  if (firstInput) firstInput.focus();
  // Trap focus
  modal.addEventListener('keydown', _trapFocus);
}

function closeSettings() {
  const modal = document.getElementById('settingsModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', _trapFocus);
  if (_previousFocus) _previousFocus.focus();
}

function _trapFocus(e) {
  if (e.key !== 'Tab') return;
  const modal = document.getElementById('settingsModal');
  const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function saveSettings() {
  saveApiKey();
  closeSettings();
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKey');
  const btn = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
    btn.setAttribute('aria-label', t('ariaHideKey'));
  } else {
    input.type = 'password';
    btn.textContent = '👁';
    btn.setAttribute('aria-label', t('ariaShowKey'));
  }
}

// --- Proxy ---

// --- XSS protection ---
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// --- Display name helper ---
function displayName(speaker) {
  return speaker === NARRATOR_KEY ? t('narratorLabel') : speaker;
}

// --- Toast notifications ---
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  // Use assertive for errors, polite for others
  container.setAttribute('role', type === 'error' ? 'alert' : 'status');
  container.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.cursor = 'pointer';
  toast.setAttribute('role', 'button');
  toast.setAttribute('aria-label', t('ariaDismiss') + ': ' + message);
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  // Error toasts stay until clicked; others auto-dismiss
  if (type !== 'error') {
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

// --- Inline validation helpers ---
function showFieldError(el, message) {
  el.classList.add('input-error');
  // Remove existing error message for this element
  const existing = el.parentElement.querySelector('.error-message');
  if (existing) existing.remove();
  const msg = document.createElement('p');
  msg.className = 'error-message';
  msg.textContent = '⚠ ' + message;
  el.parentElement.appendChild(msg);
}

function clearFieldError(el) {
  el.classList.remove('input-error');
  const msg = el.parentElement.querySelector('.error-message');
  if (msg) msg.remove();
}

// --- Text Segmentation ---
function parseSegments(raw) {
  const segments = [];
  const lines = raw.split('\n').filter(l => l.trim());
  let buffer = '';
  let lastSpeaker = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[【\[][^】\]]*[】\]]$|^[-*]{3,}$|^—{3,}$/.test(trimmed)) continue;

    const m1 = trimmed.match(/^([^\s：:]{1,10})[：:]\s*(.+)$/);
    if (m1) {
      if (buffer.trim()) { segments.push({ idx: segments.length + 1, type: 'narration', speaker: NARRATOR_KEY, text: buffer.trim() }); buffer = ''; }
      lastSpeaker = m1[1].trim();
      segments.push({ idx: segments.length + 1, type: 'dialogue', speaker: lastSpeaker, text: m1[2].trim() });
      continue;
    }

    const m2 = trimmed.match(/^["「『'"](.+?)["」』'""][：:]?\s*(.*)$/);
    if (m2) {
      if (buffer.trim()) { segments.push({ idx: segments.length + 1, type: 'narration', speaker: NARRATOR_KEY, text: buffer.trim() }); buffer = ''; }
      const afterQuote = m2[2].trim();
      const speaker = afterQuote || lastSpeaker || t('unknownSpeaker');
      if (afterQuote) lastSpeaker = afterQuote;
      segments.push({ idx: segments.length + 1, type: 'dialogue', speaker, text: m2[1].trim() });
      continue;
    }

    buffer += (buffer ? '\n' : '') + trimmed;
  }

  if (buffer.trim()) segments.push({ idx: segments.length + 1, type: 'narration', speaker: NARRATOR_KEY, text: buffer.trim() });
  return segments;
}

function segmentText() {
  const ta = document.getElementById('textInput');
  const raw = ta.value.trim();
  clearFieldError(ta);

  if (!raw) {
    showFieldError(ta, t('enterTextFirst'));
    showToast(t('enterTextFirst'), 'warning');
    return;
  }

  const segments = parseSegments(raw);
  if (!segments.length) return showToast(t('noSegmentsFound'), 'error');
  if (segments.length > 200) return showToast(t('tooManySegments', segments.length), 'error');
  if (segments.length > 50) showToast(t('manySegments', segments.length), 'warning');

  state.segments = segments;
  buildCharacters();
  renderStep2();
}

function buildCharacters() {
  const chars = {};
  const speakerKeys = Object.keys(PRESETS['zh-CN']).filter(k => k !== 'narrator');
  let dialogueIdx = 0;
  for (const seg of state.segments) {
    if (!chars[seg.speaker]) {
      const isNarrator = seg.speaker === NARRATOR_KEY;
      // Assign alternating default presets to dialogue characters
      const defaultKey = isNarrator ? 'narrator' : speakerKeys[dialogueIdx % speakerKeys.length];
      if (!isNarrator) dialogueIdx++;
      chars[seg.speaker] = {
        desc: getPreset(defaultKey),
        isNarrator,
        presetKey: defaultKey,
      };
    }
  }
  state.characters = chars;
}

// --- Render Step 2 ---
function renderStep2() {
  const step2 = document.getElementById('step2');
  step2.classList.remove('hidden');
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('progressArea').classList.add('hidden');
  // Scroll to new content
  setTimeout(() => step2.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

  const panel = document.getElementById('charactersPanel');
  panel.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (const [name, char] of Object.entries(state.characters)) {
    const card = document.createElement('div');
    card.className = `char-card ${char.isNarrator ? 'narrator' : ''}`;
    const charDisplayName = char.isNarrator ? t('narratorLabel') : escapeHtml(name);
    const safeDesc = escapeHtml(char.desc);
    card.innerHTML = `
      <div class="char-header">
        <span class="char-name">
          ${charDisplayName}
          <span class="char-badge ${char.isNarrator ? 'narrator-badge' : 'dialogue-badge'}">
            ${char.isNarrator ? t('narratorLabel') : t('dialogueLabel')}
          </span>
        </span>
        <span style="font-size:13px;color:var(--text-dim)">
          ${t('segmentCount', state.segments.filter(s => s.speaker === name).length)}
        </span>
      </div>
      <div class="char-preset-row">
        ${getPresetBadgeHTML(char)}
        <button class="voice-preview-btn" data-speaker="${escapeHtml(name)}" title="${t('ariaPreviewVoice')}" aria-label="${t('ariaPreviewVoice')}">▶</button>
      </div>
      <textarea class="char-textarea" data-speaker="${escapeHtml(name)}"
        placeholder="${t('charPlaceholder')}"
        aria-label="${t('charPlaceholder')} — ${charDisplayName}">${safeDesc}</textarea>
    `;

    // Attach event listeners before appending
    const ta = card.querySelector('.char-textarea');
    ta.addEventListener('input', () => {
      updateCharDesc(name, ta.value);
      if (char.presetKey) {
        char.presetKey = null;
        const badge = card.querySelector('.preset-indicator');
        if (badge) {
          badge.className = 'preset-indicator custom-preset';
          badge.textContent = '✏️ ' + (t('customVoice') || 'Custom');
        }
      }
    });
    ta.addEventListener('focus', () => {
      state.lastFocusedSpeaker = name;
      // Highlight selected card
      document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });

    // Voice preview button
    const previewBtn = card.querySelector('.voice-preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => previewVoice(previewBtn, name));
    }

    fragment.appendChild(card);
  }

  panel.appendChild(fragment);

  renderSegmentsList();
}

function updateCharDesc(name, value) {
  if (state.characters[name]) state.characters[name].desc = value;
  state.lastFocusedSpeaker = name;
}

function renderSegmentsList() {
  const list = document.getElementById('segmentsList');
  const chipsContainer = document.getElementById('summaryChips');
  const expandToggle = document.getElementById('segmentExpandToggle');
  document.getElementById('segmentCount').textContent = state.segments.length;

  if (state.segments.length === 0) {
    list.innerHTML = `<p class="segments-empty" data-i18n="segmentsEmpty">${t('segmentsEmpty')}</p>`;
    chipsContainer.style.display = 'none';
    expandToggle.style.display = 'none';
    list.classList.remove('expanded');
    return;
  }

  // Show summary chips
  const counts = {};
  state.segments.forEach(seg => {
    const key = seg.type === 'narration' ? 'narrator' : seg.speaker;
    counts[key] = (counts[key] || 0) + 1;
  });

  const chipLabels = {
    'narrator': `🗣️ ${t('narratorLabel')}`,
    [NARRATOR_KEY]: `📖 STORY`,
  };

  chipsContainer.innerHTML = Object.entries(counts).map(([speaker, count]) => {
    const label = chipLabels[speaker] || `💬 ${speaker}`;
    const cssClass = speaker === 'narrator' || speaker === NARRATOR_KEY ? 'narrator' : 'dialogue';
    return `<span class="summary-chip ${cssClass}">${label} · ${count}</span>`;
  }).join('');
  chipsContainer.style.display = '';

  // Show expand toggle
  expandToggle.style.display = '';
  expandToggle.classList.remove('open');
  document.getElementById('segmentExpandText').textContent = t('segmentListShow');
  list.classList.remove('expanded');

  // Render segment items
  list.innerHTML = state.segments.map(seg => `
    <div class="segment-item">
      <span class="segment-idx">#${seg.idx}</span>
      <span class="segment-type ${seg.type === 'narration' ? 'type-narration' : 'type-dialogue'}">
        ${seg.type === 'narration' ? t('narratorLabel') : escapeHtml(seg.speaker)}
      </span>
      <span class="segment-text" title="${escapeHtml(seg.text)}">${escapeHtml(seg.text.substring(0, 80))}${seg.text.length > 80 ? '...' : ''}</span>
    </div>
  `).join('');
}

function toggleSegmentExpand() {
  const toggle = document.getElementById('segmentExpandToggle');
  const list = document.getElementById('segmentsList');
  const text = document.getElementById('segmentExpandText');
  const isOpen = toggle.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  list.classList.toggle('expanded', isOpen);
  text.textContent = isOpen ? t('segmentListHide') : t('segmentListShow');
}

// --- Preset badge helper ---
function getPresetBadgeHTML(char) {
  if (char.presetKey) {
    const label = t('preset' + char.presetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
    const isNarrator = char.presetKey === 'narrator';
    const cssClass = isNarrator ? 'narrator-preset' : '';
    return `<div class="preset-indicator ${cssClass}">${label}</div>`;
  }
  return `<div class="preset-indicator custom-preset">✏️ ${t('customVoice') || 'Custom'}</div>`;
}

// --- Presets ---
function applyPresetToActiveChar(presetKey) {
  const desc = getPreset(presetKey);
  if (!desc) return;

  // Find the target: last focused textarea, or first character
  let targetSpeaker = state.lastFocusedSpeaker;
  if (!targetSpeaker || !state.characters[targetSpeaker]) {
    // Fallback: first character (narrator first, then others)
    targetSpeaker = Object.keys(state.characters)[0];
  }
  if (!targetSpeaker) return;

  state.characters[targetSpeaker].desc = desc;
  state.characters[targetSpeaker].presetKey = presetKey;

  // Find the textarea directly by data-speaker
  const ta = document.querySelector(`.char-textarea[data-speaker="${CSS.escape(targetSpeaker)}"]`);
  if (!ta) return;

  // Update the preset badge in the parent card
  const card = ta.closest('.char-card');
  if (card) {
    const badge = card.querySelector('.preset-indicator');
    if (badge) {
      const isNarrator = presetKey === 'narrator';
      const label = t('preset' + presetKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
      badge.className = 'preset-indicator' + (isNarrator ? ' narrator-preset' : '');
      badge.textContent = label;
    }
  }

  // Update the textarea value
  ta.value = desc;
}

// --- Clear ---
function clearAll() {
  if (state.segments.length > 0 && !confirm(t('confirmClear'))) return;
  // Revoke blob URLs to free memory
  for (const buf of Object.values(state.audioBuffers)) {
    if (buf?.url) URL.revokeObjectURL(buf.url);
  }
  document.getElementById('textInput').value = '';
  state.segments = [];
  state.characters = {};
  state.audioBuffers = {};
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
}

// --- Audio Generation ---
function handleGenBtn() {
  if (state.generating) {
    cancelGeneration();
  } else {
    generateAll();
  }
}

// --- UI Helpers ---
function setGeneratingUI(active) {
  const btn = document.getElementById('generateBtn');
  const progressArea = document.getElementById('progressArea');
  if (active) {
    state.generating = true;
    state.abortController = new AbortController();
    btn.disabled = false;
    btn.classList.remove('btn-loading');
    btn.classList.add('btn-cancel');
    btn.textContent = t('cancelBtn');
    btn.setAttribute('aria-label', t('ariaCancelBtn'));
    progressArea.classList.remove('hidden');
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = '0%';
    progressFill.style.background = '';
    progressFill.style.boxShadow = '';
  } else {
    btn.disabled = false;
    btn.classList.remove('btn-cancel');
    btn.removeAttribute('aria-busy');
    btn.textContent = t('generateBtn');
    btn.setAttribute('aria-label', t('ariaGenerateBtn'));
    state.generating = false;
    state.abortController = null;
  }
}

function updateProgressUI(seg, done, total) {
  const pct = Math.round((done / total) * 100);
  document.getElementById('progressText').textContent =
    t('generating', done, total, displayName(seg.speaker), seg.text.substring(0, 20));
  document.getElementById('progressText').setAttribute('aria-valuenow', pct);
  document.getElementById('progressFill').style.width = pct + '%';
}

function showGenerationErrors(errors) {
  if (!errors.length) return;
  const progressFill = document.getElementById('progressFill');
  progressFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ff4444)';
  progressFill.style.boxShadow = '0 0 12px rgba(255,100,100,.3)';
  showToast(t('errorsTitle') + ' ' + errors.join(', '), 'error', 5000);
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) retryBtn.classList.remove('hidden');
}

async function runWithConcurrency(tasks, concurrency, fn) {
  const queue = [...tasks];
  const running = new Set();
  await new Promise((resolve) => {
    function startNext() {
      if (queue.length === 0 && running.size === 0) { resolve(); return; }
      while (queue.length > 0 && running.size < concurrency) {
        const task = queue.shift();
        const promise = fn(task).finally(() => { running.delete(promise); startNext(); });
        running.add(promise);
      }
    }
    startNext();
  });
}

// --- Audio Generation ---
async function generateAll(segmentsToProcess) {
  if (state.generating) return;
  if (!navigator.onLine) return showToast(t('offlineError'), 'error');
  if (!state.apiKey) return showToast(t('enterApiKey'), 'warning');

  const sourceSegments = segmentsToProcess || state.segments;
  if (!sourceSegments.length) return showToast(t('enterTextFirst'), 'warning');

  // Clear previous errors on all voice textareas
  document.querySelectorAll('.char-textarea').forEach(ta => clearFieldError(ta));
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('input-error'));

  for (const [name, char] of Object.entries(state.characters)) {
    if (!char.desc.trim()) {
      // Highlight the empty textarea and scroll to it
      const ta = document.querySelector(`.char-textarea[data-speaker="${CSS.escape(name)}"]`);
      if (ta) {
        showFieldError(ta, t('fillVoiceDesc', displayName(name)));
        ta.closest('.char-card')?.classList.add('input-error');
        ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ta.focus();
      }
      showToast(t('fillVoiceDesc', displayName(name)), 'warning');
      return;
    }
  }

  setGeneratingUI(true);

  const segmentsSnapshot = [...sourceSegments];
  const charactersSnapshot = JSON.parse(JSON.stringify(state.characters));
  const total = segmentsSnapshot.length;
  let done = 0;
  const errors = [];
  state.failedSegments = [];

  await runWithConcurrency(segmentsSnapshot, 3, async (seg) => {
    const char = charactersSnapshot[seg.speaker];
    try {
      const audioData = await callTTSWithRetry(char.desc, seg.text, 3, state.abortController.signal);
      if (audioData) {
        if (state.audioBuffers[seg.idx]?.url) URL.revokeObjectURL(state.audioBuffers[seg.idx].url);
        const blob = await base64ToBlob(audioData, 'audio/wav');
        state.audioBuffers[seg.idx] = { blob, url: URL.createObjectURL(blob) };
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
      console.error(`Segment ${seg.idx} failed:`, e);
      errors.push(`#${seg.idx} ${displayName(seg.speaker)}: ${e.message}`);
      state.failedSegments.push(seg.idx);
    }
    done++;
    updateProgressUI(seg, done, total);
  });

  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressText').textContent =
    errors.length ? t('doneWithErrors', errors.length) : t('done', total);

  setGeneratingUI(false);
  showGenerationErrors(errors);

  if (Object.keys(state.audioBuffers).length > 0) renderStep3();
}

function cancelGeneration() {
  if (state.abortController) {
    state.abortController.abort();
    showToast(t('cancelled'), 'info');
    setGeneratingUI(false);
  }
}

function retryFailed() {
  if (!state.failedSegments || state.failedSegments.length === 0) return;
  if (state.generating) return showToast(t('alreadyGenerating'), 'warning');
  // Filter to only failed segments without mutating state
  const failedIdxs = new Set(state.failedSegments);
  const segmentsToRetry = state.segments.filter(s => failedIdxs.has(s.idx));
  state.failedSegments = [];
  document.getElementById('retryBtn').classList.add('hidden');
  // Run generation for failed segments only (pass as parameter, no mutation)
  generateAll(segmentsToRetry);
}

// --- API helpers ---
function buildApiUrl() {
  return state.proxyUrl
    ? state.proxyUrl.replace(/\/$/, '') + '/v1/chat/completions'
    : state.customBase
      ? state.customBase.replace(/\/$/, '') + '/v1/chat/completions'
      : state.apiRegion === 'cn' ? API_TOKEN_PLAN_CN
      : state.apiRegion === 'sgp' ? API_TOKEN_PLAN_SGP
      : state.apiRegion === 'standard' ? API_STANDARD
      : API_TOKEN_PLAN_SGP; // default fallback
}

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${state.apiKey}`,
    'api-key': state.apiKey,
  };
}

// --- Retry with exponential backoff ---
function isRetryable(e) {
  return e.name !== 'AbortError' && !(e.message && e.message.match(/^HTTP 4/));
}

async function withRetry(fn, maxRetries = 3, label = '') {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (!isRetryable(e)) throw e;
      if (attempt === maxRetries) throw e;
      const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.log(`Retry ${attempt + 1}/${maxRetries}${label ? ` for ${label}` : ''} in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function fetchWithRetry(url, opts, maxRetries = 3) {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    if (opts.signal) opts.signal.addEventListener('abort', () => controller.abort(), { once: true });
    try {
      const resp = await fetch(url, { ...opts, signal: controller.signal });
      if (!resp.ok) {
        console.error(`HTTP ${resp.status}`);
        throw new Error(`HTTP ${resp.status}`);
      }
      return resp;
    } finally {
      clearTimeout(timeout);
    }
  }, maxRetries);
}

async function callTTSWithRetry(voiceDescription, text, maxRetries = 3, signal = null) {
  return withRetry(() => callTTS(voiceDescription, text, signal), maxRetries, `"${text.substring(0, 20)}..."`);
}

// Dialect tags that require mimo-v2.5-tts model (not voicedesign)
const DIALECT_TAGS = /^(?:（|\()(粤语|东北话|四川话|河南话|上海话|闽南语|客家话|唱歌)(?:）|\))/;

async function callTTS(voiceDescription, text, signal = null) {
  const url = buildApiUrl();
  const headers = buildHeaders();

  // Detect dialect tag — switch to mimo-v2.5-tts model if found
  const dialectMatch = text.match(DIALECT_TAGS);
  const useDialectModel = !!dialectMatch;

  const payload = {
    model: useDialectModel ? 'mimo-v2.5-tts' : 'mimo-v2.5-tts-voicedesign',
    messages: [
      { role: 'user', content: useDialectModel ? (voiceDescription || t('dialectFallback')) : voiceDescription },
      { role: 'assistant', content: text },
    ],
    audio: { format: 'wav', ...(useDialectModel ? { voice: 'mimo_default' } : {}) },
  };

  // No retry here — callTTSWithRetry handles retries
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let data;
    try { data = await resp.json(); } catch { throw new Error(t('invalidResponse')); }
    const audioData = data?.choices?.[0]?.message?.audio?.data;
    if (!audioData) throw new Error(t('noAudioInResponse'));
    return audioData;
  } finally {
    clearTimeout(timeout);
  }
}

function base64ToBlob(b64, mime) {
  if (!b64) throw new Error('Invalid base64 data');
  b64 = b64.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(b64)) throw new Error('Invalid base64 data');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// --- AI Story Generation ---
async function generateStory() {
  if (state.generating) return showToast(t('alreadyGenerating'), 'warning');
  const prompt = document.getElementById('storyPrompt').value.trim();
  if (!prompt) return showToast(t('enterStoryPrompt'), 'warning');
  if (!state.apiKey) return showToast(t('enterApiKey'), 'warning');
  // Warn if text already exists
  const existingText = document.getElementById('textInput').value.trim();
  if (existingText && !confirm(t('confirmOverwrite'))) return;

  const btn = document.getElementById('storyBtn');
  const status = document.getElementById('storyStatus');
  state.generating = true;
  btn.disabled = true;
  btn.classList.add('btn-loading');
  status.textContent = t('storyGenerating');

  const url = buildApiUrl();
  const headers = buildHeaders();

  const storyPrompt = t('storySystemPrompt', prompt);

  try {
    const resp = await fetchWithRetry(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'mimo-v2.5-pro',
        messages: [{ role: 'user', content: storyPrompt }],
        temperature: 0.8,
      }),
    }, 3);

    let data;
    try { data = await resp.json(); } catch { throw new Error(t('invalidResponse')); }
    const story = data?.choices?.[0]?.message?.content;
    if (!story) throw new Error(t('noStoryInResponse'));

    // Put story in textarea and auto-segment
    document.getElementById('textInput').value = story;
    status.textContent = t('storyDone');
    segmentText();
    status.textContent = t('storySegmented');

  } catch (e) {
    console.error('Story generation failed:', e);
    status.textContent = t('storyFailed', e.message);
  } finally {
    state.generating = false;
    btn.disabled = false;
    btn.classList.remove('btn-loading');
  }
}

// --- Render Step 3 ---
function renderStep3() {
  const step3 = document.getElementById('step3');
  step3.classList.remove('hidden');

  // Scroll to player section (only on first render)
  const storyReaderText = document.getElementById('storyReaderText');
  if (!storyReaderText.children.length) {
    setTimeout(() => step3.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  // Initialize story reader
  state.storyReader.currentIndex = 0;
  renderStoryReader();

  // Show share button if Web Share API is available
  if (navigator.share) {
    document.getElementById('shareBtn').style.display = '';
  }
}

// --- Story Reader ---
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

// --- Focus Mode ---

// --- Playback Speed ---
function setPlaybackSpeed(rate, btn) {
  const audioEl = document.getElementById('story-reader-audio');
  if (audioEl) audioEl.playbackRate = rate;
  state.storyReader.playbackRate = rate;
  document.querySelectorAll('.player-menu-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// --- Volume Control ---
function setVolume(val) {
  const audioEl = document.getElementById('story-reader-audio');
  const v = parseFloat(val);
  if (audioEl) audioEl.volume = v;
  state.storyReader.volume = v;
  const icon = document.getElementById('volumeIcon');
  icon.textContent = v === 0 ? '🔇' : v < 0.5 ? '🔉' : '🔊';
}

function toggleMute() {
  const slider = document.getElementById('volumeSlider');
  const audioEl = document.getElementById('story-reader-audio');
  if (state.storyReader.volume > 0) {
    state.storyReader.prevVolume = state.storyReader.volume;
    setVolume(0);
    slider.value = 0;
  } else {
    const restore = state.storyReader.prevVolume || 1;
    setVolume(restore);
    slider.value = restore;
  }
}

// --- Progress Seek ---
function seekProgress(e) {
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const audioEl = document.getElementById('story-reader-audio');
  if (audioEl && isFinite(audioEl.duration)) {
    audioEl.currentTime = pct * audioEl.duration;
  }
}

function renderStoryReader() {
  const segs = state.segments;
  if (!segs.length) return;

  const textEl = document.getElementById('storyReaderText');
  textEl.innerHTML = '';
  // Hide empty state
  const emptyEl = document.getElementById('storyReaderEmpty');
  if (emptyEl) emptyEl.style.display = 'none';

  // Build entire story with speaker labels
  let totalWords = 0;
  const wordCounts = [];
  segs.forEach((seg, segIdx) => {
    // Add speaker label
    const label = document.createElement('span');
    label.className = 'story-reader-speaker-label';
    label.textContent = seg.type === 'narration' ? `📖 ${t('narratorLabel')}：` : `💬 ${seg.speaker}：`;
    textEl.appendChild(label);

    // Split text into words
    const isChinese = /[一-鿿㐀-䶿]/.test(seg.text);
    const words = isChinese ? Array.from(seg.text) : seg.text.split(/(\s+)/);

    let segWordCount = 0;
    words.forEach(w => {
      if (!w) return;
      const span = document.createElement('span');
      span.className = 'story-reader-char unspoken';
      span.dataset.segIdx = segIdx;
      span.textContent = w;
      textEl.appendChild(span);
      if (!/^\s+$/.test(w)) segWordCount++;
    });

    wordCounts.push(segWordCount);
    totalWords += segWordCount;

    // Add line break between segments
    textEl.appendChild(document.createElement('br'));
  });

  // Store pre-computed word counts and prefix sums
  state.storyReader.wordCounts = wordCounts;
  state.storyReader.prefixSums = [];
  let sum = 0;
  for (const wc of wordCounts) {
    state.storyReader.prefixSums.push(sum);
    sum += wc;
  }
  state.storyReader.totalWords = totalWords;

  // Cache NodeList for timeupdate handler (avoids querySelectorAll every tick)
  state.storyReader.cachedCharSpans = textEl.querySelectorAll('.story-reader-char');

  // Update progress
  document.getElementById('storyReaderProgressFill').style.width = '0%';
  document.getElementById('storyReaderCurrent').textContent = '0:00';

  // Estimate total duration
  const totalDuration = estimateTotalDuration();
  document.getElementById('storyReaderTotal').textContent = formatTime(totalDuration);

}

// --- Duration helper (single source of truth) ---
function getSegmentDurationMs(segIdx) {
  const audioEl = document.getElementById('story-reader-audio');
  const wordCounts = state.storyReader.wordCounts;
  if (!wordCounts) return 0;
  if (segIdx === state.storyReader.playingSegIdx && audioEl && isFinite(audioEl.duration)) {
    return audioEl.duration * 1000;
  }
  const seg = state.segments[segIdx];
  const isChinese = /[一-鿿㐀-䶿]/.test(seg.text);
  return (wordCounts[segIdx] || 0) * (isChinese ? 250 : 400);
}

function estimateTotalDuration() {
  if (!state.storyReader.wordCounts) return 0;
  let total = 0;
  for (let i = 0; i < state.segments.length; i++) total += getSegmentDurationMs(i);
  return total;
}

function stopCurrentAudio() {
  cancelAnimationFrame(state.storyReader.animFrame);
  const audioEl = document.getElementById('story-reader-audio');
  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }
  state.storyReader.playingSegIdx = -1;
}


function playSegment(segIdx) {
  if (segIdx < 0 || segIdx >= state.segments.length) return;

  const seg = state.segments[segIdx];
  const buf = state.audioBuffers[seg.idx];
  if (!buf) {
    showToast(t('noAudioForSegment', segIdx + 1), 'warning');
    return;
  }

  let audioEl = document.getElementById('story-reader-audio');
  if (!audioEl) {
    audioEl = document.createElement('audio');
    audioEl.id = 'story-reader-audio';
    audioEl.style.display = 'none';
    document.body.appendChild(audioEl);

    audioEl.addEventListener('timeupdate', () => updateStoryReaderProgress(audioEl));
    audioEl.addEventListener('ended', () => {
      const btn = document.getElementById('playBtn');
      btn.classList.remove('playing');
      btn.textContent = '▶';
      btn.setAttribute('aria-label', t('ariaPlay'));
      onStoryReaderEnded();
    });
    audioEl.addEventListener('pause', () => {
      const btn = document.getElementById('playBtn');
      btn.classList.remove('playing');
      btn.textContent = '▶';
      btn.setAttribute('aria-label', t('ariaPlay'));
    });
    audioEl.addEventListener('play', () => {
      const btn = document.getElementById('playBtn');
      btn.classList.add('playing');
      btn.textContent = '⏸';
      btn.setAttribute('aria-label', t('ariaPause'));
      clearTransportError();
    });
    audioEl.addEventListener('error', () => showTransportError());
    audioEl.addEventListener('loadedmetadata', () => updateTotalTime());
  }

  // Use pre-computed prefix sum for word offset
  state.storyReader.currentWordOffset = state.storyReader.prefixSums
    ? state.storyReader.prefixSums[segIdx] || 0
    : 0;
  state.storyReader.playingSegIdx = segIdx;

  // Show now-playing indicator
  const np = document.getElementById('nowPlaying');
  if (np) {
    const speakerName = seg.speaker === NARRATOR_KEY ? t('narratorLabel') : seg.speaker;
    np.textContent = `${t('nowPlaying')}: ${speakerName} · #${segIdx + 1}/${state.segments.length}`;
    np.style.display = '';
  }

  // Set source and play
  audioEl.src = buf.url;
  // Apply stored speed and volume
  if (state.storyReader.playbackRate) audioEl.playbackRate = state.storyReader.playbackRate;
  if (state.storyReader.volume !== undefined) audioEl.volume = state.storyReader.volume;
  audioEl.play().then(() => {
    // Update play button state
    document.getElementById('playBtn').classList.add('playing');

    updateStoryReaderProgress(audioEl);
  }).catch(err => console.warn('Playback blocked:', err));
}

function updateTotalTime() {
  const audioEl = document.getElementById('story-reader-audio');
  if (!audioEl || !isFinite(audioEl.duration)) return;
  if (!state.storyReader.wordCounts) return;
  let totalMs = 0;
  for (let i = 0; i < state.segments.length; i++) totalMs += getSegmentDurationMs(i);
  document.getElementById('storyReaderTotal').textContent = formatTime(totalMs);
}

function updateStoryReaderProgress(audioEl) {
  if (!state.storyReader.enabled) return;
  if (!isFinite(audioEl.duration) || audioEl.duration <= 0) return;

  const allChars = state.storyReader.cachedCharSpans;
  if (!allChars || !allChars.length) return;

  // Calculate current word index based on segment progress
  const segIdx = state.storyReader.playingSegIdx;
  const seg = state.segments[segIdx];
  if (!seg) return;

  const wordCounts = state.storyReader.wordCounts;
  const segWordCount = wordCounts ? (wordCounts[segIdx] || 0) : 0;
  const segProgress = audioEl.currentTime / audioEl.duration;
  const segWordIndex = Math.floor(segProgress * segWordCount);
  const currentWordIndex = state.storyReader.currentWordOffset + segWordIndex;

  // Calculate overall progress
  const totalWords = state.storyReader.totalWords || 1;
  const overallProgress = currentWordIndex / totalWords;

  // Update progress bar
  document.getElementById('storyReaderProgressFill').style.width = `${overallProgress * 100}%`;
  document.getElementById('storyReaderCurrent').textContent = formatTime(audioEl.currentTime * 1000 + estimateOffset(segIdx));

  // Update character highlighting
  let wordIdx = 0;
  let currentWordFound = false;
  allChars.forEach((char) => {
    if (/^\s+$/.test(char.textContent)) return;

    const newClass = wordIdx < currentWordIndex ? 'story-reader-char spoken'
                   : wordIdx === currentWordIndex ? 'story-reader-char current'
                   : 'story-reader-char unspoken';
    if (char.className !== newClass) char.className = newClass;

    // Auto-scroll to current word
    if (wordIdx === currentWordIndex && !currentWordFound) {
      currentWordFound = true;
      if (state.storyReader.autoScroll) {
        char.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
    wordIdx++;
  });
}

function estimateOffset(segIdx) {
  if (!state.storyReader.wordCounts) return 0;
  let ms = 0;
  for (let i = 0; i < segIdx; i++) ms += getSegmentDurationMs(i);
  return ms;
}

function onStoryReaderEnded() {
  const segIdx = state.storyReader.playingSegIdx;
  const nextSegIdx = segIdx + 1;

  if (nextSegIdx < state.segments.length) {
    // Auto-advance to next segment
    state.storyReader.autoPlayNext = true;
    setTimeout(() => {
      if (state.storyReader.autoPlayNext) {
        playSegment(nextSegIdx);
        state.storyReader.autoPlayNext = false;
      }
    }, 80);
  } else {
    // All segments done
    showToast(t('playbackComplete'), 'success');
    document.getElementById('storyReaderProgressFill').style.width = '100%';
  }
}


// --- Voice Preview ---
let _previewAudio = null;
let _previewBtn = null;
let _previewUrl = null;

function previewVoice(btn, speakerName) {
  // If this button is already playing, stop it
  if (_previewBtn === btn && _previewAudio && !_previewAudio.paused) {
    _previewAudio.pause();
    _previewAudio.currentTime = 0;
    btn.classList.remove('playing');
    btn.textContent = '▶';
    if (_previewUrl) { URL.revokeObjectURL(_previewUrl); _previewUrl = null; }
    _previewAudio = null;
    _previewBtn = null;
    return;
  }

  // Stop any existing preview
  if (_previewAudio) {
    _previewAudio.pause();
    _previewAudio.currentTime = 0;
  }
  if (_previewBtn) {
    _previewBtn.classList.remove('playing');
    _previewBtn.textContent = '▶';
  }
  if (_previewUrl) { URL.revokeObjectURL(_previewUrl); _previewUrl = null; }

  // Stop story reader if playing
  stopCurrentAudio();

  // Get voice description from textarea
  const ta = document.querySelector(`.char-textarea[data-speaker="${CSS.escape(speakerName)}"]`);
  if (!ta || !ta.value.trim()) return showToast(t('fillVoiceDesc', displayName(speakerName)), 'warning');
  if (!state.apiKey) return showToast(t('enterApiKey'), 'warning');

  const desc = ta.value.trim();
  // Use the voice description itself as preview text
  const previewText = desc;

  btn.classList.add('playing');
  btn.textContent = '⏸';
  _previewBtn = btn;

  // Call TTS API
  callTTS(desc, previewText).then(audioData => {
    const blob = base64ToBlob(audioData, 'audio/wav');
    _previewUrl = URL.createObjectURL(blob);
    _previewAudio = new Audio(_previewUrl);
    _previewAudio.playbackRate = state.storyReader.playbackRate || 1;
    _previewAudio.play().catch(err => {
      console.warn('Preview blocked:', err);
      btn.classList.remove('playing');
      btn.textContent = '▶';
      if (_previewUrl) { URL.revokeObjectURL(_previewUrl); _previewUrl = null; }
    });
    _previewAudio.addEventListener('ended', () => {
      btn.classList.remove('playing');
      btn.textContent = '▶';
      if (_previewUrl) { URL.revokeObjectURL(_previewUrl); _previewUrl = null; }
      _previewAudio = null;
      _previewBtn = null;
    });
    _previewAudio.addEventListener('pause', () => {
      if (_previewAudio && _previewAudio.currentTime === 0) return; // ended
      btn.classList.remove('playing');
      btn.textContent = '▶';
    });
  }).catch(err => {
    console.error('Preview failed:', err);
    showToast(t('previewFailed'), 'error');
    btn.classList.remove('playing');
    btn.textContent = '▶';
    if (_previewUrl) { URL.revokeObjectURL(_previewUrl); _previewUrl = null; }
    _previewBtn = null;
  });
}

// --- Player Controls ---
let playerMenuOpen = false;

function togglePlayPause() {
  const audioEl = document.getElementById('story-reader-audio');
  const btn = document.getElementById('playBtn');
  if (audioEl && !audioEl.paused) {
    audioEl.pause();
    btn.classList.remove('playing');
    btn.textContent = '▶';
    btn.setAttribute('aria-label', t('ariaPlay'));
  } else if (state.segments.length > 0) {
    playAll();
  }
}

function playAll() {
  stopCurrentAudio();
  state.storyReader.autoScroll = true;
  playSegment(0);
  const btn = document.getElementById('playBtn');
  btn.classList.add('playing');
  btn.textContent = '⏸';
  btn.setAttribute('aria-label', t('ariaPause'));
}

function stopAll() {
  stopCurrentAudio();
  state.storyReader.autoScroll = true;
  // Reset story reader display
  document.querySelectorAll('#storyReaderText .story-reader-char').forEach(c => {
    c.className = 'story-reader-char unspoken';
  });
  document.getElementById('storyReaderProgressFill').style.width = '0%';
  document.getElementById('storyReaderCurrent').textContent = '0:00';
  const btn = document.getElementById('playBtn');
  btn.classList.remove('playing');
  btn.textContent = '▶';
  btn.setAttribute('aria-label', t('ariaPlay'));
}

function togglePlayerMenu() {
  playerMenuOpen = !playerMenuOpen;
  document.getElementById('playerMenu').classList.toggle('open', playerMenuOpen);
}

// Close player menu on outside click
document.addEventListener('click', (e) => {
  if (!playerMenuOpen) return;
  const menu = document.getElementById('playerMenu');
  const btn = document.getElementById('playerMenuBtn');
  if (menu && !menu.contains(e.target) && e.target !== btn) {
    playerMenuOpen = false;
    menu.classList.remove('open');
  }
});

function showTransportError() {
  const bar = document.getElementById('progressBar');
  if (bar) bar.classList.add('error');
  const fill = document.getElementById('storyReaderProgressFill');
  if (fill) fill.style.background = 'linear-gradient(90deg, #ff6b6b, #ff4444)';
}

function clearTransportError() {
  const bar = document.getElementById('progressBar');
  if (bar) bar.classList.remove('error');
  const fill = document.getElementById('storyReaderProgressFill');
  if (fill) fill.style.background = '';
}

function prevSegment() {
  const current = state.storyReader.playingSegIdx;
  const target = current > 0 ? current - 1 : 0;
  stopCurrentAudio();
  playSegment(target);
}

function nextSegment() {
  const current = state.storyReader.playingSegIdx;
  const target = current >= 0 ? current + 1 : 0;
  if (target < state.segments.length) {
    stopCurrentAudio();
    playSegment(target);
  }
}

// --- Share ---
async function shareAudio() {
  if (!navigator.share) return showToast(t('shareNotSupported'), 'warning');
  const blobs = state.segments
    .filter(s => state.audioBuffers[s.idx])
    .map(s => state.audioBuffers[s.idx].blob);
  if (!blobs.length) return showToast(t('noAudio'), 'warning');

  try {
    const combined = await concatenateWavs(blobs);
    const file = new File([combined], t('combinedFilename'), { type: 'audio/wav' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: t('title') });
    } else {
      await navigator.share({ title: t('title'), text: t('tagline') });
    }
  } catch (e) {
    if (e.name !== 'AbortError') console.error('Share failed:', e);
  }
}

// --- Downloads ---
async function concatenateWavs(blobs) {
  const HEADER = 44;
  const buffers = await Promise.all(blobs.map(b => b.arrayBuffer()));

  // Validate WAV headers
  for (let i = 0; i < buffers.length; i++) {
    const buf = buffers[i];
    if (buf.byteLength < HEADER) throw new Error(`Segment ${i + 1}: file too small (${buf.byteLength} bytes)`);
    const sig = String.fromCharCode(...new Uint8Array(buf, 0, 4));
    const fmt = String.fromCharCode(...new Uint8Array(buf, 8, 4));
    if (sig !== 'RIFF' || fmt !== 'WAVE') throw new Error(`Segment ${i + 1}: invalid WAV header`);
  }

  // Calculate total PCM size (skip 44-byte WAV header per file)
  let totalPcm = 0;
  for (const buf of buffers) totalPcm += buf.byteLength - HEADER;

  // Build combined buffer: header + all PCM data
  const combined = new ArrayBuffer(HEADER + totalPcm);
  const out = new Uint8Array(combined);

  // Copy header from first file, patch sizes
  out.set(new Uint8Array(buffers[0], 0, HEADER));
  const dv = new DataView(combined);
  dv.setUint32(4, HEADER + totalPcm - 8, true);   // RIFF chunk size
  dv.setUint32(HEADER - 4, totalPcm, true);        // data chunk size

  // Concatenate PCM data from all files
  let offset = HEADER;
  for (const buf of buffers) {
    out.set(new Uint8Array(buf, HEADER), offset);
    offset += buf.byteLength - HEADER;
  }

  return new Blob([combined], { type: 'audio/wav' });
}

async function downloadAll() {
  const blobs = state.segments
    .filter(s => state.audioBuffers[s.idx])
    .map(s => state.audioBuffers[s.idx].blob);

  if (!blobs.length) return showToast(t('noAudio'), 'warning');

  try {
    showToast(t('combining'), 'info');
    const combined = await concatenateWavs(blobs);
    triggerDownload(combined, t('combinedFilename'));
  } catch (e) {
    console.error('Combine failed:', e);
    showToast(t('combineFailed'), 'error');
  }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
