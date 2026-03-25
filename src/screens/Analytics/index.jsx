import SceRateTrend  from './SceRateTrend'
import RoadUserDonut from './RoadUserDonut'
import ComparisonBar from './ComparisonBar'
import HourlyHeatmap from './HourlyHeatmap'
import { COMPARISON_DATA } from '../../data/simulation'

export default function Analytics({ sim }) {
  return (
    <div className="p-6 flex flex-col gap-4" style={{ minHeight: '100%' }}>
      <div>
        <h1 className="text-tp text-xl font-semibold">Analytics & Trends</h1>
        <p className="text-ts text-sm">
          {sim.country === 'IL' ? 'Tel Aviv deployment' : 'Chennai deployment'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4" style={{ height: 320 }}>
        <SceRateTrend data={sim.sceWeeklyData} intersections={sim.intersections} />
        <RoadUserDonut data={sim.roadUserBreakdown} />
        <ComparisonBar data={COMPARISON_DATA} />
        <HourlyHeatmap data={sim.heatmapData} />
      </div>

      <div
        className="rounded-xl p-6"
        style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-tp text-sm font-semibold mb-4">Alert Effectiveness</div>
        <div className="flex items-center gap-8">
          <div className="text-center flex-shrink-0">
            <div className="font-bold" style={{ fontSize: 48, color: '#27AE60' }}>31%</div>
            <div className="text-sm flex items-center gap-1 justify-center" style={{ color: '#27AE60' }}>
              <span>▼</span><span>reduction in SCE rate</span>
            </div>
            <div className="text-ts text-xs mt-1">vs. unmonitored baseline</div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ts">Alert Sent Rate Before: 92%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: '#0F1923' }}>
                  <div className="h-full rounded-full" style={{ width: '92%', background: '#C0392B' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ts">Alert Sent Rate After (PREVENT): 64%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: '#0F1923' }}>
                  <div className="h-full rounded-full" style={{ width: '64%', background: '#27AE60' }} />
                </div>
              </div>
            </div>
            <div className="text-ts text-xs mt-3">
              Based on 6-month deployment across 3 monitored intersections.
              RUU alert response time avg: 1.8s (Israel) · 2.4s (India).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
