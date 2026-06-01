// ============================================================
// i18n — 3-language support (简体/繁體/English)
// ============================================================

const I18N = {
  'zh-CN': {
    title: 'MiMo 讲故事',
    subtitle: 'MiMo-V2.5-TTS · 语音设计',
    tagline: '多角色 AI 讲故事',
    guideStep1: '写一个故事，或让 AI 帮你写',
    guideStep2: '为每个角色分配声音',
    guideStep3: '生成音频，聆听故事',
    apiKeyLabel: 'API Key',
    endpointLabel: '端点',
    endpointHint: 'Standard = 按量付费。Token Plan = 预付套餐。选择与你账号匹配的选项。',
    advancedLabel: '高级设置',
    standardOption: '标准 / 按量付费',
    cnOption: 'Token Plan 中国',
    sgpOption: 'Token Plan 新加坡',
    useCustomBaseLabel: '使用自定义 API URL',
    useProxyLabel: '使用 CORS 代理',
    proxyHint: '⚠️ 您的 API Key 将发送到此代理服务器',
    saveKey: '保存 Key',
    aiStoryTitle: 'AI 写故事',
    aiStoryDesc: '用 MiMo LLM 生成故事',
    creditHint: '⚠️ 使用 API 配额生成故事',
    storyPlaceholder: '输入故事主题或提示词，例如：两个老朋友在咖啡馆重逢',
    aiStoryBtn: '✨ 生成',
    sourceText: '文本内容',
    autoSegmentHint: '粘贴后自动分段',
    textInputPlaceholder: '粘贴小说或故事片段...',
    formatHint: '支持格式：Name：对话、"对话"。前缀 (粤语) 切换粤语，(唱歌) 切换唱歌模式。',
    segmentBtn: '✨ 智能分段',
    clearBtn: '清空',
    charactersLabel: '角色声音',
    charHint: '点击上方角色，然后在下方选择预设声音。',
    morePresets: '+12 个更多 ▾',
    lessPresets: '▾ 收起',
    segmentsLabel: '分段预览',
    segmentsEmpty: '粘贴文本并分段后，段落将显示在这里。',
    generateBtn: '生成全部音频',
    cancelBtn: '⏹ 停止',
    cancelled: '已取消生成',
    playbackLabel: '故事朗读',
    speedLabel: '速度',
    volumeLabel: '音量',
    downloadAllBtn: '下载全部',
    // Alerts
    enterApiKey: '请先保存 API Key',
    apiKeyTooShort: 'API Key 长度不足，请检查是否完整',
    enterStoryPrompt: '请输入故事主题或提示词',
    enterTextFirst: '请先粘贴文本',
    fillVoiceDesc: name => `请为「${name}」填写声音描述`,
    generating: (n, total, speaker, text) => `生成中... (${n}/${total}) — ${speaker}: ${text}...`,
    alreadyGenerating: '正在生成中，请等待完成',
    done: n => `✅ 全部 ${n} 段生成完成`,
    doneWithErrors: n => `完成，${n} 个失败`,
    errorsTitle: '部分段落生成失败：',
    offlineError: '你离线了，请检查网络连接',
    onlineRestored: '已恢复网络连接',
    invalidUrl: '请输入有效的 URL（http:// 或 https://）',
    dialectFallback: '用自然的语气说',
    storageError: '存储写入失败，空间可能已满',
    corsError: '连接失败 — 如果使用本地文件，请启动 HTTP 服务器或在设置中配置代理',
    noAudio: '没有可下载的音频',
    confirmClear: '确定要清除所有内容吗？此操作不可撤销。',
    confirmOverwrite: '当前文本将被覆盖，是否继续？',
    retryFailed: '🔄 重试失败的段落',
    combining: '正在合并音频...',
    combinedFilename: 'mimo-storyteller.wav',
    combineFailed: '❌ 无法合并音频，请重试',
    storyGenerating: '正在调用 MiMo LLM...',
    storyDone: '✅ 故事生成完成，正在分段...',
    storySegmented: '✅ 故事已分段，请分配角色声音',
    storyFailed: msg => `❌ 生成失败: ${msg}`,
    storySystemPrompt: prompt => `你是一个专业的故事作家。请根据以下主题写一个短篇故事。

严格遵守以下格式要求：
1. 故事有2-4个角色
2. 对话必须用 "角色名：对话内容" 格式，例如：
   小明：你好啊，好久不见！
   小红：我很好，谢谢你！
3. 旁白用普通段落，不要加任何前缀
4. 每段对话或旁白占一行
5. 故事长度200-400字
6. 有完整的情节：开头、发展、结尾
7. 直接输出故事，不要任何解释或标题
8. 必须使用简体中文撰写整个故事，无论主题是什么语言

主题：${prompt}`,
    preparing: '准备中...',
    apiKeySaved: '✅ API Key 已保存',
    settings: '⚙️ 设置',
    cancel: '取消',
    noSegmentsFound: '未能识别出任何段落。请使用 "Name：对话" 格式或直接输入旁白文本。',
    tooManySegments: n => `段落数过多（${n}），请缩短文本`,
    manySegments: n => `段落较多（${n}），生成可能需要较长时间`,
    noAudioInResponse: '响应中没有音频数据',
    invalidResponse: '服务器返回了异常内容，请重试或检查 API 设置',
    noStoryInResponse: '响应中没有故事内容',
    customVoice: '自定义',
    // Presets
    presetNarrator: '📖 旁白',
    presetYoungMale: '🧑 年轻男性',
    presetYoungFemale: '👩 年轻女性',    presetChild: '🧒 童声',
    presetVillain: '😈 反派',
    presetFlirty: '💋 性感女声',
    presetHero: '🦸 英雄',
    presetGentleFemale: '🌸 温柔女声',
    presetEnergeticMale: '🔥 活力男声',
    presetNewsAnchor: '📺 新闻主播',
    presetStoryteller: '📚 说书人',
    presetMysterious: '🌙 神秘人',
    presetSeductive: '🖤 魅惑女声',
    presetDomina: '👑 女王音',
    presetTsundere: '💢 傲娇女',
    presetYandere: '🔪 病娇女',    presetOneeSan: '🌺 御姐音',
    presetKuudere: '❄️ 冷淡女',
    presetOjouSama: '💎 大小姐',    presetNurse: '💉 护士',
    presetSecretary: '📋 女秘书',
    presetExGirlfriend: '💔 前女友',    presetLuxury: '🥂 名媛音',
    presetWhisper: '🤫 耳语',
    // Dynamic labels
    narratorLabel: '旁白',
    dialogueLabel: '对话',
    segmentCount: n => n + ' 段',
    charPlaceholder: '描述这个角色的声音特征...',
    unknownSpeaker: '未知',
    // Aria labels
    ariaLanguage: '语言',
    ariaSettings: '设置',
    ariaStoryPrompt: '故事提示词',
    ariaSourceText: '源文本',
    ariaGenerateBtn: '生成全部音频',
    ariaCancelBtn: '取消生成',
    ariaProgress: '生成进度',
    ariaPlayAll: '播放全部',
    ariaPauseAll: '暂停全部',
    ariaStopAll: '停止全部',
    ariaDownloadAll: '下载全部',
    ariaPreviewVoice: '预览声音',
    previewFallbackText: '你好，这是声音预览。',
    previewFailed: '预览失败，请重试',
    ariaShare: '分享',
    ariaClose: '关闭',
    ariaShowKey: '显示 API Key',
    ariaHideKey: '隐藏 API Key',
    ariaCustomBase: '自定义 API 地址',
    ariaProxy: '代理地址',
    ariaDownloadSegment: n => `下载第 ${n} 段`,
    // Story Reader
    storyReaderTitle: '🎤 故事朗读',
    storyReaderLabel: '朗读',
    storyReaderEmpty: '生成音频后，故事将显示在这里。',
    storyReaderToggle: 'ON',
    storyReaderToggleOn: 'ON',
    storyReaderToggleOff: 'OFF',
    noAudioForSegment: n => `第 ${n} 段没有音频`,
    playbackComplete: '✅ 播放完成',
    prevSegment: '⏮ 上一段',
    nextSegment: '下一段 ⏭',
    segmentListShow: '查看全部段落',
    segmentListHide: '收起段落',
    focusHint: '悬停显示控制栏',
    ariaPlay: '播放',
    ariaPause: '暂停',
    ariaStop: '停止',
    ariaPrevSegment: '上一段',
    ariaNextSegment: '下一段',
    ariaDismiss: '关闭',
    skipToContent: '跳到内容',
    nowPlaying: '正在播放',
    shareNotSupported: '您的浏览器不支持分享',
  },
  'zh-TW': {
    title: 'MiMo 講故事',
    subtitle: 'MiMo-V2.5-TTS · 語音設計',
    tagline: '多角色 AI 講故事',
    guideStep1: '寫一個故事，或讓 AI 幫你寫',
    guideStep2: '為每個角色分配聲音',
    guideStep3: '生成音訊，聆聽故事',
    apiKeyLabel: 'API Key',
    endpointLabel: '端點',
    endpointHint: 'Standard = 按量付費。Token Plan = 預付套餐。選擇與你帳號匹配的選項。',
    advancedLabel: '高級設定',
    standardOption: '標準 / 按量付費',
    cnOption: 'Token Plan 中國',
    sgpOption: 'Token Plan 新加坡',
    useCustomBaseLabel: '使用自訂 API URL',
    useProxyLabel: '使用 CORS 代理',
    proxyHint: '⚠️ 您的 API Key 將發送到此代理伺服器',
    saveKey: '儲存 Key',
    aiStoryTitle: 'AI 寫故事',
    aiStoryDesc: '用 MiMo LLM 生成故事',
    creditHint: '⚠️ 使用 API 配額生成故事',
    storyPlaceholder: '輸入故事主題或提示詞，例如：兩個老朋友在咖啡館重逢',
    aiStoryBtn: '✨ 生成',
    sourceText: '文本內容',
    autoSegmentHint: '貼上後自動分段',
    textInputPlaceholder: '貼上小說或故事片段...',
    formatHint: '支援格式：Name：對話、"對話"。前綴 (粵語) 切換粵語，(唱歌) 切換唱歌模式。',
    segmentBtn: '✨ 智能分段',
    clearBtn: '清空',
    charactersLabel: '角色聲音',
    charHint: '點擊上方角色，然後在下方選擇預設聲音。',
    morePresets: '+12 個更多 ▾',
    lessPresets: '▾ 收起',
    segmentsLabel: '分段預覽',
    segmentsEmpty: '貼上文本並分段後，段落將顯示在這裡。',
    generateBtn: '生成全部音訊',
    cancelBtn: '⏹ 停止',
    cancelled: '已取消生成',
    playbackLabel: '故事朗讀',
    speedLabel: '速度',
    volumeLabel: '音量',
    downloadAllBtn: '下載全部',
    enterApiKey: '請先儲存 API Key',
    apiKeyTooShort: 'API Key 長度不足，請檢查是否完整',
    enterStoryPrompt: '請輸入故事主題或提示詞',
    enterTextFirst: '請先貼上文本',
    fillVoiceDesc: name => `請為「${name}」填寫聲音描述`,
    generating: (n, total, speaker, text) => `生成中... (${n}/${total}) — ${speaker}: ${text}...`,
    alreadyGenerating: '正在生成中，請等待完成',
    done: n => `✅ 全部 ${n} 段生成完成`,
    doneWithErrors: n => `完成，${n} 個失敗`,
    errorsTitle: '部分段落生成失敗：',
    offlineError: '你離線了，請檢查網路連線',
    onlineRestored: '已恢復網路連線',
    invalidUrl: '請輸入有效的 URL（http:// 或 https://）',
    dialectFallback: '用自然的語氣說',
    storageError: '儲存寫入失敗，空間可能已滿',
    corsError: '連線失敗 — 如果使用本機檔案，請啟動 HTTP 伺服器或在設定中配置代理',
    noAudio: '沒有可下載的音訊',
    confirmClear: '確定要清除所有內容嗎？此操作不可撤銷。',
    confirmOverwrite: '當前文本將被覆蓋，是否繼續？',
    retryFailed: '🔄 重試失敗的段落',
    combining: '正在合併音訊...',
    combinedFilename: 'mimo-storyteller.wav',
    combineFailed: '❌ 無法合併音訊，請重試',
    storyGenerating: '正在呼叫 MiMo LLM...',
    storyDone: '✅ 故事生成完成，正在分段...',
    storySegmented: '✅ 故事已分段，請分配角色聲音',
    storyFailed: msg => `❌ 生成失敗: ${msg}`,
    storySystemPrompt: prompt => `你是一個專業的故事作家。請根據以下主題寫一個短篇故事。

嚴格遵守以下格式要求：
1. 故事有2-4個角色
2. 對話必須用 "角色名：對話內容" 格式，例如：
   小明：你好啊，好久不見！
   小紅：我很好，謝謝你！
3. 旁白用普通段落，不要加任何前綴
4. 每段對話或旁白佔一行
5. 故事長度200-400字
6. 有完整的情節：開頭、發展、結尾
7. 直接輸出故事，不要任何解釋或標題
8. 必須使用繁體中文撰寫整個故事，無論主題是什麼語言

主題：${prompt}`,
    preparing: '準備中...',
    apiKeySaved: '✅ API Key 已儲存',
    settings: '⚙️ 設置',
    cancel: '取消',
    noSegmentsFound: '未能識別出任何段落。請使用 "Name：對話" 格式或直接輸入旁白文本。',
    tooManySegments: n => `段落數過多（${n}），請縮短文本`,
    manySegments: n => `段落較多（${n}），生成可能需要較長時間`,
    noAudioInResponse: '回應中沒有音訊資料',
    invalidResponse: '伺服器回應異常，請重試或檢查 API 設定',
    noStoryInResponse: '回應中沒有故事內容',
    customVoice: '自訂',
    // Presets
    presetNarrator: '📖 旁白',
    presetYoungMale: '🧑 年輕男性',
    presetYoungFemale: '👩 年輕女性',    presetChild: '🧒 童聲',
    presetVillain: '😈 反派',
    presetFlirty: '💋 性感女聲',
    presetHero: '🦸 英雄',
    presetGentleFemale: '🌸 溫柔女聲',
    presetEnergeticMale: '🔥 活力男聲',
    presetNewsAnchor: '📺 新聞主播',
    presetStoryteller: '📚 說書人',
    presetMysterious: '🌙 神秘人',
    presetSeductive: '🖤 魅惑女聲',
    presetDomina: '👑 女王音',
    presetTsundere: '💢 傲嬌女',
    presetYandere: '🔪 病嬌女',    presetOneeSan: '🌺 御姐音',
    presetKuudere: '❄️ 冷淡女',
    presetOjouSama: '💎 大小姐',    presetNurse: '💉 護士',
    presetSecretary: '📋 女秘書',
    presetExGirlfriend: '💔 前女友',    presetLuxury: '🥂 名媛音',
    presetWhisper: '🤫 耳語',
    // Dynamic labels
    narratorLabel: '旁白',
    dialogueLabel: '對話',
    segmentCount: n => n + ' 段',
    charPlaceholder: '描述這個角色的聲音特徵...',
    unknownSpeaker: '未知',
    // Aria labels
    ariaLanguage: '語言',
    ariaSettings: '設定',
    ariaStoryPrompt: '故事提示詞',
    ariaSourceText: '源文本',
    ariaGenerateBtn: '生成全部音訊',
    ariaCancelBtn: '取消生成',
    ariaProgress: '生成進度',
    ariaPlayAll: '播放全部',
    ariaPauseAll: '暫停全部',
    ariaStopAll: '停止全部',
    ariaDownloadAll: '下載全部',
    ariaPreviewVoice: '預覽聲音',
    previewFallbackText: '你好，這是聲音預覽。',
    previewFailed: '預覽失敗，請重試',
    ariaShare: '分享',
    ariaClose: '關閉',
    ariaShowKey: '顯示 API Key',
    ariaHideKey: '隱藏 API Key',
    ariaCustomBase: '自訂 API 地址',
    ariaProxy: '代理地址',
    ariaDownloadSegment: n => `下載第 ${n} 段`,
    // Story Reader
    storyReaderTitle: '🎤 故事朗讀',
    storyReaderLabel: '朗讀',
    storyReaderEmpty: '生成音訊後，故事將顯示在這裡。',
    storyReaderToggle: 'ON',
    storyReaderToggleOn: 'ON',
    storyReaderToggleOff: 'OFF',
    noAudioForSegment: n => `第 ${n} 段沒有音訊`,
    playbackComplete: '✅ 播放完成',
    segmentListShow: '查看段落',
    segmentListHide: '收起段落',
    focusHint: '懸停顯示控制欄',
    ariaPlay: '播放',
    ariaPause: '暫停',
    ariaStop: '停止',
    ariaPrevSegment: '上一段',
    ariaNextSegment: '下一段',
    ariaDismiss: '關閉',
    skipToContent: '跳到内容',
    nowPlaying: '正在播放',
    shareNotSupported: '您的瀏覽器不支援分享',
  },
  'en': {
    title: 'MiMo Storyteller',
    subtitle: 'MiMo-V2.5-TTS · Voice Design',
    tagline: 'Multi-voice AI storytelling',
    guideStep1: 'Write a story or let AI write one',
    guideStep2: 'Assign a voice to each character',
    guideStep3: 'Generate audio and listen',
    apiKeyLabel: 'API Key',
    endpointLabel: 'Endpoint',
    endpointHint: 'Standard = pay per use. Token Plan = prepaid credits. Choose the one matching your account.',
    advancedLabel: 'Advanced settings',
    standardOption: 'Standard / PAYG',
    cnOption: 'Token Plan CN',
    sgpOption: 'Token Plan SGP',
    useCustomBaseLabel: 'Use custom API URL',
    useProxyLabel: 'I\'m behind a CORS proxy',
    proxyHint: '⚠️ Your API key will be sent to this proxy',
    saveKey: 'Save Key',
    aiStoryTitle: 'AI Story Writer',
    aiStoryDesc: 'Generate stories with MiMo LLM',
    creditHint: '⚠️ Uses API quota to generate stories',
    storyPlaceholder: 'Enter a story theme or prompt, e.g. Two old friends reunite at a café',
    aiStoryBtn: '✨ Generate',
    sourceText: 'Source Text',
    autoSegmentHint: 'auto-segment on paste',
    textInputPlaceholder: 'Paste your novel or story...',
    formatHint: 'Supports: Name：dialogue and "dialogue" format. Prefix with (粤语) for Cantonese, (唱歌) for singing.',
    segmentBtn: '✨ Auto-Segment',
    clearBtn: 'Clear',
    charactersLabel: 'Characters',
    charHint: 'Click a character above, then select a preset below to assign a voice.',
    morePresets: '+12 more ▾',
    lessPresets: '▾ Less',
    segmentsLabel: 'Segments',
    segmentsEmpty: 'Segments will appear here after you paste and segment your text.',
    generateBtn: 'Generate All Audio',
    cancelBtn: '⏹ Stop',
    cancelled: 'Generation cancelled',
    playbackLabel: 'Story Reader',
    speedLabel: 'Speed',
    volumeLabel: 'Volume',
    downloadAllBtn: 'Download All',
    enterApiKey: 'Please save your API Key first',
    apiKeyTooShort: 'API key looks too short — please check it',
    enterStoryPrompt: 'Please enter a story theme or prompt',
    enterTextFirst: 'Please paste some text first',
    fillVoiceDesc: name => `Please fill in a voice description for "${name}"`,
    generating: (n, total, speaker, text) => `Generating... (${n}/${total}) — ${speaker}: ${text}...`,
    alreadyGenerating: 'Generation in progress — please wait',
    done: n => n === 1 ? '✅ 1 segment generated' : `✅ All ${n} segments generated`,
    doneWithErrors: n => `Done, ${n} failed`,
    errorsTitle: 'Some segments failed:',
    offlineError: 'You are offline. Please check your connection.',
    onlineRestored: 'Connection restored',
    invalidUrl: 'Please enter a valid URL (http:// or https://)',
    dialectFallback: 'Speak in a natural tone',
    storageError: 'Storage write failed — may be full',
    corsError: 'Connection failed — if using a local file, start an HTTP server or enable a CORS proxy in Settings',
    noAudio: 'No audio to download',
    confirmClear: 'Clear all content? This cannot be undone.',
    confirmOverwrite: 'Your current text will be overwritten. Continue?',
    retryFailed: '🔄 Retry failed segments',
    combining: 'Combining audio...',
    combinedFilename: 'mimo-storyteller.wav',
    combineFailed: '❌ Could not merge audio files. Please try again.',
    storyGenerating: 'Calling MiMo LLM...',
    storyDone: '✅ Story generated, segmenting...',
    storySegmented: '✅ Story segmented, assign voices below',
    storyFailed: msg => `❌ Failed: ${msg}`,
    storySystemPrompt: prompt => `You are a professional story writer. Write a short story based on the following theme.

STRICT format requirements:
1. The story has 2-4 characters
2. Dialogue MUST use "CharacterName: dialogue" format, for example:
   Daniel: Hello, how have you been?
   Sarah: I'm great, thanks for asking!
3. Narration uses plain paragraphs with no prefix
4. Each dialogue or narration line is on its own line
5. Story length 200-400 words
6. Has a complete plot: beginning, development, ending
7. Output the story directly, no explanations or titles
8. You MUST write the entire story in English, regardless of what language the theme is in

Theme: ${prompt}`,
    preparing: 'Preparing...',
    apiKeySaved: '✅ API Key saved',
    settings: '⚙️ Settings',
    cancel: 'Cancel',
    noSegmentsFound: 'No segments found. Use "Name：dialogue" format or paste narration text directly.',
    tooManySegments: n => `Too many segments (${n}). Please shorten the text.`,
    manySegments: n => `Many segments (${n}). Generation may take a while.`,
    noAudioInResponse: 'No audio data in response',
    invalidResponse: 'Server returned something unexpected. Please try again or check your API settings.',
    noStoryInResponse: 'No story content in response',
    customVoice: 'Custom',
    // Presets
    presetNarrator: '📖 Narrator',
    presetYoungMale: '🧑 Young Male',
    presetYoungFemale: '👩 Young Female',    presetChild: '🧒 Child',
    presetVillain: '😈 Villain',
    presetFlirty: '💋 Flirty',
    presetHero: '🦸 Hero',
    presetGentleFemale: '🌸 Gentle',
    presetEnergeticMale: '🔥 Energetic',
    presetNewsAnchor: '📺 News Anchor',
    presetStoryteller: '📚 Storyteller',
    presetMysterious: '🌙 Mysterious',
    presetSeductive: '🖤 Seductive',
    presetDomina: '👑 Domina',
    presetTsundere: '💢 Tsundere',
    presetYandere: '🔪 Yandere',    presetOneeSan: '🌺 Onee-San',
    presetKuudere: '❄️ Kuudere',
    presetOjouSama: '💎 Ojou-Sama',    presetNurse: '💉 Nurse',
    presetSecretary: '📋 Secretary',
    presetExGirlfriend: '💔 Ex-Girlfriend',    presetLuxury: '🥂 Luxury',
    presetWhisper: '🤫 Whisper',
    // Dynamic labels
    narratorLabel: 'Narrator',
    dialogueLabel: 'Dialogue',
    segmentCount: n => n === 1 ? '1 segment' : n + ' segments',
    charPlaceholder: "Describe this character's voice...",
    unknownSpeaker: 'Unknown',
    // Aria labels
    ariaLanguage: 'Language',
    ariaSettings: 'Settings',
    ariaStoryPrompt: 'Story prompt',
    ariaSourceText: 'Source text',
    ariaGenerateBtn: 'Generate all audio',
    ariaCancelBtn: 'Cancel generation',
    ariaProgress: 'Generation progress',
    ariaPlayAll: 'Play all',
    ariaPauseAll: 'Pause all',
    ariaStopAll: 'Stop all',
    ariaDownloadAll: 'Download all',
    ariaPreviewVoice: 'Preview voice',
    previewFallbackText: 'Hello, this is a voice preview.',
    previewFailed: 'Preview failed, please try again',
    ariaShare: 'Share',
    ariaClose: 'Close',
    ariaShowKey: 'Show API key',
    ariaHideKey: 'Hide API key',
    ariaCustomBase: 'Custom API base URL',
    ariaProxy: 'CORS proxy URL',
    ariaDownloadSegment: n => `Download segment #${n}`,
    // Story Reader
    storyReaderTitle: '🎤 Story Reader',
    storyReaderLabel: 'Reader',
    storyReaderEmpty: 'Generate audio to see the story here.',
    storyReaderToggle: 'ON',
    storyReaderToggleOn: 'ON',
    storyReaderToggleOff: 'OFF',
    noAudioForSegment: n => `No audio for segment #${n}`,
    playbackComplete: '✅ Playback complete',
    segmentListShow: 'View segments',
    segmentListHide: 'Hide segments',
    focusHint: 'Hover to show controls',
    ariaPlay: 'Play',
    ariaPause: 'Pause',
    ariaStop: 'Stop',
    ariaPrevSegment: 'Previous segment',
    ariaNextSegment: 'Next segment',
    ariaDismiss: 'Dismiss',
    skipToContent: 'Skip to content',
    nowPlaying: 'Now playing',
    shareNotSupported: 'Sharing is not supported in this browser',
  },
};

let currentLang = localStorage.getItem('mimo_lang') || 'zh-CN';

function t(key, ...args) {
  const entry = I18N[currentLang]?.[key] ?? I18N['zh-CN'][key] ?? key;
  return typeof entry === 'function' ? entry(...args) : entry;
}

function setLang(lang) {
  currentLang = lang;
  try { localStorage.setItem('mimo_lang', lang); } catch (e) { console.warn('localStorage write failed:', e); }
  document.title = t('title');
  document.documentElement.lang = lang;

  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
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

  // Update aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    const translated = t(key);
    if (typeof translated === 'string') el.setAttribute('aria-label', translated);
  });

  // Refresh voice descriptions for current language
  if (typeof state !== 'undefined' && state.characters) {
    for (const [name, char] of Object.entries(state.characters)) {
      if (char.presetKey) {
        char.desc = getPreset(char.presetKey);
      }
    }
  }

  // Re-render dynamic content if visible
  if (typeof renderStep2 === 'function' && !document.getElementById('step2').classList.contains('hidden')) {
    renderStep2();
  }
  if (typeof renderStep3 === 'function' && !document.getElementById('step3').classList.contains('hidden')) {
    renderStep3();
  }
}
