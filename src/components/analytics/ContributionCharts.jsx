import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { fetchGitHubContributions } from '../../utils/githubContributions'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ChartSkeleton() {
  return (
    <div className="animate-pulse grid md:grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-2xl" />
      <div className="h-64 bg-white/5 rounded-2xl" />
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-4 py-3 border border-white/10 shadow-2xl" style={{ borderRadius: '12px' }}>
        <p className="text-white text-sm font-semibold">{label}</p>
        <p className="text-primary text-xs mt-1">{payload[0].value} contributions</p>
      </div>
    )
  }
  return null
}

export default function ContributionCharts({ username }) {
  const [monthlyData, setMonthlyData] = useState([])
  const [weeklyData, setWeeklyData] = useState([])
  const [loading, setLoading] = useState(true)
  const processedRef = useRef(false)

  useEffect(() => {
    if (!username || processedRef.current) return
    processedRef.current = true
    fetchGitHubContributions(username).then(({ days }) => {
      setLoading(false)
      const active = days.filter(d => d.count > 0)
      console.log(`[ContributionCharts] ${active.length} active days out of ${days.length}`)

      const months = {}
      active.forEach(c => {
        const d = c.date
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!months[key]) months[key] = { month: key, contributions: 0 }
        months[key].contributions += c.count
      })
      setMonthlyData(Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-12))

      const weekCounts = [0, 0, 0, 0, 0, 0, 0]
      active.forEach(c => {
        weekCounts[c.date.getDay()] += c.count
      })
      setWeeklyData(
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name, i) => ({
          day: name,
          contributions: weekCounts[i],
        }))
      )
    }).catch(e => {
      console.error('[ContributionCharts] Error:', e)
      setLoading(false)
    })
  }, [username])

  if (loading) return <ChartSkeleton />

  if (monthlyData.length === 0 && weeklyData.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
          <h3 className="text-2xl font-bold text-white">Contribution Charts</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
            style={{ borderRadius: '20px' }}
          >
            <h4 className="text-sm font-semibold text-gray-300 mb-6">Monthly Contributions</h4>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00F5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={(v) => { const [y, m] = v.split('-'); return `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}` }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="contributions" stroke="#00F5FF" strokeWidth={2} fill="url(#monthlyGrad)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        {weeklyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6"
            style={{ borderRadius: '20px' }}
          >
            <h4 className="text-sm font-semibold text-gray-300 mb-6">Weekly Activity</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="contributions" radius={[4, 4, 0, 0]} animationDuration={1500} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" />
                    <stop offset="100%" stopColor="#00F5FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
