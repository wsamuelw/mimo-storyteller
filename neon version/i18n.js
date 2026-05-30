// ============================================================
// i18n — 3-language support (简体/繁體/English)
// ============================================================

const I18N = {
  'zh-CN': {
    title: '🎙️ 有声书片段生成器',
    apiKeyLabel: 'API Key',
    endpointLabel: '端点',
    customBaseLabel: '自定义 Base URL',
    proxyLabel: '代理 (CORS)',
    saveKey: '保存 Key',
    aiStoryTitle: '🤖 AI 写故事',
    aiStoryDesc: '用 MiMo LLM 生成故事',
    storyPlaceholder: '输入故事主题或提示词，例如：两个老朋友在咖啡馆重逢',
    aiStoryBtn: '✨ AI 写故事',
    sourceText: '📝 文本内容',
    autoSegmentHint: '粘贴后自动分段',
    textInputPlaceholder: '粘贴小说或故事片段...\n\n支持「」和 "" 标记的对话，以及 Name: text 格式。',
    segmentBtn: '✨ 智能分段',
    clearBtn: '清空',
    charactersLabel: '🎭 角色声音',
    segmentsLabel: '📋 分段预览',
    generateBtn: '🎵 生成全部音频',
    playbackLabel: '🎧 试听',
    downloadAllBtn: '💾 下载全部',
    // Alerts
    enterApiKey: '请先保存 API Key',
    enterStoryPrompt: '请输入故事主题或提示词',
    enterTextFirst: '请先粘贴文本',
    fillVoiceDesc: name => `请为「${name}」填写声音描述`,
    generating: (n, total, speaker, text) => `生成中... (${n}/${total}) — ${speaker}: ${text}...`,
    done: n => `✅ 全部 ${n} 段生成完成`,
    doneWithErrors: n => `完成，${n} 个失败`,
    errorsTitle: '部分段落生成失败：',
    noAudio: '没有可下载的音频',
    storyGenerating: '正在调用 MiMo LLM...',
    storyDone: '✅ 故事生成完成，正在分段...',
    storySegmented: '✅ 故事已分段，请分配角色声音',
    storyFailed: msg => `❌ 生成失败: ${msg}`,
    preparing: '准备中...',
  },
  'zh-TW': {
    title: '🎙️ 有聲書片段生成器',
    apiKeyLabel: 'API Key',
    endpointLabel: '端點',
    customBaseLabel: '自訂 Base URL',
    proxyLabel: '代理 (CORS)',
    saveKey: '儲存 Key',
    aiStoryTitle: '🤖 AI 寫故事',
    aiStoryDesc: '用 MiMo LLM 生成故事',
    storyPlaceholder: '輸入故事主題或提示詞，例如：兩個老朋友在咖啡館重逢',
    aiStoryBtn: '✨ AI 寫故事',
    sourceText: '📝 文本內容',
    autoSegmentHint: '貼上後自動分段',
    textInputPlaceholder: '貼上小說或故事片段...\n\n支援「」和 "" 標記的對話，以及 Name: text 格式。',
    segmentBtn: '✨ 智能分段',
    clearBtn: '清空',
    charactersLabel: '🎭 角色聲音',
    segmentsLabel: '📋 分段預覽',
    generateBtn: '🎵 生成全部音訊',
    playbackLabel: '🎧 試聽',
    downloadAllBtn: '💾 下載全部',
    enterApiKey: '請先儲存 API Key',
    enterStoryPrompt: '請輸入故事主題或提示詞',
    enterTextFirst: '請先貼上文本',
    fillVoiceDesc: name => `請為「${name}」填寫聲音描述`,
    generating: (n, total, speaker, text) => `生成中... (${n}/${total}) — ${speaker}: ${text}...`,
    done: n => `✅ 全部 ${n} 段生成完成`,
    doneWithErrors: n => `完成，${n} 個失敗`,
    errorsTitle: '部分段落生成失敗：',
    noAudio: '沒有可下載的音訊',
    storyGenerating: '正在呼叫 MiMo LLM...',
    storyDone: '✅ 故事生成完成，正在分段...',
    storySegmented: '✅ 故事已分段，請分配角色聲音',
    storyFailed: msg => `❌ 生成失敗: ${msg}`,
    preparing: '準備中...',
  },
  'en': {
    title: '🎙️ Audiobook Snippet Generator',
    apiKeyLabel: 'API Key',
    endpointLabel: 'Endpoint',
    customBaseLabel: 'Custom Base URL',
    proxyLabel: 'Proxy (CORS)',
    saveKey: 'Save Key',
    aiStoryTitle: '🤖 AI Story Writer',
    aiStoryDesc: 'Generate stories with MiMo LLM',
    storyPlaceholder: 'Enter a story theme or prompt, e.g. Two old friends reunite at a café',
    aiStoryBtn: '✨ Generate Story',
    sourceText: '📝 Source Text',
    autoSegmentHint: 'auto-segment on paste',
    textInputPlaceholder: 'Paste your novel or story...\n\nSupports Name: text format and 「」or "" dialogue markers.',
    segmentBtn: '✨ Auto-Segment',
    clearBtn: 'Clear',
    charactersLabel: '🎭 Characters',
    segmentsLabel: '📋 Segments',
    generateBtn: '🎵 Generate All Audio',
    playbackLabel: '🎧 Playback',
    downloadAllBtn: '💾 Download All',
    enterApiKey: 'Please save your API Key first',
    enterStoryPrompt: 'Please enter a story theme or prompt',
    enterTextFirst: 'Please paste some text first',
    fillVoiceDesc: name => `Please fill in a voice description for "${name}"`,
    generating: (n, total, speaker, text) => `Generating... (${n}/${total}) — ${speaker}: ${text}...`,
    done: n => `✅ All ${n} segments generated`,
    doneWithErrors: n => `Done, ${n} failed`,
    errorsTitle: 'Some segments failed:',
    noAudio: 'No audio to download',
    storyGenerating: 'Calling MiMo LLM...',
    storyDone: '✅ Story generated, segmenting...',
    storySegmented: '✅ Story segmented, assign voices below',
    storyFailed: msg => `❌ Failed: ${msg}`,
    preparing: 'Preparing...',
  },
};

let currentLang = localStorage.getItem('mimo_lang') || 'zh-CN';

function t(key, ...args) {
  const entry = I18N[currentLang]?.[key] ?? I18N['zh-CN'][key] ?? key;
  return typeof entry === 'function' ? entry(...args) : entry;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('mimo_lang', lang);

  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translated = t(key);
    if (typeof translated === 'string') el.textContent = translated;
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const translated = t(key);
    if (typeof translated === 'string') el.placeholder = translated;
  });
}
