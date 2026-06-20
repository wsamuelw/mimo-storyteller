#!/usr/bin/env node
// MiMo TTS Voice Clone API Benchmark
// Usage: MIMO_API_KEY=xxx node benchmark-api.js
//
// Tests:
// 1. Region latency (standard, cn, sgp) x 3 runs each
// 2. Audio format (wav vs mp3) - payload size & latency
// 3. Model variants (voicedesign, voiceclone, tts)
// 4. Payload variations (system role, short desc, voice param, temperature)

const API_KEY = process.env.MIMO_API_KEY;
if (!API_KEY) {
  console.error('Usage: MIMO_API_KEY=your_key node benchmark-api.js');
  process.exit(1);
}

const ENDPOINTS = {
  standard: 'https://api.xiaomimimo.com/v1/chat/completions',
  cn: 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions',
  sgp: 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions',
};

const TEST_TEXT = '你好世界';
const VOICE_DESC = '一个沉稳温和的中年男性声音，语速适中，吐字清晰。';

async function callAPI(url, payload) {
  const start = performance.now();
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'api-key': API_KEY,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    });
    const elapsed = Math.round(performance.now() - start);
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      return { elapsed, error: `HTTP ${resp.status}: ${body.substring(0, 150)}` };
    }
    const data = await resp.json();
    const audioData = data?.choices?.[0]?.message?.audio?.data;
    const audioKB = audioData ? Math.round(atob(audioData).length / 1024) : 0;
    return { elapsed, audioKB };
  } catch (e) {
    return { elapsed: Math.round(performance.now() - start), error: e.message };
  }
}

function avg(arr) { return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length); }
function min(arr) { return Math.min(...arr); }
function max(arr) { return Math.max(...arr); }

async function run() {
  console.log('MiMo TTS API Benchmark');
  console.log('='.repeat(60));
  console.log(`Test text: "${TEST_TEXT}" (${TEST_TEXT.length} chars)\n`);

  // --- Test 1: Region latency ---
  console.log('1. REGION LATENCY (3 runs each, wav format, voicedesign model)');
  console.log('-'.repeat(60));
  const regionTimings = {};
  for (const [region, url] of Object.entries(ENDPOINTS)) {
    const timings = [];
    const sizes = [];
    for (let run = 1; run <= 3; run++) {
      process.stdout.write(`   ${region} run ${run}/3 ... `);
      const payload = {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: VOICE_DESC },
          { role: 'assistant', content: TEST_TEXT },
        ],
        audio: { format: 'wav' },
      };
      const r = await callAPI(url, payload);
      if (r.error) {
        console.log(`FAIL (${r.elapsed}ms) ${r.error}`);
      } else {
        console.log(`${r.elapsed}ms (${r.audioKB}KB)`);
        timings.push(r.elapsed);
        sizes.push(r.audioKB);
      }
    }
    regionTimings[region] = timings;
    if (timings.length) {
      console.log(`   => avg=${avg(timings)}ms min=${min(timings)}ms max=${max(timings)}ms avgSize=${avg(sizes)}KB`);
    }
    console.log();
  }

  // Find fastest region
  const regionAvgs = Object.entries(regionTimings)
    .filter(([, t]) => t.length > 0)
    .map(([r, t]) => ({ region: r, avg: avg(t), min: min(t) }))
    .sort((a, b) => a.avg - b.avg);
  if (regionAvgs.length > 1) {
    const fastest = regionAvgs[0];
    const slowest = regionAvgs[regionAvgs.length - 1];
    const diff = slowest.avg - fastest.avg;
    const pct = Math.round((diff / slowest.avg) * 100);
    console.log(`   WINNER: ${fastest.region} (avg ${fastest.avg}ms)`);
    console.log(`   vs slowest ${slowest.region} (avg ${slowest.avg}ms): ${diff}ms faster (${pct}%)\n`);
  }

  // --- Test 2: Audio format ---
  console.log('2. AUDIO FORMAT (wav vs mp3, sgp endpoint, 2 runs each)');
  console.log('-'.repeat(60));
  for (const format of ['wav', 'mp3']) {
    const timings = [];
    const sizes = [];
    for (let run = 1; run <= 2; run++) {
      process.stdout.write(`   ${format} run ${run}/2 ... `);
      const payload = {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: VOICE_DESC },
          { role: 'assistant', content: TEST_TEXT },
        ],
        audio: { format },
      };
      const r = await callAPI(ENDPOINTS.sgp, payload);
      if (r.error) {
        console.log(`FAIL (${r.elapsed}ms) ${r.error}`);
      } else {
        console.log(`${r.elapsed}ms (${r.audioKB}KB)`);
        timings.push(r.elapsed);
        sizes.push(r.audioKB);
      }
    }
    if (timings.length) {
      console.log(`   => avg=${avg(timings)}ms avgSize=${avg(sizes)}KB`);
    }
    console.log();
  }

  // --- Test 3: Model variants ---
  console.log('3. MODEL VARIANTS (sgp endpoint, wav format)');
  console.log('-'.repeat(60));
  const models = [
    'mimo-v2.5-tts-voicedesign',
    'mimo-v2.5-tts-voiceclone',
    'mimo-v2.5-tts',
  ];
  for (const model of models) {
    process.stdout.write(`   ${model} ... `);
    const payload = {
      model,
      messages: [
        { role: 'user', content: VOICE_DESC },
        { role: 'assistant', content: TEST_TEXT },
      ],
      audio: { format: 'wav', ...(model === 'mimo-v2.5-tts' ? { voice: 'mimo_default' } : {}) },
    };
    const r = await callAPI(ENDPOINTS.sgp, payload);
    if (r.error) {
      console.log(`FAIL (${r.elapsed}ms) ${r.error}`);
    } else {
      console.log(`${r.elapsed}ms (${r.audioKB}KB)`);
    }
  }
  console.log();

  // --- Test 4: Payload variations ---
  console.log('4. PAYLOAD VARIATIONS (sgp endpoint)');
  console.log('-'.repeat(60));

  const variations = [
    {
      label: 'system role for voice desc',
      payload: {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'system', content: VOICE_DESC },
          { role: 'user', content: TEST_TEXT },
        ],
        audio: { format: 'wav' },
      },
    },
    {
      label: 'short voice desc (4 chars)',
      payload: {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: '中年男性' },
          { role: 'assistant', content: TEST_TEXT },
        ],
        audio: { format: 'wav' },
      },
    },
    {
      label: 'no audio.format field',
      payload: {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: VOICE_DESC },
          { role: 'assistant', content: TEST_TEXT },
        ],
      },
    },
    {
      label: 'with voice: mimo_default',
      payload: {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: VOICE_DESC },
          { role: 'assistant', content: TEST_TEXT },
        ],
        audio: { format: 'wav', voice: 'mimo_default' },
      },
    },
    {
      label: 'with temperature: 0.5',
      payload: {
        model: 'mimo-v2.5-tts-voicedesign',
        messages: [
          { role: 'user', content: VOICE_DESC },
          { role: 'assistant', content: TEST_TEXT },
        ],
        audio: { format: 'wav' },
        temperature: 0.5,
      },
    },
  ];

  for (const v of variations) {
    process.stdout.write(`   ${v.label} ... `);
    const r = await callAPI(ENDPOINTS.sgp, v.payload);
    if (r.error) {
      console.log(`FAIL (${r.elapsed}ms) ${r.error}`);
    } else {
      console.log(`${r.elapsed}ms (${r.audioKB}KB)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Benchmark complete.');
}

run().catch(console.error);
