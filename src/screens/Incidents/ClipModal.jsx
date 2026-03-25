import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

function ReplayFeed({ playing }) {
  const [pos, setPos]     = useState(0)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => {
      setPos(p => {
        const np = p + 0.8
        if (np >= 50) { setFlash(true); setTimeout(() => setFlash(false), 500) }
        return np > 100 ? 0 : np
      })
    }, 60)
    return () => clearInterval(iv)
  }, [playing])

  return (
    <svg width="320" height="180" viewBox="0 0 320 180" style={{ display: 'block', margin: '0 auto' }}>
      <rect width="320" height="180" fill="#0a1520" />
      <rect x="0"   y="78" width="320" height="24" fill="#1e2d3d" />
      <rect x="148" y="0"  width="24"  height="180" fill="#1e2d3d" />
      <rect x="148" y="78" width="24"  height="24"  fill="#243344" />
      {flash && <rect width="320" height="180" fill="rgba(192,57,43,0.35)" />}
      <rect x={pos * 2.8} y="84"  width="18" height="10" rx="2" fill="#2E86C1" />
      <rect x="156"       y={pos * 1.4} width="10" height="18" rx="2" fill="#C0392B" />
      {flash && <text x="160" y="95" textAnchor="middle" fill="#C0392B" fontSize="11" fontWeight="bold">⚠</text>}
    </svg>
  )
}

export default function ClipModal({ incident, onClose }) {
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!incident) return
    setPlaying(false)
    setProgress(0)
  }, [incident])

  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPlaying(false); return 100 }
        return p + 1
      })
    }, 40)
    return () => clearInterval(iv)
  }, [playing])

  return (
    <AnimatePresence>
      {incident && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="rounded-2xl overflow-hidden w-full max-w-lg"
            style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="text-tp font-semibold">{incident.type} — {incident.intersection}</div>
                <div className="text-ts text-xs">{incident.ts} · {incident.city}</div>
              </div>
              <button onClick={onClose} className="text-ts hover:text-tp text-xl leading-none">✕</button>
            </div>

            <div className="p-4" style={{ background: '#0F1923' }}>
              <ReplayFeed playing={playing} />
              <div className="flex gap-4 mt-3 px-2">
                <div className="text-center">
                  <div className="text-ts text-xs">TTC</div>
                  <div className="font-bold" style={{ color: '#C0392B' }}>{incident.ttc}s</div>
                </div>
                <div className="text-center">
                  <div className="text-ts text-xs">Duration</div>
                  <div className="text-tp font-bold">{incident.duration}</div>
                </div>
                <div className="text-center">
                  <div className="text-ts text-xs">Severity</div>
                  <div className="font-bold" style={{ color: incident.severity === 'High' ? '#C0392B' : incident.severity === 'Medium' ? '#F39C12' : '#27AE60' }}>
                    {incident.severity}
                  </div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-ts text-xs">Alert Sent</div>
                  <div className="text-xs font-semibold" style={{ color: '#27AE60' }}>{incident.ts}</div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: '#1F5C99', color: 'white' }}
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#0F1923' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#2E86C1' }} />
                </div>
                <span className="text-ts text-xs w-8 text-right">{progress}%</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1F5C99', color: 'white' }}>
                  ⬇ Export
                </button>
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-ts" style={{ background: '#0F1923' }}>
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
