import { useState } from 'react'
import { theme } from './theme'
import { nodes, mcq, written } from './data'

const steps = [
  'Reading your notes...',
  'Finding key concepts...',
  'Building the synapse map...',
  'Writing questions...',
]

export default function UploadPanel({ onDone }) {
  const [stage, setStage] = useState('idle')
  const [progress, setProgress] = useState(0)

  function start() {
    if (stage !== 'idle') return
    setStage('working')
    setProgress(0)
    let p = 0
    const timer = setInterval(() => {
      p += 4
      setProgress(p)
      if (p >= 100) {
        clearInterval(timer)
        setStage('done')
      }
    }, 120)
  }

  const step = steps[Math.min(Math.floor(progress / 25), steps.length - 1)]

  return (
    <div>
      <h2>Upload study notes</h2>

      {stage === 'idle' && (
        <div
          onClick={start}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            start()
          }}
          style={{
            border: `2px dashed ${theme.accent}`,
            borderRadius: 12,
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#12122a',
          }}
        >
          <div style={{ fontSize: 36 }}>📄</div>
          <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>Drop your notes here</p>
          <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>PDF, DOCX or TXT · click to start</p>
        </div>
      )}

      {stage === 'working' && (
        <div style={{ padding: '30px 0' }}>
          <p style={{ color: theme.glow, fontWeight: 600 }}>{step}</p>
          <div style={{ height: 10, borderRadius: 5, background: '#1f1f3a', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: theme.accent,
                transition: 'width 0.12s linear',
              }}
            />
          </div>
          <p style={{ opacity: 0.6, fontSize: 13 }}>{progress}%</p>
        </div>
      )}

      {stage === 'done' && (
        <div
          style={{
            border: `1px solid ${theme.accent}`,
            borderRadius: 12,
            padding: 20,
            background: '#12122a',
          }}
        >
          <p style={{ color: '#4ade80', fontWeight: 600, marginTop: 0 }}>
            ✓ Photosynthesis (prepared sample) loaded
          </p>
          <p style={{ margin: '4px 0' }}>{nodes.length} concepts mapped</p>
          <p style={{ margin: '4px 0' }}>
            {mcq.length} multiple-choice + {written.length} written questions
          </p>
          <button
            onClick={onDone}
            style={{
              marginTop: 14,
              width: '100%',
              padding: 12,
              border: 'none',
              borderRadius: 8,
              background: theme.accent,
              color: 'white',
              fontFamily: theme.font,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Open my map
          </button>
        </div>
      )}

      <p style={{ opacity: 0.5, fontSize: 12, marginTop: 20 }}>
        Prototype: this loads a prepared Photosynthesis sample.
      </p>
    </div>
  )
}