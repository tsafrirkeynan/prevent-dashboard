import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#162433', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E8F0F7' },
}

export default function RoadUserDonut({ data }) {
  if (!data) return null
  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-3">
        <div className="text-tp text-sm font-semibold">Road User Breakdown</div>
        <div className="text-ts text-xs">Detected at monitored intersections</div>
      </div>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} formatter={v => [`${v}%`]} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8FAFC7' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
