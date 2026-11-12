import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { theme } from './theme'
import { BADGES, LABELS } from './badges'
import { playBadge } from './sounds'

export default function BadgePop({ id, lang, onDone }) {
  const badge = BADGES.find((b) => b.id === id)

  useEffect(() => {
    playBadge()
    const timer = setTimeout(onDone, 3400)
    return () => clearTimeout(timer)
  }, [])

  if (!badge) return null
  const text = badge[lang] || badge.en

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 20px',
          borderRadius: 16,
          background: 'rgba(13, 13, 26, 0.94)',
          border: `2px solid ${theme.glow}`,
          boxShadow: `0 0 28px ${theme.glow}66`,
          color: 'white',
          fontFamily: theme.font,
          animation: 'badgePop 3.4s ease forwards',
        }}
      >
        <div style={{ fontSize: 36 }}>{badge.icon}</div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: theme.glow }}>
            {LABELS[lang] || LABELS.en}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{text.title}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{text.text}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}