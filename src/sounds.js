// Change this if your recordings are not mp3 (for example 'm4a', 'wav' or 'ogg')
const AUDIO_EXT = 'mp3'

// How many voice clips you recorded for each reaction
const VOICE_COUNT = { correct: 1, wrong: 1 }

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

export function playVoice(name) {
  if (currentVoice) currentVoice.pause()
  const audio = new Audio(`/audio/${name}.${AUDIO_EXT}`)
  currentVoice = audio
  audio.play().catch(() => {})
}

export function playReaction(correct) {
  if (correct) playCorrect()
  else playWrong()

  const kind = correct ? 'correct' : 'wrong'
  const n = Math.floor(Math.random() * VOICE_COUNT[kind]) + 1
  setTimeout(() => playVoice(`${kind}${n}`), correct ? 800 : 550)
}