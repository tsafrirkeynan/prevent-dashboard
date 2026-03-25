import { motion, AnimatePresence } from 'framer-motion'

// Must match the setTimeout duration in useSimulation (simulation.js)
export const ALERT_DISPLAY_MS = 8000

const SEV_COLOR = { High: '#C0392B', Medium: '#F39C12', Low: '#27AE60' }

export default function AlertToast({ alert }) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          key={alert.id}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-[9999] w-80 rounded-xl overflow-hidden shadow-2xl"
          style={{ background: '#162433', border: `1px solid ${SEV_COLOR[alert.severity]}` }}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="text-2xl mt-0.5">⚠️</div>
            <div className="flex-1 min-w-0">
              <div className="text-tp font-semibold text-sm">
                {alert.type} Detected
              </div>
              <div className="text-ts text-xs mt-0.5 truncate">{alert.intersection}</div>
              <div className="text-ts text-xs">{alert.city} · {alert.ts}</div>
            </div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: SEV_COLOR[alert.severity] + '33', color: SEV_COLOR[alert.severity] }}
            >
              {alert.severity}
            </span>
          </div>
          <motion.div
            className="h-1"
            style={{ background: SEV_COLOR[alert.severity] }}
            initial={{ scaleX: 1, originX: 0 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: ALERT_DISPLAY_MS / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
