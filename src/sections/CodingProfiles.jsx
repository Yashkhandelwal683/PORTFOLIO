import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import SectionWrapper from '../components/SectionWrapper'

const profileData = [
  {
    name: 'LeetCode',
    icon: SiLeetcode,
    color: '#FFA116',
    bg: 'rgba(255, 161, 22, 0.05)',
    url: 'https://leetcode.com/u/yash_khandelwal123/',
    stats: [
      { label: 'Problems Solved', value: '500+' },
      { label: 'Contest Rating', value: '1500+' },
    ],
  },
  {
    name: 'GitHub',
    icon: FaGithub,
    color: '#ffffff',
    bg: 'rgba(255, 255, 255, 0.05)',
    url: 'https://github.com/Yashkhandelwal683',
    stats: [
      { label: 'Repositories', value: '20+' },
      { label: 'Contributions', value: '500+' },
      { label: 'Stars', value: '10+' },
    ],
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedin,
    color: '#0A66C2',
    bg: 'rgba(10, 102, 194, 0.05)',
    url: 'https://www.linkedin.com/in/yash-khandelwal-0a06032a6/',
    stats: [
      { label: 'Connections', value: '100+' },
      { label: 'Projects', value: '5+' },
      { label: 'Skills', value: '15+' },
    ],
  },
  {
    name: 'Codolio',
    icon: FaGlobe,
    color: '#6C63FF',
    bg: 'rgba(108, 99, 255, 0.05)',
    url: 'https://codolio.com/profile/Yash_gla2535',
    stats: [
      { label: 'Platforms', value: '5+' },
      { label: 'Active Days', value: '200+' },
      { label: 'Questions Solved', value: '500+' },
    ],
  },
]

export default function CodingProfiles() {
  return (
    <SectionWrapper id="codingprofiles" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Coding <span className="gradient-text">Profiles</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {profileData.map((profile, i) => {
            const Icon = profile.icon
            return (
              <motion.a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{
                  scale: 1.04,
                  y: -8,
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                className="glass-card p-8 group relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top right, ${profile.color}15, transparent)` }}
                />
                <div
                  className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${profile.color}10, transparent 70%)`,
                    filter: 'blur(30px)',
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <Icon style={{ color: profile.color }} className="text-4xl" />
                    <FaExternalLinkAlt className="text-gray-500 group-hover:text-white transition-colors text-sm" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{profile.name}</h3>
                  <div className="space-y-3">
                    {profile.stats.map((stat) => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{stat.label}</span>
                        <span className="text-white font-semibold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
