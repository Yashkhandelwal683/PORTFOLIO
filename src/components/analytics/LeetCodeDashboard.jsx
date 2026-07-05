import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SiLeetcode } from 'react-icons/si'
import { FaExternalLinkAlt, FaFire } from 'react-icons/fa'
import useRealtimeFetch from '../../hooks/useRealtimeFetch'
import LeetCodeHeatmap from '../LeetCodeHeatmap'
import RefreshBar from './RefreshBar'

const ALL_QUESTIONS = { All: 3977, Easy: 951, Medium: 2077, Hard: 949 }

const LEETCODE_BASE = 'https://alfa-leetcode-api.onrender.com'

const DIFFICULTY_COLORS = { Easy: '#00B8A3', Medium: '#FFA116', Hard: '#FF375F' }

function computeStreaks(calData) {
  const activeDates = new Set()
  try {
    const cal = JSON.parse(calData.submissionCalendar)
    Object.entries(cal).forEach(([ts, count]) => {
      if (Number(count) > 0) {
        const d = new Date(parseInt(ts) * 1000)
        activeDates.add(d.toISOString().split('T')[0])
      }
    })
  } catch { /* ignore */ }

  let currentStreak = 0
  const cursor = new Date()
  while (true) {
    const k = cursor.toISOString().split('T')[0]
    if (activeDates.has(k)) {
      currentStreak++
      cursor.setUTCDate(cursor.getUTCDate() - 1)
    } else break
  }

  let longestStreak = 0
  let temp = 0
  const sorted = [...activeDates].sort()
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { temp = 1 }
    else {
      const prev = new Date(sorted[i - 1] + 'T00:00:00Z')
      const curr = new Date(sorted[i] + 'T00:00:00Z')
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24))
      temp = diff === 1 ? temp + 1 : 1
    }
    longestStreak = Math.max(longestStreak, temp)
  }

  return { currentStreak, longestStreak }
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-white/5 rounded w-32" />
          <div className="h-3 bg-white/5 rounded w-24" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => <div key={i} className="aspect-square bg-white/5 rounded-2xl" />)}
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-white/5 rounded-xl" />)}
      </div>
      <div className="h-48 bg-white/5 rounded-2xl" />
    </div>
  )
}

