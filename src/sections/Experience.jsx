import { motion } from 'framer-motion'
import { FaBriefcase } from 'react-icons/fa'
import SectionWrapper from '../components/SectionWrapper'

const experiences = [
  {
    role: 'Full Stack Web Development Intern',
    company: 'Future Interns',
    duration: '2025 - Present',
    responsibilities: [
      'Developing full-stack web applications using modern technologies',
      'Collaborating with team members on project architecture and implementation',
      'Implementing responsive designs and ensuring cross-browser compatibility',
      'Writing clean, maintainable code following industry best practices',
    ],
  },
]

export default function Experience() {
  return (
    <SectionWrapper id="experience" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              whileHover={{
                scale: 1.02,
                y: -6,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className="glass-card p-8 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaBriefcase className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <p className="text-primary text-sm">{exp.company}</p>
                  <p className="text-gray-500 text-xs">{exp.duration}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {exp.responsibilities.map((resp, j) => (
                  <li key={j} className="flex items-start gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
