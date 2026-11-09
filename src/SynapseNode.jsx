import { Handle, Position } from '@xyflow/react'
import { theme } from './theme'

const sizes = {
  large: { padding: '20px 36px', fontSize: 20 },
  medium: { padding: '15px 26px', fontSize: 16 },
  small: { padding: '12px 20px', fontSize: 14 },
}

export default function SynapseNode({ data }) {
  const lit = data.lit
  const s = sizes[data.size] || sizes.small

  return (
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
        animation: lit ? 'popIn 0.7s ease, ringPulse 1.4s ease-out' : 'none',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: theme.accent, border: 'none' }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ background: theme.accent, border: 'none' }} />
    </div>
  )
}