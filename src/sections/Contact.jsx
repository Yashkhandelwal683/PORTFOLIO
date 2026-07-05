import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import SectionWrapper from '../components/SectionWrapper'
import emailjs from '@emailjs/browser'

const socialLinks = [
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/yash-khandelwal-0a06032a6/', color: '#0A66C2' },
  { icon: FaGithub, url: 'https://github.com/Yashkhandelwal683', color: '#ffffff' },
  { icon: FaInstagram, url: 'https://www.instagram.com/yashhhhh.hh2005/', color: '#E4405F' },
  { icon: SiLeetcode, url: 'https://leetcode.com/u/yash_khandelwal123/', color: '#FFA116' },
]

export default function Contact() {
  const formRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setSending(true)
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    } catch {
      console.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <SectionWrapper id="contact" className="section-padding">
      <div className="container-max">
        <motion.div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
            }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
              >
                {sending ? 'Sending...' : sent ? 'Sent!' : 'Send Message'}
                <FaPaperPlane className={sending ? 'animate-spin' : ''} />
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            className="flex flex-col justify-center"
          >
            <p className="text-gray-400 leading-relaxed mb-8">
              Have a question, want to collaborate, or just want to say hi? Fill out the form
              and I&apos;ll get back to you as soon as possible.
            </p>

            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="glass-card p-4 rounded-xl"
                    style={{ boxShadow: `0 0 20px ${link.color}15` }}
                  >
                    <Icon style={{ color: link.color }} className="text-2xl" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
