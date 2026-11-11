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

let ctx = null
let currentVoice = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, duration, type = 'sine', volume = 0.25) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, c.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(volume, c.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + duration + 0.05)
}

function playCorrect() {
  tone(523.25, 0, 0.18)
  tone(659.25, 0.1, 0.18)
  tone(783.99, 0.2, 0.18)
  tone(1046.5, 0.3, 0.45)
}

function playWrong() {
  tone(220, 0, 0.18, 'sawtooth', 0.18)
  tone(160, 0.2, 0.3, 'sawtooth', 0.18)
}

function playVoice(path) {
  if (currentVoice) currentVoice.pause()
  const audio = new Audio(path)
  currentVoice = audio
  audio.play().catch(() => {})
}

export function playReaction(correct, lang = 'en') {
  if (correct) playCorrect()
  else playWrong()

  const kind = correct ? 'correct' : 'wrong'
  const count = (VOICE_COUNT[lang] || {})[kind] || 0
  if (count === 0) return

  const n = Math.floor(Math.random() * count) + 1
  const path = `${voiceFolder(lang)}/${kind}${n}.${AUDIO_EXT[lang] || 'mp3'}`
  setTimeout(() => playVoice(path), correct ? 800 : 550)
}

export function playFinish(good) {
  if (good) {
    tone(523.25, 0, 0.16, 'triangle', 0.28)
    tone(659.25, 0.14, 0.16, 'triangle', 0.28)
    tone(783.99, 0.28, 0.16, 'triangle', 0.28)
    tone(1046.5, 0.42, 0.7, 'triangle', 0.3)
    tone(1318.5, 0.42, 0.7, 'sine', 0.18)
    tone(1568.0, 0.42, 0.7, 'sine', 0.14)
  } else {
    tone(392.0, 0, 0.35, 'sine', 0.22)
    tone(523.25, 0.3, 0.6, 'sine', 0.22)
  }
}