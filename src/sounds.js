const RATE = 22050

// Voice clips. Each clip is searched for in /audio and /audio/ms.
const VOICES = {
  male: {
    en: { correct: ['correct1.mp3'], wrong: ['wrong1.mp3'] },
    ms: {
      correct: ['correct1.ogg', 'correct2.ogg', 'correct3.ogg'],
      wrong: ['wrong1.ogg', 'wrong2.ogg', 'wrong3.ogg'],
    },
  },
  female: {
    en: {
      correct: ['correct1.0.mp3', 'correct2.0.mp3', 'correct3.0.mp3'],
      wrong: ['wrong1.0.mp3', 'wrong2.0.mp3', 'wrong3.0.mp3'],
    },
    ms: {
      correct: ['correctms1.mp3', 'correctms2.mp3', 'correctms3.mp3'],
      wrong: ['wrongms1.mp3', 'wrongms2.mp3', 'wrongms3.mp3'],
    },
  },
}

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
  network: {
    seconds: 2.2,
    notes: [
      { freq: 392.0, start: 0, duration: 0.2, type: 'triangle', volume: 0.45 },
      { freq: 523.25, start: 0.15, duration: 0.2, type: 'triangle', volume: 0.45 },
      { freq: 659.25, start: 0.3, duration: 0.2, type: 'triangle', volume: 0.45 },
      { freq: 783.99, start: 0.45, duration: 0.2, type: 'triangle', volume: 0.45 },
      { freq: 1046.5, start: 0.6, duration: 0.25, type: 'triangle', volume: 0.45 },
      { freq: 1318.5, start: 0.75, duration: 0.25, type: 'triangle', volume: 0.45 },
      { freq: 1568.0, start: 0.9, duration: 1.2, type: 'triangle', volume: 0.4 },
      { freq: 1046.5, start: 0.9, duration: 1.2, type: 'sine', volume: 0.25 },
      { freq: 2093.0, start: 0.9, duration: 1.2, type: 'sine', volume: 0.15 },
    ],
  },
  badge: {
    seconds: 0.8,
    notes: [
      { freq: 1318.5, start: 0, duration: 0.15, type: 'sine', volume: 0.45 },
      { freq: 1568.0, start: 0.1, duration: 0.15, type: 'sine', volume: 0.45 },
      { freq: 2093.0, start: 0.2, duration: 0.5, type: 'sine', volume: 0.4 },
    ],
  },
      switchMale: {
    seconds: 0.5,
    notes: [
      { freq: 392.0, start: 0, duration: 0.15, type: 'sine', volume: 0.5 },
      { freq: 293.66, start: 0.12, duration: 0.3, type: 'sine', volume: 0.5 },
    ],
  },
  switchFemale: {
    seconds: 0.5,
    notes: [
      { freq: 659.25, start: 0, duration: 0.15, type: 'sine', volume: 0.5 },
      { freq: 987.77, start: 0.12, duration: 0.3, type: 'sine', volume: 0.5 },
    ],
  },
}

const urls = {}
let currentVoice = null
let token = 0

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

// Wraps the samples in a WAV file so it plays like any other audio file
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

// Tries each address in turn until one plays
function playFirst(list) {
  token += 1
  const mine = token
  if (currentVoice) currentVoice.pause()
  let i = 0

  function attempt() {
    if (mine !== token || i >= list.length) return
    const audio = new Audio(list[i])
    i += 1
    currentVoice = audio
    audio.onerror = attempt
    audio.play().catch(() => {})
  }

  attempt()
}

export function playReaction(correct, lang = 'en', voice = 'male') {
  playSound(correct ? 'correct' : 'wrong')

  const kind = correct ? 'correct' : 'wrong'
  const clips = ((VOICES[voice] || VOICES.male)[lang] || {})[kind] || []
  if (clips.length === 0) return

  const file = clips[Math.floor(Math.random() * clips.length)]
  const folders = lang === 'en' ? ['/audio', '/audio/ms'] : ['/audio/ms', '/audio']
  const list = folders.map((f) => `${f}/${file}`)
  setTimeout(() => playFirst(list), correct ? 800 : 550)
}

export function playFinish(good) {
  playSound(good ? 'finishGood' : 'finishSoft')
}

export function playSwitch(voice) {
  playSound(voice === 'female' ? 'switchFemale' : 'switchMale')
}

export function playNetwork() {
  playSound('network')
}

export function playChime() {
  playSound('correct')
}

export function playBadge() {
  playSound('badge')
}