import { useEffect, useRef, useState } from 'react'
import { BaseEdge, getBezierPath } from '@xyflow/react'
import { theme } from './theme'

function Pulse({ path, reverse }) {
  const pathRef = useRef(null)
  const [state, setState] = useState(null)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    const start = performance.now()
    const duration = 1100
    let raf

    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      const pts = []

      for (let k = 0; k < 5; k++) {
        const e = Math.max(0, eased - k * 0.03)
        const at = (reverse ? 1 - e : e) * len
        const pt = el.getPointAtLength(at)
        pts.push({ x: pt.x, y: pt.y })
      }

      setState({ pts, p })
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [path, reverse])

  const fade = state ? Math.min(1, state.p * 8, (1 - state.p) * 6) : 0

  return (
    <>
      <path ref={pathRef} d={path} fill="none" stroke="none" />
      {state &&
        state.p < 1 &&
        state.pts.map((pt, k) =>
          k === 0 ? (
            <g key={k}>
              <circle cx={pt.x} cy={pt.y} r="16" fill={theme.glow} opacity={0.22 * fade} />
              <circle cx={pt.x} cy={pt.y} r="6" fill="#ffffff" opacity={fade} />
            </g>
          ) : (
            <circle
              key={k}
              cx={pt.x}
              cy={pt.y}
              r={5 - k * 0.8}
              fill={theme.glow}
              opacity={fade * (0.6 - k * 0.12)}
            />
          )
        )}
    </>
  )
}

export default function SynapseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
}) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge id={id} path={path} style={style} />
      {data && data.pulse && <Pulse key={data.pulse} path={path} reverse={!!data.reverse} />}
    </>
  )
}