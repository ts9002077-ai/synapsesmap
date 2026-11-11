// File type of your recordings for each language (for example 'mp3', 'm4a', 'wav' or 'ogg')
const AUDIO_EXT = { en: 'mp3', ms: 'ogg' }

// How many voice clips you recorded for each language and reaction
const VOICE_COUNT = {
  en: { correct: 1, wrong: 1 },
  ms: { correct: 3, wrong: 3 },
}

// English clips live in /audio, other languages in /audio/<language>
function voiceFolder(lang) {
  return lang === 'en' ? '/audio' : `/audio/${lang}`
}

const RATE = 22050

const SOUNDS = {
  correct: {
    seconds: 0.9,
    notes: [
      { freq: 523.25, start: 0, duration: 0.18, type: 'sine', volume: 0.5 },
      { freq: 659.25, start: 0.1, duration: 0.18, type: 'sine', volume: 0.5 },
      { freq: 783.99, start: 0.2, duration: 0.18, type: 'sine', volume: 0.5 },
      { freq: 1046.5, start: 0.3, duration: 0.5, type: 'sine', volume: 0.5 },
    ],
  },
  wrong: {
    seconds: 0.6,
    notes: [
      { freq: 220, start: 0, duration: 0.2, type: 'sawtooth', volume: 0.3 },
      { freq: 160, start: 0.2, duration: 0.32, type: 'sawtooth', volume: 0.3 },
    ],
  },
  finishGood: {
    seconds: 1.3,
    notes: [
      { freq: 523.25, start: 0, duration: 0.16, type: 'triangle', volume: 0.5 },
      { freq: 659.25, start: 0.14, duration: 0.16, type: 'triangle', volume: 0.5 },
      { freq: 783.99, start: 0.28, duration: 0.16, type: 'triangle', volume: 0.5 },
      { freq: 1046.5, start: 0.42, duration: 0.8, type: 'triangle', volume: 0.4 },
      { freq: 1318.5, start: 0.42, duration: 0.8, type: 'sine', volume: 0.25 },
      { freq: 1568.0, start: 0.42, duration: 0.8, type: 'sine', volume: 0.18 },
    ],
  },
  finishSoft: {
    seconds: 1.0,
    notes: [
      { freq: 392.0, start: 0, duration: 0.4, type: 'sine', volume: 0.45 },
      { freq: 523.25, start: 0.3, duration: 0.65, type: 'sine', volume: 0.45 },
    ],
  },
}

const urls = {}
let currentVoice = null

// Builds the sound as raw samples
function render(def) {
  const total = Math.floor(RATE * def.seconds)
  const data = new Float32Array(total)

  for (const n of def.notes) {
    const start = Math.floor(n.start * RATE)
    const len = Math.floor(n.duration * RATE)

    for (let i = 0; i < len && start + i < total; i++) {
      const time = i / RATE
      const attack = Math.min(1, i / (RATE * 0.02))
      const decay = Math.pow(1 - i / len, 2)
      const cycle = (n.freq * time) % 1
      let wave

      if (n.type === 'sawtooth') wave = 2 * cycle - 1
      else if (n.type === 'triangle') wave = 2 * Math.abs(2 * cycle - 1) - 1
      else wave = Math.sin(2 * Math.PI * n.freq * time)

      data[start + i] += wave * n.volume * attack * decay
    }
  }

  return data
}

// Wraps the samples in a WAV file so it can play like any other audio file
function toWavUrl(data) {
  const buffer = new ArrayBuffer(44 + data.length * 2)
  const view = new DataView(buffer)

  function write(offset, text) {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
  }

  write(0, 'RIFF')
  view.setUint32(4, 36 + data.length * 2, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, RATE, true)
  view.setUint32(28, RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, data.length * 2, true)

  for (let i = 0; i < data.length; i++) {
    const s = Math.max(-1, Math.min(1, data[i]))
    view.setInt16(44 + i * 2, s * 32767, true)
  }

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }))
}

function playSound(name) {
  if (!urls[name]) urls[name] = toWavUrl(render(SOUNDS[name]))
  const audio = new Audio(urls[name])
  audio.play().catch(() => {})
}

function playVoice(path) {
  if (currentVoice) currentVoice.pause()
  const audio = new Audio(path)
  currentVoice = audio
  audio.play().catch(() => {})
}

export function playReaction(correct, lang = 'en') {
  playSound(correct ? 'correct' : 'wrong')

  const kind = correct ? 'correct' : 'wrong'
  const count = (VOICE_COUNT[lang] || {})[kind] || 0
  if (count === 0) return

  const n = Math.floor(Math.random() * count) + 1
  const path = `${voiceFolder(lang)}/${kind}${n}.${AUDIO_EXT[lang] || 'mp3'}`
  setTimeout(() => playVoice(path), correct ? 800 : 550)
}

export function playFinish(good) {
  playSound(good ? 'finishGood' : 'finishSoft')
}