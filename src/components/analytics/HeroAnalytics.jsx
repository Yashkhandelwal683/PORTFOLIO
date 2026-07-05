import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'

export default function HeroAnalytics() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Analytics
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Developer{' '}
          <span className="gradient-text">Analytics</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Visualizing my coding journey, consistency, open source contributions
          and competitive programming performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {[
            { href: 'https://github.com/Yashkhandelwal683', icon: FaGithub, label: 'View GitHub', color: 'white' },
            { href: 'https://leetcode.com/u/yash_khandelwal123/', icon: SiLeetcode, label: 'View LeetCode', color: '#FFA116' },
            { href: 'https://codolio.com/profile/Yash_gla2535', icon: null, label: 'View Codolio', color: '#6C63FF' },
          ].map((btn) => {
            const Icon = btn.icon
            return (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: `${btn.color}10`,
                  border: `1px solid ${btn.color}30`,
                  color: btn.color,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = `${btn.color}20`}
                onMouseLeave={(e) => e.currentTarget.style.background = `${btn.color}10`}
              >
                {Icon && <Icon className="text-lg" />}
                {btn.label}
                <FaExternalLinkAlt className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            )
          })}
        </motion.div>


      </div>
    </div>
  )
}
