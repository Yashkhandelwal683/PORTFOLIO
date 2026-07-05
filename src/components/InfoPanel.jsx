import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaProjectDiagram } from 'react-icons/fa'
import { useState } from 'react'

export default function InfoPanel({ face, onClose }) {
  const [showAll, setShowAll] = useState(false)

  if (!face) return null

  const Icon = face.icon
  const displayedSkills = showAll ? face.skills : face.skills.slice(0, 6)

  const topProjects = face.skills
    .flatMap((s) => s.projects || [])
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .slice(0, 4)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="relative"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${face.color}25`,
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 0%, ${face.color}08, transparent 70%)`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#888',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = '#888'
          }}
        >
          <FaTimes className="text-xs" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: `${face.color}18`,
                border: `1px solid ${face.color}30`,
              }}
            >
              <Icon style={{ color: face.color, fontSize: 22 }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{face.label}</h3>
              <p className="text-sm" style={{ color: face.color }}>{face.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-gray-500 text-xs mb-1">Experience</p>
              <p className="text-white font-semibold text-sm">
                {face.experience || `${Math.max(...face.skills.filter(s => s.timeline).map(s => {
                  const m = s.timeline.match(/(\d+)\+?\s*(Year|Month)/i)
                  return m ? (m[2]?.toLowerCase().startsWith('y') ? parseInt(m[1]) * 12 : parseInt(m[1])) : 0
                }), 0)} Months`}
              </p>
            </div>
            <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-gray-500 text-xs mb-1">Technologies</p>
              <p className="text-white font-semibold text-sm">{face.skills.length}</p>
            </div>
            <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-gray-500 text-xs mb-1">Projects</p>
              <p className="text-white font-semibold text-sm">{topProjects.length}+</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Skill Level</p>
              <p className="text-gray-500 text-xs">{face.level || 'Advanced'}</p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${face.progress || 90}%` }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${face.color}, ${face.color}88)`,
                  boxShadow: `0 0 12px ${face.color}40`,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Technologies</p>
            <div className="space-y-2">
              {displayedSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2.5">
                    {skill.icon ? (
                      <skill.icon style={{ color: face.color, fontSize: 14 }} />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: face.color }} />
                    )}
                    <span className="text-white text-sm">{skill.name}</span>
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${face.color}12`,
                      color: face.color,
                      border: `1px solid ${face.color}20`,
                    }}
                  >
                    {skill.level || 'Proficient'}
                  </span>
                </motion.div>
              ))}
            </div>
            {face.skills.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-2 text-xs py-2 rounded-xl transition-all"
                style={{
                  color: face.color,
                  background: `${face.color}08`,
                  border: `1px solid ${face.color}15`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${face.color}15` }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${face.color}08` }}
              >
                {showAll ? 'Show Less' : `Show All (${face.skills.length})`}
              </button>
            )}
          </div>

          {topProjects.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Recent Projects</p>
              <div className="flex flex-wrap gap-2">
                {topProjects.map((project) => (
                  <span
                    key={project}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full"
                    style={{
                      background: `${face.color}10`,
                      border: `1px solid ${face.color}20`,
                      color: '#ccc',
                    }}
                  >
                    <FaProjectDiagram style={{ color: face.color, fontSize: 9 }} />
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="p-4 rounded-xl text-xs leading-relaxed"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              color: '#888',
            }}
          >
            {face.description || `Specialized in ${face.label.toLowerCase()} technologies for building modern, scalable applications.`}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
