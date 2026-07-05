import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaBriefcase, FaLanguage } from 'react-icons/fa'
import { HiAcademicCap, HiHeart } from 'react-icons/hi'
import SectionWrapper from '../components/SectionWrapper'

export default function About() {
  const quickFacts = [
    { icon: FaMapMarkerAlt, label: 'Location', value: 'India' },
    { icon: FaBriefcase, label: 'Availability', value: 'Open for Opportunities' },
    { icon: FaLanguage, label: 'Languages', value: 'English, Hindi' },
  ]

  return (
    <SectionWrapper id="about" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="flex justify-center items-center w-full"
          >
            <div className="relative flex justify-center items-center w-full" style={{ minHeight: 500, overflow: 'visible' }}>
              <div
                className="absolute rounded-full animate-pulse-glow"
                style={{
                  width: 500,
                  height: 500,
                  background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 60%)',
                  filter: 'blur(100px)',
                  bottom: '5%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 60%)',
                  filter: 'blur(80px)',
                  top: '5%',
                  right: '5%',
                }}
              />

              <div className="relative z-10 flex items-center justify-center" style={{ width: 400, height: 400 }}>
                <div
                  className="absolute rounded-full border border-primary/20"
                  style={{ width: 380, height: 380 }}
                />
                <div
                  className="absolute rounded-full border border-secondary/15"
                  style={{ width: 300, height: 300 }}
                />
                <div
                  className="absolute rounded-full border border-primary/10"
                  style={{ width: 220, height: 220 }}
                />

                {[
                  { icon: '<>', x: 0, y: -155, size: 36 },
                  { icon: '{ }', x: 140, y: -70, size: 28 },
                  { icon: '()', x: 100, y: 120, size: 24 },
                  { icon: '[]', x: -100, y: 120, size: 24 },
                  { icon: '**', x: -140, y: -70, size: 28 },
                  { icon: '//', x: 0, y: 155, size: 20 },
                  { icon: '=>', x: 170, y: 25, size: 18 },
                  { icon: '&&', x: -170, y: 25, size: 18 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="absolute flex items-center justify-center rounded-xl glass-card text-primary font-mono font-bold select-none cursor-default"
                    style={{
                      width: item.size + 20,
                      height: item.size + 10,
                      fontSize: item.size * 0.45,
                      left: `calc(50% + ${item.x}px)`,
                      top: `calc(50% + ${item.y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3,
                    }}
                  >
                    {item.icon}
                  </motion.div>
                ))}

                <motion.div
                  className="glass-card flex items-center justify-center flex-col"
                  style={{ width: 140, height: 140, borderRadius: 40 }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-2">
                    <span className="text-2xl text-white font-bold">&lt;/&gt;</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">developer</span>
                  <div className="flex gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 60 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
            }}
            className="space-y-6"
          >
            <p className="text-gray-300 leading-relaxed text-lg">
              I am a passionate Full Stack Developer and competitive programmer who loves building
              scalable web applications and solving Data Structures & Algorithms problems.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HiAcademicCap className="text-primary text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Education</h4>
                  <p className="text-gray-400">B.Tech in Computer Science and Engineering</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HiHeart className="text-secondary text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Passion</h4>
                  <p className="text-gray-400">
                    Building real-world projects using React, Node.js, Express, MongoDB and Java Spring Boot.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaBriefcase className="text-primary text-xl mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold">Career Objective</h4>
                  <p className="text-gray-400">
                    To become a Software Engineer at a top product-based company.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {quickFacts.map((fact) => {
                const Icon = fact.icon
                return (
                  <div key={fact.label} className="glass-card p-4 text-center">
                    <Icon className="text-primary text-xl mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold">{fact.value}</p>
                    <p className="text-gray-500 text-xs">{fact.label}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
