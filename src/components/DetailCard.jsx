import { motion } from 'framer-motion'
import { FaTimes, FaStar } from 'react-icons/fa'

const levelStars = { Advanced: 5, Intermediate: 3, Learning: 1 }
const levelGradients = {
  Advanced: 'from-primary to-cyan-400',
  Intermediate: 'from-secondary to-purple-400',
  Learning: 'from-yellow-400 to-orange-400',
}

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={`text-[10px] ${i <= count ? 'text-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )
}

export default function DetailCard({ tech, category, onClose, insideContainer }) {
  if (!tech) return null
  const pos = insideContainer ? 'absolute' : 'fixed'

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`${pos} inset-0 z-40 bg-black/40`}
        onClick={onClose}
      />

      {/* Side panel */}
      <motion.div
        initial={{ opacity: 0, x: 320 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 320 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        className={`${pos} z-50 right-0 top-0 h-full w-full max-w-sm pointer-events-none`}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative h-full pointer-events-auto overflow-y-auto"
          style={{ borderRadius: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${category.color}20, rgba(0,0,0,0.85))`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: `1px solid ${category.color}30`,
              boxShadow: `-10px 0 60px ${category.color}15`,
            }}
          />
          <div
            className="absolute inset-0 p-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${category.color}40, transparent 30%, transparent 70%, ${category.color}20)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          <div className="relative p-8 pt-12">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <FaTimes className="text-sm" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${category.color}25` }}
              >
                {tech.icon ? (
                  <tech.icon className="text-2xl" style={{ color: category.color }} />
                ) : (
                  <span className="text-xl font-bold" style={{ color: category.color }}>
                    {tech.name[0]}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                <p className="text-xs text-gray-400">{category.name}</p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">Experience</p>
              <p className="text-base text-white font-semibold">{tech.timeline || 'Active'}</p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-5">{tech.desc}</p>

            {tech.projects && tech.projects.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Projects</p>
                <div className="flex flex-wrap gap-2">
                  {tech.projects.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] border border-white/[0.08] text-gray-200"
                    >
                      • {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tech.features && tech.features.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {tech.features.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] border border-white/[0.08] text-gray-200"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">Level</span>
              <div className="flex items-center gap-2">
                <StarRating count={levelStars[tech.level] || 1} />
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${levelGradients[tech.level] || levelGradients.Learning} text-black`}
                >
                  {tech.level}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
