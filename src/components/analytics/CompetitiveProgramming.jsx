import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaGlobe } from 'react-icons/fa'

const platforms = [
  {
    name: 'Codolio',
    icon: FaGlobe,
    color: '#6C63FF',
    username: 'Yash_gla2535',
    rating: 'Active',
    maxRating: 500,
    solved: 500,
    url: 'https://codolio.com/profile/Yash_gla2535',
  },
]

export default function CompetitiveProgramming() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-yellow-500/50 rounded-full" />
        <h3 className="text-2xl font-bold text-white">Competitive Programming</h3>
      </div>

      <div className="max-w-md mx-auto">
        {platforms.map((platform, i) => {
          const Icon = platform.icon
          return (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card p-6 group relative overflow-hidden gradient-border block"
              style={{ borderRadius: '20px' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${platform.color}15, transparent)`,
                }}
              />
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${platform.color}15` }}
                >
                  {Icon ? (
                    <Icon className="text-2xl" style={{ color: platform.color }} />
                  ) : (
                    <FaGlobe className="text-2xl" style={{ color: platform.color }} />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {platform.name}
                  </h4>
                  <p className="text-xs text-gray-400">@{platform.username}</p>
                </div>
                <FaExternalLinkAlt className="text-gray-500 group-hover:text-white transition-colors text-xs ml-auto" />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium">{platform.maxRating}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Rank</span>
                  <span className="text-white font-medium">{platform.rating}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Problems Solved</span>
                  <span className="text-white font-medium">{platform.solved}+</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <span
                  className="text-xs font-medium flex items-center gap-1.5"
                  style={{ color: platform.color }}
                >
                  View Profile →
                </span>
              </div>
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}
