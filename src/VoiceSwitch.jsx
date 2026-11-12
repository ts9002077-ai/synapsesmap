import { theme } from './theme'

export default function VoiceSwitch({ voice, onChange, t }) {
  const options = [
    ['male', t.voiceMale, t.voiceMaleName],
    ['female', t.voiceFemale, t.voiceFemaleName],
  ]

  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid #2d2d52',
        borderRadius: 10,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {options.map(([id, icon, name]) => (
        <button
          key={id}
          className="lift"
          title={`${t.voice}: ${name}`}
          aria-label={`${t.voice}: ${name}`}
          onClick={() => onChange(id)}
          style={{
            padding: '6px 12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            background: voice === id ? theme.accent : 'transparent',
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}