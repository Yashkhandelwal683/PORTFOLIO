import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SiLeetcode } from 'react-icons/si'
import { FaExternalLinkAlt, FaFire, FaTrophy } from 'react-icons/fa'

const DIFFICULTY_COLORS = { Easy: '#00B8A3', Medium: '#FFA116', Hard: '#FF375F' }
const ALL_QUESTIONS = { All: 3977, Easy: 951, Medium: 2077, Hard: 949 }
const LEETCODE_BASE = 'https://alfa-leetcode-api.onrender.com'

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/5 rounded w-32" />
          <div className="h-3 bg-white/5 rounded w-24" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
      </div>
    </div>
  )
}

export default function LeetCodeStats({ username }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const countedRef = useRef(false)
  const [animatedCounts, setAnimatedCounts] = useState({})

  useEffect(() => {
    if (!username) return
    const fetchData = async () => {
      try {
        const [profileRes, solvedRes, calRes] = await Promise.all([
          fetch(`${LEETCODE_BASE}/${username}`),
          fetch(`${LEETCODE_BASE}/${username}/solved`),
          fetch(`${LEETCODE_BASE}/${username}/calendar?year=${new Date().getFullYear()}`),
        ])
        const profile = await profileRes.json()
        const solved = await solvedRes.json()
        const cal = await calRes.json()
        setData({ profile, solved, cal })
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const id = setInterval(fetchData, 120000)
    return () => clearInterval(id)
  }, [username])

  useEffect(() => {
    if (!data || !data.solved || countedRef.current) return
    countedRef.current = true
    const stats = data.solved.acSubmissionNum
    const totalTarget = stats.reduce((a, b) => a + b.count, 0)

    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = {}
      stats.forEach(s => { current[s.difficulty] = Math.floor(eased * s.count) })
      current.total = Math.floor(eased * totalTarget)
      setAnimatedCounts(current)
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [data])

  if (loading) return <Skeleton />

  if (error || !data?.profile) {
    return (
      <div className="glass-card p-8 gradient-border text-center" style={{ borderRadius: '20px' }}>
        <SiLeetcode className="text-5xl text-[#FFA116] mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Unable to load LeetCode stats</p>
        <a
          href={`https://leetcode.com/u/${username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFA116]/10 text-[#FFA116] border border-[#FFA116]/30 hover:bg-[#FFA116]/20 transition-all text-sm font-medium"
        >
          View Profile <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>
    )
  }

  const stats = data.solved.acSubmissionNum
  const totalQuestions = ALL_QUESTIONS.All
  const ranking = data.profile.ranking ? data.profile.ranking.toLocaleString() : 'N/A'
  const streak = data.cal?.streak || 0

  const getDifficultyStats = (difficulty) => {
    const s = stats.find(x => x.difficulty === difficulty)
    const total = ALL_QUESTIONS[difficulty] || 1
    return {
      solved: s?.count || 0,
      total,
      percentage: total > 0 ? Math.round(((s?.count || 0) / total) * 100) : 0,
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-8 gradient-border h-full"
      style={{ borderRadius: '20px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFA116]/20 to-[#FFA116]/5 flex items-center justify-center">
            <SiLeetcode className="text-3xl text-[#FFA116]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">LeetCode</h3>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <FaTrophy className="text-yellow-500 text-xs" />
          <span className="text-xs text-gray-300 font-medium">#{ranking}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Solved', value: animatedCounts.total || 0, total: totalQuestions, color: '#7B61FF' },
          { label: 'Easy', value: animatedCounts.Easy || 0, total: getDifficultyStats('Easy').total, color: '#00B8A3' },
          { label: 'Medium', value: animatedCounts.Medium || 0, total: getDifficultyStats('Medium').total, color: '#FFA116' },
          { label: 'Hard', value: animatedCounts.Hard || 0, total: getDifficultyStats('Hard').total, color: '#FF375F' },
          { label: 'Streak', value: streak, total: null, color: '#FF6B35', icon: FaFire },
        ].map((item) => {
          const Icon = item.icon
          const pct = item.total ? Math.round((item.value / item.total) * 100) : 0
          return (
            <div key={item.label} className="text-center">
              <div className="relative w-full aspect-square mb-1.5">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                  {item.total && (
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke={item.color} strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={`${pct} ${100 - pct}`}
                      className="transition-all duration-1000"
                    />
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {Icon ? (
                    <Icon className="text-lg" style={{ color: item.color }} />
                  ) : (
                    <span className="text-lg font-bold text-white">{pct}%</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-gray-400">{item.label}</p>
              <p className="text-xs font-semibold text-white">{item.value.toLocaleString()}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-2.5 mb-6">
        {['Easy', 'Medium', 'Hard'].map((d) => {
          const s = getDifficultyStats(d)
          return (
            <div key={d}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{d}</span>
                <span className="text-white font-medium">{s.solved}/{s.total}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${DIFFICULTY_COLORS[d]}, ${d === 'Easy' ? '#00F5FF' : d === 'Medium' ? '#FFA116' : '#FF6B6B'})` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <a
        href={`https://leetcode.com/u/${username}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFA116]/10 text-[#FFA116] border border-[#FFA116]/30 hover:bg-[#FFA116]/20 transition-all text-sm font-medium group"
      >
        View LeetCode Profile
        <FaExternalLinkAlt className="text-xs group-hover:translate-x-0.5 transition-transform" />
      </a>
    </motion.div>
  )
}
