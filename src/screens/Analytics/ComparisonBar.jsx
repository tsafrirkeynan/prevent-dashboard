import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#162433', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#E8F0F7' },
  labelStyle:   { color: '#8FAFC7', fontSize: 11 },
}

export default function ComparisonBar({ data }) {
  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{ background: '#162433', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-3">
        <div className="text-tp text-sm font-semibold">Israel vs India Comparison</div>
        <div className="text-ts text-xs">Key performance metrics</div>
      </div>
      <div className="flex-1" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="metric"
              tick={{ fill: '#8FAFC7', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#8FAFC7', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8FAFC7' }} />
            <Bar dataKey="IL" name="Israel" fill="#2E86C1" radius={[3,3,0,0]} barSize={18} />
            <Bar dataKey="IN" name="India"  fill="#F39C12" radius={[3,3,0,0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
