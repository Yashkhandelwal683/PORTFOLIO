import { motion } from 'framer-motion'
import SectionWrapper from '../components/SectionWrapper'
import LeetCodeStats from '../components/LeetCodeStats'
import LeetCodeHeatmap from '../components/LeetCodeHeatmap'
import GitHubStats from '../components/GitHubStats'
import CodolioCard from '../components/CodolioCard'

export default function Heatmap() {
  return (
    <SectionWrapper id="heatmap" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Coding <span className="gradient-text">Analytics</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        {/* LeetCode Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFA116] to-[#FFA116]/50 rounded-full" />
            <h3 className="text-2xl font-bold text-white">LeetCode Analytics</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <LeetCodeStats username="yash_khandelwal123" />
            <LeetCodeHeatmap username="yash_khandelwal123" />
          </div>
        </motion.div>

        {/* GitHub Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-white to-white/50 rounded-full" />
            <h3 className="text-2xl font-bold text-white">GitHub Analytics</h3>
          </div>
          <GitHubStats username="Yashkhandelwal683" />
        </motion.div>

        {/* Codolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#6C63FF] to-[#6C63FF]/50 rounded-full" />
            <h3 className="text-2xl font-bold text-white">Codolio Profile</h3>
          </div>
          <CodolioCard />
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
