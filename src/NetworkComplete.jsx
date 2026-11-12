import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { theme } from './theme'

export default function NetworkComplete({ title, subtitle, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const a = setTimeout(() => setLeaving(true), 3200)
    const b = setTimeout(onDone, 3800)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle, ${theme.glow}55, transparent 60%)`,
          animation: 'netFlash 1.2s ease-out forwards',
        }}
      />

      {[0, 0.25, 0.5].map((delay) => (
        <div
          key={delay}
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: `3px solid ${theme.glow}`,
            opacity: 0,
            animation: `netRing 1.6s ease-out ${delay}s forwards`,
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '22px 34px',
          borderRadius: 18,
          maxWidth: '80%',
          background: 'rgba(13, 13, 26, 0.88)',
          border: `2px solid ${theme.glow}`,
          boxShadow: `0 0 40px ${theme.glow}88`,
          color: 'white',
          fontFamily: theme.font,
          animation: 'bannerIn 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) both',
        }}
      >
        <div style={{ fontSize: 42 }}>🧠</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.glow }}>{title}</div>
        <div style={{ opacity: 0.85, marginTop: 4 }}>{subtitle}</div>
      </div>
    </div>,
    document.body
  )
}