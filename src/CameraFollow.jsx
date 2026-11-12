import { useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'

export default function CameraFollow({ focus, overview, enabled, zoom = 0.9 }) {
  const { setCenter, fitView, getNode, getZoom } = useReactFlow()
  const lastFocus = useRef(focus ? focus.stamp : null)
  const lastOverview = useRef(overview)

  useEffect(() => {
    if (!focus || focus.stamp === lastFocus.current) return
    lastFocus.current = focus.stamp
    if (!enabled) return

    const node = getNode(focus.id)
    if (!node) return

    const w = (node.measured && node.measured.width) || 150
    const h = (node.measured && node.measured.height) || 50

    setCenter(node.position.x + w / 2, node.position.y + h / 2, {
      zoom: Math.max(getZoom(), zoom),
      duration: 800,
    })
  }, [focus])

  useEffect(() => {
    if (overview === lastOverview.current) return
    lastOverview.current = overview
    const timer = setTimeout(() => fitView({ duration: 1400, padding: 0.1 }), 700)
    return () => clearTimeout(timer)
  }, [overview])

  return null
}