import { useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { theme } from './theme'

const sizes = {
  large: { padding: '20px 36px', fontSize: 20 },
  medium: { padding: '15px 26px', fontSize: 16 },
  small: { padding: '12px 20px', fontSize: 14 },
}

// Remembers which nodes already played their intro, so it plays once per visit
const seen = new Set()

export default function SynapseNode({ id, data }) {
  const lit = data.lit
  const s = sizes[data.size] || sizes.small
  const num = parseInt(id, 10) || 0
  const key = `${id}|${data.label}`
  const delay = num * 0.11
  const [intro] = useState(() => !seen.has(key))

  useEffect(() => {
    const timer = setTimeout(() => seen.add(key), (delay + 1.2) * 1000)
    return () => clearTimeout(timer)
  }, [key, delay])

  return (
    <div style={{ animation: intro ? `nodeIn 0.8s ease ${delay}s both` : 'none' }}>
      <div
        style={{
          padding: s.padding,
          borderRadius: 999,
          background: lit ? theme.glow : theme.nodeFill,
          color: lit ? '#1a1a1a' : theme.text,
          border: `2px solid ${lit ? theme.glow : theme.nodeBorder}`,
          boxShadow: lit ? `0 0 26px ${theme.glow}` : `0 0 12px ${theme.accent}66`,
          fontFamily: theme.font,
          fontSize: s.fontSize,
          fontWeight: 600,
          textAlign: 'center',
          transition: 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease',
          animation: lit
            ? 'popIn 0.7s ease, ringPulse 1.4s ease-out'
            : 'idleGlow 4s ease-in-out infinite',
          animationDelay: lit ? '0s' : `${(num % 7) * 0.5}s`,
        }}
      >
        <Handle type="target" position={Position.Top} style={{ background: theme.accent, border: 'none' }} />
        {data.label}
        <Handle type="source" position={Position.Bottom} style={{ background: theme.accent, border: 'none' }} />
      </div>
    </div>
  )
}