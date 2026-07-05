import { motion } from 'framer-motion'
import { FaGlobe, FaExternalLinkAlt } from 'react-icons/fa'

export default function CodolioCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 gradient-border"
      style={{ borderRadius: '20px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#6C63FF]/5 flex items-center justify-center">
            <FaGlobe className="text-2xl text-[#6C63FF]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Codolio</h3>
            <p className="text-sm text-gray-400">@Yash_gla2535</p>
            <p className="text-xs text-gray-500 mt-0.5">All-in-one coding profile tracker</p>
          </div>
        </div>
        <a
          href="https://codolio.com/profile/Yash_gla2535"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30 hover:bg-[#6C63FF]/20 transition-all text-sm font-medium group"
        >
          View Profile
          <FaExternalLinkAlt className="text-xs group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  )
}
