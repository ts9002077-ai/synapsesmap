import { theme } from './theme'

export default function ScoreBoard({ score, streak, lit, total, toast }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          pointerEvents: 'none',
          color: 'white',
          textAlign: 'left',
          fontFamily: theme.font,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, color: theme.glow }}>⚡ {score}</div>
        <div style={{ opacity: 0.8 }}>
          {lit} / {total} connections{streak >= 2 ? `  ·  🔥 ${streak}` : ''}
        </div>
      </div>

      {toast && (
        <div
          key={toast.id}
          style={{
            position: 'absolute',
            top: 90,
            left: 16,
            zIndex: 10,
            pointerEvents: 'none',
            fontSize: 22,
            fontWeight: 600,
            color: theme.glow,
            fontFamily: theme.font,
            animation: 'floatUp 1.6s ease forwards',
          }}
        >
          {toast.text}
        </div>
      )}
    </>
  )
}