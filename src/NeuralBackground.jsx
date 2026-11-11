import { useEffect, useRef } from 'react'

export default function NeuralBackground({ count = 50 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const mouse = { x: -1000, y: -1000 }
    let w = 0
    let h = 0
    let dots = []
    let raf

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1.5 + Math.random() * 2,
      }))
    }

    function onMove(e) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function frame() {
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > w) d.vx *= -1
        if (d.y < 0 || d.y > h) d.vy *= -1
      }

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i]

        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 150) {
            ctx.strokeStyle = `rgba(124, 92, 255, ${0.28 * (1 - dist / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y)
        if (md < 180) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * (1 - md / 180)})`
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      for (const d of dots) {
        ctx.fillStyle = 'rgba(160, 140, 255, 0.85)'
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }

    resize()
    frame()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [count])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}