export default function LeetCodeDashboard({ username }) {
  const [animatedCounts, setAnimatedCounts] = useState({})
  const countedRef = useRef(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const fetchLeetCode = useCallback(async () => {
    const [profileRes, solvedRes, calRes] = await Promise.all([
      fetch(`${LEETCODE_BASE}/${username}`),
      fetch(`${LEETCODE_BASE}/${username}/solved`),
      fetch(`${LEETCODE_BASE}/${username}/calendar?year=${selectedYear}`),
    ])
    if (!profileRes.ok) throw new Error(`Profile API returned ${profileRes.status}`)
    if (!solvedRes.ok) throw new Error(`Solved API returned ${solvedRes.status}`)
    if (!calRes.ok) throw new Error(`Calendar API returned ${calRes.status}`)
    const profile = await profileRes.json()
    const solved = await solvedRes.json()
    const cal = await calRes.json()
    return { profile, solved, cal }
  }, [username, selectedYear])

  const { data, loading, error, lastUpdated, refresh } = useRealtimeFetch(fetchLeetCode, 120000, true, [selectedYear])

  const stats = useMemo(() => {
    if (!data?.solved || !data?.cal) return null
    const ac = data.solved.acSubmissionNum
    const tot = data.solved.totalSubmissionNum
    const get = (arr, diff, field) => arr.find(s => s.difficulty === diff)?.[field] || 0
    const totalSolved = get(ac, 'All', 'count')
    const easySolved = get(ac, 'Easy', 'count')
    const mediumSolved = get(ac, 'Medium', 'count')
    const hardSolved = get(ac, 'Hard', 'count')
    const totalSubmissions = get(tot, 'All', 'submissions')
    const acceptedSubmissions = get(ac, 'All', 'submissions')
    const acceptanceRate = totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0
    const { currentStreak, longestStreak } = computeStreaks(data.cal)
    const ranking = data.profile?.ranking?.toLocaleString() || 'N/A'
    return { totalSolved, easySolved, mediumSolved, hardSolved, totalSubmissions, acceptanceRate, currentStreak, longestStreak, ranking }
  }, [data])

  useEffect(() => {
    countedRef.current = false
  }, [selectedYear])

  useEffect(() => {
    if (!stats || countedRef.current) return
    countedRef.current = true
    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedCounts({
        total: Math.floor(eased * stats.totalSolved),
        Easy: Math.floor(eased * stats.easySolved),
        Medium: Math.floor(eased * stats.mediumSolved),
        Hard: Math.floor(eased * stats.hardSolved),
      })
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [stats])

  if (loading && !data) return <Skeleton />

  if (error && !data) {
    return (
      <div className="glass-card p-8 gradient-border text-center" style={{ borderRadius: '20px' }}>
        <SiLeetcode className="text-5xl text-[#FFA116]/30 mx-auto mb-4" />
        <p className="text-gray-400 mb-3">Unable to load LeetCode data</p>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFA116]/10 text-[#FFA116] border border-[#FFA116]/30 hover:bg-[#FFA116]/20 transition-all text-sm font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data?.profile || !stats) {
    return (
      <div className="glass-card p-8 gradient-border text-center" style={{ borderRadius: '20px' }}>
        <SiLeetcode className="text-5xl text-[#FFA116]/30 mx-auto mb-4" />
        <p className="text-gray-500">Waiting for LeetCode data...</p>
      </div>
    )
  }

  const ringItems = [
    { label: 'Solved', value: animatedCounts.total || 0, total: ALL_QUESTIONS.All, pct: Math.round((stats.totalSolved / ALL_QUESTIONS.All) * 100), color: '#7B61FF' },
    { label: 'Easy', value: animatedCounts.Easy || 0, total: stats.totalSolved, pct: stats.totalSolved > 0 ? Math.round((stats.easySolved / stats.totalSolved) * 100) : 0, color: '#00B8A3' },
    { label: 'Medium', value: animatedCounts.Medium || 0, total: stats.totalSolved, pct: stats.totalSolved > 0 ? Math.round((stats.mediumSolved / stats.totalSolved) * 100) : 0, color: '#FFA116' },
    { label: 'Hard', value: animatedCounts.Hard || 0, total: stats.totalSolved, pct: stats.totalSolved > 0 ? Math.round((stats.hardSolved / stats.totalSolved) * 100) : 0, color: '#FF375F' },
    { label: 'Streak', value: stats.currentStreak, total: null, pct: 0, color: '#FF6B35', icon: FaFire },
  ]

  const progressBars = ['Easy', 'Medium', 'Hard'].map((d) => {
    const key = d.toLowerCase()
    const solved = stats[key + 'Solved']
    const total = ALL_QUESTIONS[d]
    const pct = total > 0 ? Math.round((solved / total) * 100) : 0
    return { difficulty: d, solved, total, pct }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-1 h-6 bg-gradient-to-b from-[#FFA116] to-[#FFA116]/50 rounded-full" />
          <h3 className="text-2xl font-bold text-white">LeetCode Dashboard</h3>
          <RefreshBar lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 md:p-8 gradient-border" style={{ borderRadius: '20px' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFA116]/20 to-[#FFA116]/5 flex items-center justify-center">
                <SiLeetcode className="text-3xl text-[#FFA116]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">@{username}</h4>
                <p className="text-sm text-gray-400">Global Rank: #{stats.ranking}</p>
              </div>
            </div>
            <a
              href={`https://leetcode.com/u/${username}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFA116]/10 border border-[#FFA116]/20 text-[#FFA116] text-xs hover:bg-[#FFA116]/20 transition-all"
            >
              Profile <FaExternalLinkAlt className="text-[10px]" />
            </a>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {ringItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="text-center">
                  <div className="relative w-full aspect-square mb-1">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                      {item.total && (
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${item.pct} ${100 - item.pct}`} className="transition-all duration-1000" />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {Icon ? <Icon className="text-lg" style={{ color: item.color }} /> : <span className="text-lg font-bold text-white">{item.pct}%</span>}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">{item.label}</p>
                  <p className="text-xs font-semibold text-white">{item.value.toLocaleString()}</p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="glass-card p-3 text-center bg-white/[0.02]" style={{ borderRadius: '12px' }}>
              <p className="text-lg font-bold text-white">{stats.acceptanceRate}%</p>
              <p className="text-[10px] text-gray-400">Acceptance Rate</p>
            </div>
            <div className="glass-card p-3 text-center bg-white/[0.02]" style={{ borderRadius: '12px' }}>
              <p className="text-lg font-bold text-white">{stats.totalSubmissions.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">Total Submissions</p>
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            {progressBars.map((pb) => (
              <div key={pb.difficulty}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{pb.difficulty}</span>
                  <span className="text-white font-medium">{pb.solved}/{pb.total}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pb.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${DIFFICULTY_COLORS[pb.difficulty]}, ${pb.difficulty === 'Easy' ? '#00F5FF' : pb.difficulty === 'Medium' ? '#FFA116' : '#FF6B6B'})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <LeetCodeHeatmap
          username={username}
          year={selectedYear}
          onYearChange={setSelectedYear}
          stats={{
            totalSolved: stats.totalSolved,
            totalSubmissions: stats.totalSubmissions,
            acceptanceRate: stats.acceptanceRate,
            currentStreak: stats.currentStreak,
            longestStreak: stats.longestStreak,
          }}
          calData={data.cal}
        />
      </div>
    </motion.div>
  )
}
