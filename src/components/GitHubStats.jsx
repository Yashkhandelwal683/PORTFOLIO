import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import {
  VscRepo, VscStarEmpty, VscOrganization, VscRepoForked,
} from 'react-icons/vsc'
import GitHubCalendar from 'react-github-calendar'

const GITHUB_THEME = {
  dark: ['#1a1a2e', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl" />
        ))}
      </div>
      <div className="h-32 bg-white/5 rounded-2xl" />
    </div>
  )
}

export default function GitHubStats({ username }) {
  const [userData, setUserData] = useState(null)
  const [stars, setStars] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!username) return
    const fetchData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ])
        console.log(`[GitHubStats] User: ${userRes.status}, Repos: ${reposRes.status}`)
        const userJson = await userRes.json()
        const reposJson = reposRes.ok ? await reposRes.json() : []
        setUserData(userJson)
        if (Array.isArray(reposJson)) {
          setStars(reposJson.reduce((sum, r) => sum + (r.stargazers_count || 0), 0))
        }
      } catch (e) {
        console.error('[GitHubStats] Error:', e)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [username])

  if (loading) return <Skeleton />

  if (error || !userData) {
    return (
      <div className="glass-card p-8 gradient-border text-center" style={{ borderRadius: '20px' }}>
        <FaGithub className="text-5xl text-white mx-auto mb-4 opacity-50" />
        <p className="text-gray-400 mb-4">Unable to load GitHub stats</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-sm font-medium"
        >
          View Profile <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>
    )
  }

  const stats = [
    { icon: VscRepo, label: 'Repositories', value: userData.public_repos, color: '#00F5FF' },
    { icon: VscStarEmpty, label: 'Stars Earned', value: stars, color: '#FFD700' },
    { icon: VscOrganization, label: 'Followers', value: userData.followers, color: '#7B61FF' },
    { icon: VscRepoForked, label: 'Following', value: userData.following, color: '#FF6B9D' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-8 gradient-border"
      style={{ borderRadius: '20px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <FaGithub className="text-3xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">GitHub</h3>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <FaExternalLinkAlt className="text-xs text-gray-400" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card p-3 flex items-center gap-3 bg-white/[0.02]">
              <Icon className="text-xl shrink-0" style={{ color: stat.color }} />
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-400">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <GitHubCalendar
          username={username}
          year="last"
          theme={GITHUB_THEME}
          blockSize={12}
          blockMargin={4}
          fontSize={13}
          hideColorLegend={false}
          hideMonthLabels={false}
          hideTotalCount={false}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
        />
      </div>
    </motion.div>
  )
}
