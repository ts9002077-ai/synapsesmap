import { useState } from 'react'
import { theme } from './theme'

export function Diagram() {
  return (
    <>
      <svg viewBox="0 0 320 280" style={{ width: '100%', background: '#10101c', borderRadius: 8 }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#facc15" />
          </marker>
        </defs>

        <circle cx="45" cy="45" r="22" fill="#facc15" />
        <text x="45" y="85" fill="white" fontSize="11" textAnchor="middle">Sunlight</text>
        <line x1="65" y1="62" x2="120" y2="112" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />

        <path
          d="M120 160 Q 160 80 260 100 Q 250 200 140 205 Q 125 185 120 160 Z"
          fill="#166534" stroke="#4ade80" strokeWidth="2"
        />
        <text x="190" y="148" fill="white" fontSize="12" textAnchor="middle">Leaf</text>
        <text x="190" y="164" fill="white" fontSize="10" textAnchor="middle">(chloroplasts)</text>

        <line x1="300" y1="62" x2="258" y2="105" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="305" y="50" fill="white" fontSize="11" textAnchor="end">CO₂ in</text>

        <line x1="40" y1="235" x2="130" y2="198" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="15" y="255" fill="white" fontSize="11">Water (from roots)</text>

        <line x1="235" y1="198" x2="285" y2="238" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="310" y="256" fill="white" fontSize="11" textAnchor="end">O₂ out</text>

        <line x1="180" y1="206" x2="180" y2="236" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="180" y="254" fill="white" fontSize="11" textAnchor="middle">Glucose</text>
      </svg>

      <p style={{ marginTop: 16 }}><b>6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂</b></p>
    </>
  )
}

export function DiagramImage({ src, hint }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <Diagram />

  return (
    <>
      <a href={src} target="_blank" rel="noreferrer">
        <img
          src={src}
          alt="Diagram"
          onError={() => setFailed(true)}
          style={{ width: '100%', borderRadius: 8, background: '#10101c' }}
        />
      </a>
      <p style={{ opacity: 0.7, fontSize: 13 }}>{hint}</p>
    </>
  )
}

const exts = ['png', 'jpg']

function Portrait({ file, name }) {
  const [i, setI] = useState(0)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')

  const box = { width: 64, height: 64, borderRadius: '50%', flexShrink: 0 }

  if (i >= exts.length) {
    return (
      <div
        style={{
          ...box,
          background: '#1f1f3a',
          border: `2px solid ${theme.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={`/people/${file}.${exts[i]}`}
      alt={name}
      onError={() => setI(i + 1)}
      style={{ ...box, objectFit: 'cover', border: `2px solid ${theme.accent}` }}
    />
  )
}

export function PeopleDiagram({ people, timeline, t }) {
  return (
    <>
      <h3 style={{ marginTop: 0 }}>{t.timeline}</h3>
      <div style={{ borderLeft: `2px solid ${theme.accent}`, paddingLeft: 12, marginBottom: 22 }}>
        {timeline.map(([year, text]) => (
          <div key={year} style={{ marginBottom: 10 }}>
            <b style={{ color: theme.glow }}>{year}</b>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{text}</div>
          </div>
        ))}
      </div>

      <h3>{t.people}</h3>
      {people.map((p) => (
        <div key={p.file} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <Portrait file={p.file} name={p.name} />
          <div>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>{p.role}</div>
          </div>
        </div>
      ))}
    </>
  )
}