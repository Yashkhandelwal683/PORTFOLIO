import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#00F5FF', '#7B61FF', '#FFA116', '#FF6B9D', '#39d353',
  '#FFD700', '#FF6B6B', '#60A5FA', '#A78BFA', '#34D399',
]

function Skeleton() {
  return (
    <div className="animate-pulse grid md:grid-cols-2 gap-6">
      <div className="h-80 bg-white/5 rounded-2xl" />
      <div className="h-80 bg-white/5 rounded-2xl" />
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-4 py-3 border border-white/10 shadow-2xl" style={{ borderRadius: '12px' }}>
        <p className="text-white text-sm font-semibold">{payload[0].name}</p>
        <p className="text-primary text-xs mt-1">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

function DonutChartCard({ title, data }) {
  if (!data || data.length === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6"
      style={{ borderRadius: '20px' }}
    >
      <h4 className="text-sm font-semibold text-gray-300 mb-6">{title}</h4>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value" animationDuration={1500} animationBegin={300}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-xs">
          {data.map((lang, i) => (
            <div key={lang.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-gray-400 truncate">{lang.name}</span>
              <span className="text-white font-medium ml-auto">{lang.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function LanguageCharts({ username }) {
  const [byteData, setByteData] = useState([])
  const [repoData, setRepoData] = useState([])
  const [loading, setLoading] = useState(true)
  const processedRef = useRef(false)

  useEffect(() => {
    if (!username || processedRef.current) return
    processedRef.current = true

    const loadLanguages = async () => {
      try {
        const reposRes = await fetch(`/api/github/users/${username}/repos?per_page=100`)
        console.log(`[Languages] Repos API: ${reposRes.status}`)
        if (!reposRes.ok) { setLoading(false); return }
        const repos = await reposRes.json()
        if (!Array.isArray(repos)) { setLoading(false); return }

        console.log(`[Languages] Fetching language bytes for ${repos.length} repos`)

        const langBytes = {}
        const langRepos = {}

        const results = await Promise.allSettled(
          repos.map(repo =>
            fetch(`/api/github/repos/${repo.full_name}/languages`)
              .then(r => r.ok ? r.json() : {})
          )
        )

        results.forEach((result, i) => {
          const repo = repos[i]
          if (repo.language) {
            langRepos[repo.language] = (langRepos[repo.language] || 0) + 1
          }
          if (result.status === 'fulfilled') {
            const langs = result.value
            for (const [lang, bytes] of Object.entries(langs)) {
              langBytes[lang] = (langBytes[lang] || 0) + bytes
            }
          } else if (repo.language) {
            langBytes[repo.language] = (langBytes[repo.language] || 0) + 1
          }
        })

        const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0)
        const totalRepos = repos.length

        const toPercent = (obj, total) =>
          Object.entries(obj)
            .map(([name, value]) => ({ name, value: Math.round((value / total) * 100) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

        if (totalBytes > 0) {
          setByteData(toPercent(langBytes, totalBytes))
        }
        if (totalRepos > 0) {
          setRepoData(toPercent(langRepos, totalRepos))
        }
      } catch (e) {
        console.error('[Languages] Error:', e)
      } finally {
        setLoading(false)
      }
    }

    loadLanguages()
  }, [username])

  if (loading) return <Skeleton />

  if (byteData.length === 0 && repoData.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-1 h-6 bg-gradient-to-b from-secondary to-secondary/50 rounded-full" />
          <h3 className="text-2xl font-bold text-white">Programming Languages</h3>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <DonutChartCard title="Languages by Bytes" data={byteData} />
        <DonutChartCard title="Languages by Repository" data={repoData} />
      </div>
    </motion.div>
  )
}
