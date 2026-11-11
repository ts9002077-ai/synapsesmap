import { useState } from 'react'
import { theme } from './theme'
import { ui } from './ui'

export default function UploadPanel({ topics, onDone }) {
  const [chosen, setChosen] = useState(null)
  const [stage, setStage] = useState('idle')
  const [progress, setProgress] = useState(0)

  function start(topic) {
    if (stage !== 'idle') return
    setChosen(topic)
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

  function pickByName(name) {
    const n = (name || '').toLowerCase()
    return topics.find((x) => n.includes(x.id)) || topics[0]
  }

  const t = chosen ? ui[chosen.lang].up : null
  const step = t ? t.steps[Math.min(Math.floor(progress / 25), t.steps.length - 1)] : ''

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <img
          src="/logo.jpeg"
          alt="SynapseMap Ai"
          style={{
            width: 240,
            WebkitMaskImage: 'radial-gradient(closest-side, black 88%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, black 88%, transparent 100%)',
          }}
        />
        <p style={{ opacity: 0.7, marginTop: 0 }}>Turn pages of notes into an interactive brain map.</p>
      </div>

      {stage === 'idle' && (
        <>
          <div
            onClick={() => start(topics[0])}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const f = e.dataTransfer.files[0]
              start(pickByName(f && f.name))
            }}
            style={{
              border: `2px dashed ${theme.accent}`,
              borderRadius: 12,
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#12122a',
            }}
          >
            <div style={{ fontSize: 36 }}>📄</div>
            <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>Drop your notes here</p>
            <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>PDF, DOCX or TXT</p>
          </div>

          <p style={{ opacity: 0.6, fontSize: 13, margin: '18px 0 8px' }}>Or choose a sample file:</p>
          {topics.map((x) => (
            <button
              key={x.id}
              onClick={() => start(x)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 4,
                width: '100%',
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                border: '1px solid #2d2d52',
                background: '#12122a',
                color: 'white',
                cursor: 'pointer',
                fontFamily: theme.font,
                textAlign: 'left',
              }}
            >
              <span>📄 {x.sample}</span>
              <span style={{ opacity: 0.6, fontSize: 12 }}>{ui[x.lang].up.language}</span>
            </button>
          ))}
        </>
      )}

      {stage === 'working' && (
        <div style={{ padding: '24px 0' }}>
          <p style={{ opacity: 0.7, margin: '0 0 8px' }}>📄 {chosen.sample}</p>
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
            ✓ {chosen.sample} {t.done}
          </p>
          <p style={{ margin: '4px 0' }}>
            {chosen.nodes.length} {t.concepts}
          </p>
          <p style={{ margin: '4px 0' }}>
            {chosen.mcq.length} {t.mcqWord} + {chosen.written.length} {t.writtenWord}
          </p>
          <p style={{ margin: '4px 0', opacity: 0.7 }}>{t.language}</p>
          <button
            onClick={() => onDone(chosen.id)}
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
            {t.open}
          </button>
        </div>
      )}

      <p style={{ opacity: 0.5, fontSize: 12, marginTop: 20 }}>
        Prototype: this loads prepared sample notes.
      </p>
    </div>
  )
}