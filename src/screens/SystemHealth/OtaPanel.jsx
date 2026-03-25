import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OtaPanel({ pendingCount }) {
  const [deploying, setDeploying] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [done,      setDone]      = useState(false)
  const ivRef = useRef(null)

  useEffect(() => () => clearInterval(ivRef.current), [])

  function handleDeploy() {
    if (deploying) return
    setDeploying(true); setDone(false); setProgress(0)
    ivRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(ivRef.current); setDeploying(false); setDone(true); return 100 }
        return p + 2
      })
    }, 60)
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-tp text-sm font-semibold">OTA Firmware Update</div>
          <div className="text-ts text-xs mt-0.5">Current: v2.4.1 · Available: v2.5.0</div>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-semibold"
          style={{ background: '#F39C1222', color: '#F39C12' }}
        >
          {pendingCount} units pending
        </span>
      </div>

      <div className="text-ts text-xs mb-4 leading-relaxed" style={{ background: '#0F1923', borderRadius: 8, padding: '10px 12px' }}>
        <div className="text-tp font-medium mb-1 text-xs">v2.5.0 Changelog</div>
        <div>• Improved TTC calculation accuracy in mixed-traffic scenarios (+12%)</div>
        <div>• Reduced false alarm rate via updated ML model (v3.1)</div>
        <div>• RSU signal resilience improvements for urban canyons</div>
      </div>

      <AnimatePresence>
        {deploying && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ts">Deploying to {pendingCount} units...</span>
              <span className="text-tp">{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#0F1923' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#2E86C1' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
        {done && (
          <motion.div
            className="mb-4 text-safe text-xs flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span>✓</span><span>Deployment complete — all {pendingCount} units updated to v2.5.0</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: deploying ? '#1a2d3f' : '#1F5C99',
            color: deploying ? '#8FAFC7' : 'white',
          }}
        >
          {deploying ? `Deploying... ${progress}%` : '🚀 Deploy to All Units'}
        </button>
        <button
          disabled={deploying}
          title="Select individual units to update"
          className="px-4 py-2 rounded-lg text-sm text-ts"
          style={{ background: '#0F1923', border: '1px solid rgba(255,255,255,0.08)', opacity: deploying ? 0.5 : 1 }}
        >
          Deploy to Selected
        </button>
      </div>
    </div>
  )
}
