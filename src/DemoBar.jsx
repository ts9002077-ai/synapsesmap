import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { theme } from './theme'

export default function DemoBar({ caption, progress, stopLabel, onStop, right = 16, bottom = 24 }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onStop()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStop])

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} />

      <div
        style={{
          position: 'fixed',
          left: 16,
          right,
          bottom,
          zIndex: 41,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'min(680px, 100%)',
            background: 'rgba(13, 13, 26, 0.92)',
            border: `1px solid ${theme.accent}`,
            borderRadius: 14,
            padding: '12px 14px',
            color: 'white',
            fontFamily: theme.font,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div key={caption} style={{ flex: 1, fontSize: 15, lineHeight: 1.4, animation: 'fadeUp 0.4s ease both' }}>
              {caption}
            </div>
            <button
              className="lift"
              onClick={onStop}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #2d2d52',
                background: '#12122a',
                color: 'white',
                fontFamily: theme.font,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ⏹ {stopLabel}
            </button>
          </div>

          <div style={{ height: 4, borderRadius: 2, background: '#1f1f3a', marginTop: 10, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.round(progress * 100)}%`,
                background: `linear-gradient(90deg, ${theme.accent}, #38bdf8)`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}