import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'overview',  icon: '🗺', label: 'Overview' },
  { id: 'incidents', icon: '⚡', label: 'Incidents' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'health',    icon: '🔧', label: 'System Health' },
]

export default function Sidebar({ screen, setScreen, country, setCountry }) {
  return (
    <aside
      className="flex flex-col h-full flex-shrink-0"
      style={{ width: 220, background: '#111D2B', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1F5C99, #2E86C1)' }}
          >P</div>
          <span className="text-tp font-bold text-base tracking-wide">PREVENT</span>
        </div>
        <div className="text-ts text-xs pl-9">Municipality Dashboard</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-all duration-150"
            style={{
              background: screen === item.id ? '#1F5C99' : 'transparent',
              color: screen === item.id ? '#E8F0F7' : '#8FAFC7',
            }}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* City Toggle */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="text-ts text-xs mb-2 font-medium uppercase tracking-wider">Region</div>
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ background: '#0F1923' }}
        >
          <button
            onClick={() => setCountry('IL')}
            className="flex-1 py-2 text-xs font-semibold transition-all"
            style={{
              background: country === 'IL' ? '#1F5C99' : 'transparent',
              color: country === 'IL' ? '#E8F0F7' : '#8FAFC7',
            }}
          >
            🇮🇱 Israel
          </button>
          <button
            onClick={() => setCountry('IN')}
            className="flex-1 py-2 text-xs font-semibold transition-all"
            style={{
              background: country === 'IN' ? '#1F5C99' : 'transparent',
              color: country === 'IN' ? '#E8F0F7' : '#8FAFC7',
            }}
          >
            🇮🇳 India
          </button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: '#27AE60' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-ts text-xs">Live · Connected</span>
      </div>
    </aside>
  )
}
