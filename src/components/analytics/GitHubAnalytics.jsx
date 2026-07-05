import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaCode, FaStar, FaCodeBranch, FaUsers, FaCalendarAlt } from 'react-icons/fa'
import useRealtimeFetch from '../../hooks/useRealtimeFetch'
import RefreshBar from './RefreshBar'
import { fetchGitHubContributions } from '../../utils/githubContributions'

const LEVELS = [
  { level: 0, color: '#1a1a2e' },
  { level: 1, color: '#0e4429' },
  { level: 2, color: '#006d32' },
  { level: 3, color: '#26a641' },
  { level: 4, color: '#39d353' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="h-48 bg-white/5 rounded-2xl" />
    </div>
  )
}

export default function GitHubAnalytics({ username }) {
  const [contributions, setContributions] = useState([])
  const [totalContribs, setTotalContribs] = useState(0)
  const [stars, setStars] = useState(0)
  const [weeks, setWeeks] = useState([])
  const [monthLabels, setMonthLabels] = useState([])
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, count: 0, date: '' })
  const [contribLoading, setContribLoading] = useState(true)
  const gridRef = useRef(null)
  const contribFetchedRef = useRef(false)

  const fetchUser = useCallback(async () => {
    const res = await fetch(`/api/github/users/${username}`)
    console.log(`[GitHubAnalytics] User API: ${res.status}`)
    return res.json()
  }, [username])

  const { data: userData, loading, lastUpdated, refresh } = useRealtimeFetch(fetchUser, 120000, true, [username])

  useEffect(() => {
    if (!username) return
    fetch(`/api/github/users/${username}/repos?per_page=100&sort=updated`).then(res => res.json()).then(repos => {
      if (Array.isArray(repos)) {
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
        console.log(`[GitHubAnalytics] Total stars: ${totalStars}`)
        setStars(totalStars)
      }
    }).catch(e => console.error('[GitHubAnalytics] Repos fetch failed:', e))
  }, [username])

  const loadContributions = useCallback(() => {
    if (!username) return
    setContribLoading(true)
    fetchGitHubContributions(username).then(({ days, total }) => {
      console.log(`[GitHubAnalytics] Contributions: ${total} total, ${days.filter(d => d.count > 0).length} active days`)
      setContributions(days)
      setTotalContribs(total)
    }).catch(e => {
      console.error('[GitHubAnalytics] Failed to fetch contributions:', e)
    }).finally(() => {
      setContribLoading(false)
    })
  }, [username])

  useEffect(() => {
    if (!username || contribFetchedRef.current) return
    contribFetchedRef.current = true
    loadContributions()
  }, [username, loadContributions])

  const handleRefresh = useCallback(() => {
    contribFetchedRef.current = false
    loadContributions()
    fetch(`/api/github/users/${username}/repos?per_page=100&sort=updated`).then(res => res.json()).then(repos => {
      if (Array.isArray(repos)) {
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
        setStars(totalStars)
      }
    }).catch(() => {})
    refresh()
  }, [username, loadContributions, refresh])

  useEffect(() => {
    if (contributions.length === 0) return
    const days = contributions.map(c => ({
      date: c.date,
      count: c.count,
      level: c.level,
      key: c.key,
    }))
    const grouped = []
    const labels = []
    let lastMonth = -1
    for (let w = 0; w < days.length / 7; w++) {
      const week = days.slice(w * 7, (w + 1) * 7)
      if (week.length === 0) break
      grouped.push(week)
      const firstDay = week[0]
      if (firstDay && firstDay.date.getMonth() !== lastMonth) {
        lastMonth = firstDay.date.getMonth()
        labels.push({ index: w, label: MONTHS[lastMonth] })
      }
    }
    setWeeks(grouped)
    setMonthLabels(labels)
  }, [contributions])

  const handleMouseEnter = (e, day) => {
    const rect = e.target.getBoundingClientRect()
    const gridRect = gridRef.current?.getBoundingClientRect()
    const dateStr = day.date instanceof Date && !isNaN(day.date)
      ? day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      : day.key || 'Unknown date'
    setTooltip({
      show: true,
      x: rect.left - (gridRect?.left || 0) + rect.width / 2,
      y: rect.top - (gridRect?.top || 0) - 8,
      count: day.count,
      date: dateStr,
    })
  }

  const handleMouseLeave = () => setTooltip({ ...tooltip, show: false })

  if (loading && !userData) return <Skeleton />
  if (!loading && !userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 md:p-8 gradient-border text-center"
        style={{ borderRadius: '20px' }}
      >
        <FaGithub className="text-5xl text-white/20 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Unable to fetch GitHub profile data</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all text-sm font-medium"
        >
          Retry
        </button>
      </motion.div>
    )
  }

  const joinedDate = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A'

  const stats = userData ? [
    { icon: FaCode, label: 'Repositories', value: userData.public_repos ?? 0, color: '#00F5FF' },
    { icon: FaStar, label: 'Stars Earned', value: stars, color: '#FFD700' },
    { icon: FaUsers, label: 'Followers', value: userData.followers ?? 0, color: '#7B61FF' },
    { icon: FaCodeBranch, label: 'Following', value: userData.following ?? 0, color: '#FF6B9D' },
    { icon: FaCalendarAlt, label: 'Joined', value: joinedDate, color: '#39d353' },
    { icon: FaGithub, label: 'Public Gists', value: userData.public_gists ?? 0, color: '#FFA116' },
  ] : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 md:p-8 gradient-border"
      style={{ borderRadius: '20px' }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <FaGithub className="text-3xl text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-white">GitHub Analytics</h3>
              <RefreshBar lastUpdated={lastUpdated} onRefresh={handleRefresh} loading={loading} />
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              @{username}
            </a>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-300"
        >
          View Profile <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-4 bg-white/[0.02]"
              style={{ borderRadius: '16px' }}
            >
              <Icon className="text-lg mb-2" style={{ color: stat.color }} />
              <p className="text-xl font-bold text-white">{stat.value ?? 0}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="border-t border-white/5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white">
            {totalContribs.toLocaleString()} contributions in the last year
          </h4>
        </div>

        {weeks.length > 0 ? (
          <>
            <div className="overflow-x-auto scrollbar-thin" ref={gridRef}>
              <div className="relative" style={{ minWidth: '728px' }}>
                <div className="flex ml-8 mb-1 text-[10px] text-gray-500 h-4 relative">
                  {monthLabels.map((m, i) => (
                    <span key={i} className="absolute" style={{ left: `${(m.index / weeks.length) * 100}%` }}>
                      {m.label}
                    </span>
                  ))}
                </div>
                <div className="flex gap-px">
                  <div className="flex flex-col gap-px mr-1 text-[8px] text-gray-500">
                    {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d, i) => (
                      <span key={i} className="h-[11px] flex items-center leading-none">{d}</span>
                    ))}
                  </div>
                  {weeks.map((week, wi) => (
                    <motion.div
                      key={wi}
                      initial={{ opacity: 0, scaleY: 0 }}
                      whileInView={{ opacity: 1, scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: wi * 0.005, duration: 0.2 }}
                      className="flex flex-col gap-px origin-bottom"
                    >
                      {week.map((day) => (
                        <div
                          key={day.key}
                          onMouseEnter={(e) => handleMouseEnter(e, day)}
                          onMouseLeave={handleMouseLeave}
                          className="w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-white/40 hover:scale-150"
                          style={{ backgroundColor: LEVELS[day.level]?.color || '#1a1a2e' }}
                        />
                      ))}
                    </motion.div>
                  ))}
                </div>
                {tooltip.show && (
                  <div
                    className="absolute z-50 px-3 py-2 rounded-xl bg-black/90 border border-white/10 text-xs pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-sm"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
                  >
                    <p className="text-white font-semibold">{tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{tooltip.date}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-4">
              <span className="text-[10px] text-gray-500">Less</span>
              {LEVELS.map((l) => (
                <div key={l.level} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: l.color }} />
              ))}
              <span className="text-[10px] text-gray-500">More</span>
            </div>
          </>
        ) : contribLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">Loading contribution data...</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No contribution data available</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
