import { useEffect, useRef, useState } from 'react'
import { theme } from './theme'

function useCountUp(target) {
  const [value, setValue] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const start = from.current
    if (start === target) return
    const t0 = performance.now()
    let raf

    function tick(now) {
      const p = Math.min((now - t0) / 500, 1)
      const v = Math.round(start + (target - start) * p)
      setValue(v)
      from.current = v
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return value
}

export default function ScoreBoard({ score, streak, lit, total, toast, label = 'connections' }) {
  const shown = useCountUp(score)

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
        <div
          key={score}
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: theme.glow,
            display: 'inline-block',
            transformOrigin: 'left center',
            animation: 'popIn 0.4s ease',
          }}
        >
          ⚡ {shown}
        </div>
        <div style={{ opacity: 0.8 }}>
          {lit} / {total} {label}
          {streak >= 2 ? `  ·  🔥 ${streak}` : ''}
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