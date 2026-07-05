import { useEffect } from 'react'
import Lenis from 'lenis'
import SEO from './components/SEO'
import Navbar from './components/Navbar'
import AnimatedBackground from './components/AnimatedBackground'
import MouseGlow from './components/MouseGlow'
import LoadingScreen from './components/LoadingScreen'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import CodingProfiles from './sections/CodingProfiles'
import DeveloperAnalytics from './sections/DeveloperAnalytics'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <>
      <SEO />
      <LoadingScreen />
      <AnimatedBackground />
      <MouseGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CodingProfiles />
        <DeveloperAnalytics />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
