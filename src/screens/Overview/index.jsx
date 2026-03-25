import { useState } from 'react'
import KpiBar            from './KpiBar'
import IntersectionMap   from './IntersectionMap'
import IntersectionDetail from './IntersectionDetail'
import ClipModal         from '../Incidents/ClipModal'

export default function Overview({ sim }) {
  const [clip, setClip] = useState(null)

  return (
    <div className="p-6 h-full flex flex-col" style={{ minHeight: 0 }}>
      <div className="mb-4">
        <h1 className="text-tp text-xl font-semibold">Intersection Overview</h1>
        <p className="text-ts text-sm">
          {sim.country === 'IL' ? 'Tel Aviv Metropolitan Area' : 'Chennai Metropolitan Area'}
        </p>
      </div>

      <KpiBar kpis={sim.kpis} />

      <div className="flex gap-4 flex-1" style={{ minHeight: 0 }}>
        <div style={{ flex: '0 0 60%', minHeight: 0 }}>
          <IntersectionMap
            intersections={sim.intersections}
            selectedId={sim.selectedIntersection?.id}
            onSelect={sim.setSelectedId}
            alertId={sim.activeAlert?.intersectionId}
          />
        </div>
        <div className="flex-1" style={{ minHeight: 0 }}>
          <IntersectionDetail
            intersection={sim.selectedIntersection}
            rsus={sim.rsus}
            onPlayClip={setClip}
          />
        </div>
      </div>

      <ClipModal incident={clip} onClose={() => setClip(null)} />
    </div>
  )
}
