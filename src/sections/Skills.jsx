import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  FaReact, FaHtml5, FaCss3Alt, FaNodeJs, FaJava,
  FaGitAlt, FaGithub, FaDocker, FaAws,
} from 'react-icons/fa'
import {
  SiTailwindcss, SiRedux, SiJavascript, SiTypescript,
  SiExpress, SiSpringboot, SiMongodb, SiMysql,
  SiPostman, SiVercel, SiPython, SiNextdotjs,
  SiPostgresql, SiFirebase, SiLinux, SiGooglecloud,
  SiNetlify, SiBootstrap, SiFramer,
  SiC, SiCplusplus, SiKotlin,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

const skillRows = [
  [
    { name: 'C', icon: SiC, color: '#A8B9CC' },
    { name: 'C++', icon: SiCplusplus, color: '#00599C' },
    { name: 'Java', icon: FaJava, color: '#ED8B00' },
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'Kotlin', icon: SiKotlin, color: '#7F52FF' },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
    { name: 'Express', icon: SiExpress, color: '#fff' },
    { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' },
  ],
  [
    { name: 'HTML', icon: FaHtml5, color: '#E34F26' },
    { name: 'CSS', icon: FaCss3Alt, color: '#1572B6' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    { name: 'React', icon: FaReact, color: '#61DAFB' },
    { name: 'Redux', icon: SiRedux, color: '#764ABC' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#fff' },
    { name: 'Framer', icon: SiFramer, color: '#0055FF' },
  ],
  [
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    { name: 'Docker', icon: FaDocker, color: '#2496ED' },
    { name: 'Linux', icon: SiLinux, color: '#FCC624' },
    { name: 'AWS', icon: FaAws, color: '#FF9900' },
    { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
  ],
  [
    { name: 'Git', icon: FaGitAlt, color: '#F05032' },
    { name: 'GitHub', icon: FaGithub, color: '#fff' },
    { name: 'VS Code', icon: VscVscode, color: '#007ACC' },
    { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
    { name: 'Vercel', icon: SiVercel, color: '#fff' },
    { name: 'Netlify', icon: SiNetlify, color: '#00C7B7' },
  ],
]

const rowConfigs = [
  { direction: 'left', speed: 45 },
  { direction: 'right', speed: 28 },
  { direction: 'left', speed: 18 },
  { direction: 'right', speed: 40 },
]

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
  opacity: Math.random() * 0.5 + 0.2,
}))

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 2.5, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const SkillCard = memo(function SkillCard({ tech, index }) {
  const Icon = tech.icon
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center gap-1.5 shrink-0 select-none group cursor-default"
      style={{
        width: 'clamp(60px, 11vw, 80px)',
        height: 'clamp(60px, 11vw, 80px)',
      }}
      animate={{ y: [0, -4, 0] }}
      transition={{
        duration: 3 + (index % 3) * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: (index % 5) * 0.15,
      }}
      whileHover={{
        scale: 1.12,
        rotate: 3,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      }}
    >
      <motion.div
        className="absolute -inset-3 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${tech.color}18, transparent 70%)`,
          filter: 'blur(16px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
      />

      <div
        className="absolute inset-0 rounded-[18px] transition-all duration-300"
        style={{
          background: '#1E2435',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 20px rgba(59,130,246,0.08)',
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{
          border: `1px solid ${tech.color}25`,
          boxShadow: `0 0 20px ${tech.color}15, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      <div className="absolute inset-0 rounded-[18px] transition-all duration-300 group-hover:bg-white/[0.03]" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-1 px-1"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.12,
        }}
      >
        <Icon className="text-xl md:text-2xl" style={{ color: tech.color }} />
        <span className="text-[8px] md:text-[10px] font-medium text-gray-400 text-center leading-tight">
          {tech.name}
        </span>
      </motion.div>
    </motion.div>
  )
})

function MarqueeRow({ items, direction, speed }) {
  const x = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
  return (
    <div className="overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <motion.div
        className="flex gap-3 md:gap-4 w-max"
        animate={{ x }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: 'linear',
          repeatType: 'loop',
        }}
      >
        {items.map((tech, i) => (
          <SkillCard key={`${tech.name}-${i}`} tech={tech} index={i} />
        ))}
        {items.map((tech, i) => (
          <SkillCard key={`dup-${tech.name}-${i}`} tech={tech} index={i} />
        ))}
      </motion.div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 bg-[#070B14]" />

      <StarField />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,97,255,0.05), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 mb-4">
            MY EXPERTISE
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Technical <span className="gradient-text-skill">Skills</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            A continuous stream of technologies I use to build scalable, high-performance applications.
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          <MarqueeRow
            items={skillRows[0]}
            direction={rowConfigs[0].direction}
            speed={rowConfigs[0].speed}
          />
          <MarqueeRow
            items={skillRows[1]}
            direction={rowConfigs[1].direction}
            speed={rowConfigs[1].speed}
          />
          <div className="hidden md:block">
            <MarqueeRow
              items={skillRows[2]}
              direction={rowConfigs[2].direction}
              speed={rowConfigs[2].speed}
            />
          </div>
          <div className="hidden lg:block">
            <MarqueeRow
              items={skillRows[3]}
              direction={rowConfigs[3].direction}
              speed={rowConfigs[3].speed}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
