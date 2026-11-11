import { useEffect, useRef, useState } from 'react'
import { theme } from './theme'
import NeuralBackground from './NeuralBackground'

const fade = 'radial-gradient(closest-side, black 88%, transparent 100%)'

export default function Splash({ onFinish }) {
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  function finish() {
    if (done.current) return
    done.current = true
    setLeaving(true)
    setTimeout(onFinish, 600)
  }

  useEffect(() => {
    const timer = setTimeout(finish, 3600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.logoBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'white',
        fontFamily: theme.font,
        overflow: 'hidden',
        animation: leaving ? 'splashOut 0.6s ease forwards' : 'none',
      }}
    >
      <NeuralBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: 'min(420px, 50vh, 80vw)', animation: 'floatY 4.5s ease-in-out infinite' }}>
          <div style={{ position: 'relative' }}>
            <img
              src="/logo.jpeg"
              alt="SynapseMap Ai"
              style={{
                width: '100%',
                display: 'block',
                animation: 'logoIn 1.3s ease-out both',
                WebkitMaskImage: fade,
                maskImage: fade,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, rgba(90,130,255,0.35), transparent 60%)',
                mixBlendMode: 'screen',
                animation: 'glowBreath 3.2s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        <p
          style={{
            margin: '4px 0 0',
            fontSize: 18,
            letterSpacing: 0.5,
            opacity: 0,
            animation: 'fadeUp 0.9s ease 1.1s forwards',
          }}
        >
          Turn notes into a living brain map
        </p>

        <div
          style={{
            width: 220,
            height: 4,
            borderRadius: 2,
            background: '#1f1f3a',
            marginTop: 28,
            overflow: 'hidden',
            opacity: 0,
            animation: 'fadeUp 0.6s ease 1.2s forwards',
          }}
        >
          <div
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${theme.accent}, #38bdf8)`,
              animation: 'fillBar 2.2s ease-in-out 1.2s both',
            }}
          />
        </div>
      </div>

      <p style={{ position: 'absolute', bottom: 24, zIndex: 1, opacity: 0.4, fontSize: 13 }}>
        Click anywhere to skip
      </p>
    </div>
  )
}