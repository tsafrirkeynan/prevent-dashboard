import { useEffect, useRef, useState } from 'react'

const USER_TYPES = {
  car:        { color: '#2E86C1', w: 14, h: 8 },
  pedestrian: { color: '#E67E22', w: 6,  h: 6 },
  cyclist:    { color: '#27AE60', w: 7,  h: 5 },
  motorcycle: { color: '#F39C12', w: 9,  h: 5 },
}

function randomUser() {
  const types = ['car','car','car','pedestrian','cyclist','motorcycle']
  return types[Math.floor(Math.random() * types.length)]
}

function randomAgent(id) {
  const routes = [
    { axis: 'h', start: -20, end: 220, top:  64, speed: 0.8 + Math.random() * 0.6 },
    { axis: 'h', start: 220, end: -20, top:  84, speed: 0.8 + Math.random() * 0.6 },
    { axis: 'v', start: -20, end: 180, left: 97, speed: 0.7 + Math.random() * 0.6 },
    { axis: 'v', start: 180, end: -20, left: 113,speed: 0.7 + Math.random() * 0.6 },
  ]
  const route = routes[Math.floor(Math.random() * routes.length)]
  const type  = randomUser()
  return { id, type, route, pos: route.start + Math.random() * (route.end - route.start), ...USER_TYPES[type] }
}

export default function CameraFeed({ intersectionId }) {
  const [agents, setAgents] = useState(() => Array.from({ length: 8 }, (_, i) => randomAgent(i)))
  const [flash,  setFlash]  = useState(false)
  const rafRef  = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    lastRef.current = null
    const nearMissTimer = setInterval(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 600)
    }, 12000 + Math.random() * 8000)

    const animate = (ts) => {
      if (!lastRef.current) lastRef.current = ts
      const dt = Math.min((ts - lastRef.current) / 16, 3)
      lastRef.current = ts
      setAgents(prev => prev.map(a => {
        const dir  = a.route.end > a.route.start ? 1 : -1
        let pos    = a.pos + a.route.speed * dt * dir
        const past = dir > 0 ? pos > a.route.end + 30 : pos < a.route.end - 30
        return past ? randomAgent(a.id) : { ...a, pos }
      }))
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(nearMissTimer)
    }
  }, [intersectionId])

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{ background: '#0a1520', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="absolute top-2 left-2 text-xs text-ts flex items-center gap-1.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-alert animate-pulse inline-block" />
        LIVE · CAM-01
      </div>
      <svg width="200" height="160" viewBox="0 0 200 160" style={{ display: 'block', width: '100%' }}>
        <rect width="200" height="160" fill="#0a1520" />
        <rect x="0"  y="58" width="200" height="44" fill="#1e2d3d" />
        <rect x="88" y="0"  width="34"  height="160" fill="#1e2d3d" />
        <rect x="88" y="58" width="34"  height="44"  fill="#243344" />
        {[10,30,50].map(x  => <rect key={`dh-l-${x}`}  x={x}   y={78}  width={14} height={4} rx="2" fill="#2a3f52" />)}
        {[140,160,180].map(x => <rect key={`dh-r-${x}`} x={x}   y={78}  width={14} height={4} rx="2" fill="#2a3f52" />)}
        {[10,30,50,70].map(y  => <rect key={`dv-t-${y}`}  x={103} y={y}   width={4}  height={12} rx="2" fill="#2a3f52" />)}
        {[100,120,135].map(y  => <rect key={`dv-b-${y}`}  x={103} y={y}   width={4}  height={12} rx="2" fill="#2a3f52" />)}
        {flash && <rect x="0" y="0" width="200" height="160" fill="rgba(192,57,43,0.25)" />}
        {agents.map(a => {
          const x = a.route.axis === 'h' ? a.pos           : a.route.left - a.w / 2
          const y = a.route.axis === 'v' ? a.pos           : a.route.top  - a.h / 2
          return <rect key={a.id} x={x} y={y} width={a.w} height={a.h} rx="2" fill={a.color} opacity="0.9" />
        })}
        {flash && (
          <text x="100" y="85" textAnchor="middle" fill="#C0392B" fontSize="9" fontWeight="bold">⚠ NEAR-MISS</text>
        )}
      </svg>
    </div>
  )
}
