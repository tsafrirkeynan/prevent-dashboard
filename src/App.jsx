import { useState } from 'react'
import Sidebar from './components/Sidebar'
import AlertToast from './components/AlertToast'
import { useSimulation } from './data/simulation'   // ← required: do NOT omit
import Overview from './screens/Overview'
import Incidents from './screens/Incidents'
import Analytics from './screens/Analytics'
import SystemHealth from './screens/SystemHealth'

export default function App() {
  const [screen, setScreen] = useState('overview')
  const sim = useSimulation()

  return (
    <div className="flex h-full bg-bg overflow-hidden">
      <Sidebar
        screen={screen}
        setScreen={setScreen}
        country={sim.country}
        setCountry={sim.setCountry}
      />
      <main className="flex-1 overflow-auto">
        {screen === 'overview'  && <Overview  sim={sim} />}
        {screen === 'incidents' && <Incidents sim={sim} />}
        {screen === 'analytics' && <Analytics sim={sim} />}
        {screen === 'health'    && <SystemHealth sim={sim} />}
      </main>
      <AlertToast alert={sim.activeAlert} />
    </div>
  )
}
