import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa'
import useRealtimeFetch from '../../hooks/useRealtimeFetch'
import RefreshBar from './RefreshBar'

function Skeleton() {
  return (
    <div className="animate-pulse grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
    </div>
  )
}

export default function OpenSource({ username }) {
  const fetchRepos = useCallback(async () => {
    const res = await fetch(`/api/github/users/${username}/repos?per_page=100&sort=updated&direction=desc`)
    const data = await res.json()
    if (Array.isArray(data)) {
      return data.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 9)
    }
    return []
  }, [username])

  const { data: repos, loading, lastUpdated, refresh } = useRealtimeFetch(fetchRepos, 300000, true, [username])

  if (loading && !repos) return <Skeleton />

  if (!repos || repos.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-1 h-6 bg-gradient-to-b from-white to-white/50 rounded-full" />
          <h3 className="text-2xl font-bold text-white">Open Source</h3>
          <RefreshBar lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-card p-5 group"
            style={{ borderRadius: '16px' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FaGithub className="text-lg text-gray-400 shrink-0" />
                <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">{repo.name}</h4>
              </div>
              <FaExternalLinkAlt className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            {repo.description && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{repo.description}</p>
            )}
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/60" />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1"><FaStar className="text-[10px]" />{repo.stargazers_count || 0}</span>
              <span className="flex items-center gap-1"><FaCodeBranch className="text-[10px]" />{repo.forks_count || 0}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
