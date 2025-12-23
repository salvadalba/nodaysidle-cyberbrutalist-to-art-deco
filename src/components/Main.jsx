import { useAnimationState } from '../contexts/AnimationStateContext'
import ContactForm from './ContactForm'
import CaseStudyViewer from './CaseStudyViewer'

function Main() {
  const { themeProgress, activeTheme, scrollPosition } = useAnimationState()
  const isDeco = activeTheme === 'deco'

  // Border color transitions
  const getBorderColor = (index) => {
    const baseColor = isDeco ? '#d4af37' : '#00ff41'
    return baseColor
  }

  // Get section-specific styles
  const getSectionStyle = (sectionIndex) => {
    const baseOpacity = 1
    const offset = sectionIndex * 0.1
    const localProgress = Math.max(0, Math.min(1, (themeProgress - offset) / (1 - offset)))

    return {
      opacity: baseOpacity,
      borderColor: getBorderColor(sectionIndex),
      backgroundColor: isDeco ? '#f5f0e1' : '#0a0a0a',
    }
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center border-b-4 transition-all duration-500"
        style={getSectionStyle(0)}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className={`text-6xl md:text-8xl font-bold mb-6 uppercase transition-all duration-700 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Digital Chaos
            <br />
            <span className={`transition-all duration-700 ${isDeco ? 'text-deco-gold' : 'text-cyber-neon'}`}>
              {isDeco ? '⟡ Elegant Order ⟡' : 'Elegant Order'}
            </span>
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto opacity-80 transition-all duration-500 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Scroll to witness the transformation from cyber-brutalist chaos to Art Deco elegance
          </p>
          <div className="mt-8 text-sm opacity-60">
            Scroll Progress: {Math.round(themeProgress * 100)}%
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section
        id="work"
        className="min-h-screen flex items-center border-b-4 transition-all duration-500 py-20"
        style={getSectionStyle(1)}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`text-4xl font-bold uppercase mb-12 transition-all duration-500 text-center ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {isDeco ? '✦ Selected Work ✦' : 'Selected Work'}
          </h2>
          <CaseStudyViewer />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center border-b-4 transition-all duration-500"
        style={getSectionStyle(2)}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`text-4xl font-bold uppercase mb-8 transition-all duration-500 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {isDeco ? '✦ About ✦' : 'About'}
          </h2>
          <p className={`opacity-60 max-w-xl transition-all duration-500 ${isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist'}`}>
            About content coming soon...
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center transition-all duration-500 py-20"
        style={getSectionStyle(3)}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`text-4xl font-bold uppercase mb-8 transition-all duration-500 text-center ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {isDeco ? '✦ Contact ✦' : 'Contact'}
          </h2>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}

export default Main
