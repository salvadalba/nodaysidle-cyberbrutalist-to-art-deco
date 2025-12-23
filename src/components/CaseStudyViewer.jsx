import { useAnimationState } from '../contexts/AnimationStateContext'
import { useCaseStudy } from '../hooks/useCaseStudy'

/**
 * CaseStudyViewer - Interactive component for displaying portfolio projects
 * Features keyboard navigation, fullscreen mode, and theme-aware styling
 */
function CaseStudyViewer() {
  const { activeTheme } = useAnimationState()
  const isDeco = activeTheme === 'deco'

  const {
    currentCaseStudy,
    hasNext,
    hasPrev,
    nextCaseStudy,
    prevCaseStudy,
    total,
    currentIndex,
  } = useCaseStudy()

  if (!currentCaseStudy) {
    return (
      <div className="text-center py-20">
        <p className={`opacity-60 ${isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist'}`}>
          No case studies available
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Case Study Card */}
      <div
        className="border-4 p-8 transition-all duration-500"
        style={{
          borderColor: isDeco ? '#d4af37' : '#00ff41',
          backgroundColor: isDeco ? 'rgba(212, 175, 55, 0.05)' : 'rgba(0, 255, 65, 0.02)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p
              className={`text-sm uppercase tracking-widest mb-2 opacity-60 transition-all duration-300 ${
                isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
              }`}
            >
              {currentCaseStudy.category} — {currentCaseStudy.year}
            </p>
            <h3
              className={`text-4xl md:text-5xl font-bold uppercase transition-all duration-300 ${
                isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
              }`}
            >
              {isDeco && '✦ '}
              {currentCaseStudy.title}
              {isDeco && ' ✦'}
            </h3>
          </div>

          {/* Counter */}
          <div
            className={`mt-4 md:mt-0 text-2xl font-bold ${
              isDeco ? 'font-deco text-deco-gold' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Client Info */}
        <div
          className={`mb-8 pb-8 border-b-2 transition-all duration-300 ${
            isDeco ? 'border-deco-gold' : 'border-cyber-neon'
          }`}
        >
          <p
            className={`text-sm uppercase tracking-wide mb-2 transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Client
          </p>
          <p
            className={`text-xl transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {currentCaseStudy.client}
          </p>
        </div>

        {/* Description */}
        <p
          className={`text-lg leading-relaxed mb-8 max-w-3xl transition-all duration-300 ${
            isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
          }`}
        >
          {currentCaseStudy.description}
        </p>

        {/* Services */}
        <div className="mb-8">
          <p
            className={`text-sm uppercase tracking-wide mb-4 transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Services
          </p>
          <div className="flex flex-wrap gap-3">
            {currentCaseStudy.services.map((service, index) => (
              <span
                key={index}
                className={`px-4 py-2 border-2 text-sm uppercase tracking-wide transition-all duration-300 ${
                  isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
                }`}
                style={{
                  borderColor: isDeco ? '#d4af37' : '#00ff41',
                }}
              >
                {isDeco && index % 2 === 0 && '✦ '}
                {service}
                {isDeco && index % 2 !== 0 && ' ✦'}
              </span>
            ))}
          </div>
        </div>

        {/* Placeholder for images */}
        <div
          className="aspect-video border-2 flex items-center justify-center opacity-40 transition-all duration-300"
          style={{
            borderColor: isDeco ? '#d4af37' : '#00ff41',
          }}
        >
          <p
            className={`text-sm uppercase tracking-widest transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            [ Project Images ]
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t-2 border-current border-opacity-20">
          <button
            onClick={prevCaseStudy}
            disabled={!hasPrev}
            className={`
              px-6 py-3 border-2 uppercase tracking-wider font-bold
              transition-all duration-300
              ${hasPrev ? 'hover:opacity-80' : 'opacity-30 cursor-not-allowed'}
              ${isDeco ? 'font-deco' : 'font-brutalist'}
            `}
            style={{
              borderColor: isDeco ? '#d4af37' : '#00ff41',
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
          >
            {isDeco ? '← Previous' : '[ PREVIOUS ]'}
          </button>

          <div className="hidden md:flex gap-2">
            {Array.from({ length: total }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  // In a real implementation, you'd expose goToCaseStudy from the hook
                  // For now, this is just a visual indicator
                }}
                className={`w-3 h-3 transition-all duration-300 ${
                  index === currentIndex
                    ? (isDeco ? 'bg-deco-gold scale-125' : 'bg-cyber-neon scale-125')
                    : (isDeco ? 'bg-deco-charcoal opacity-30' : 'bg-cyber-neon opacity-30')
                }`}
                style={{
                  backgroundColor: index === currentIndex
                    ? (isDeco ? '#d4af37' : '#00ff41')
                    : (isDeco ? '#2c2c2c' : '#00ff41'),
                }}
              />
            ))}
          </div>

          <button
            onClick={nextCaseStudy}
            disabled={!hasNext}
            className={`
              px-6 py-3 border-2 uppercase tracking-wider font-bold
              transition-all duration-300
              ${hasNext ? 'hover:opacity-80' : 'opacity-30 cursor-not-allowed'}
              ${isDeco ? 'font-deco' : 'font-brutalist'}
            `}
            style={{
              borderColor: isDeco ? '#d4af37' : '#00ff41',
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
          >
            {isDeco ? 'Next →' : '[ NEXT ]'}
          </button>
        </div>

        {/* Keyboard hint */}
        <p
          className={`text-xs text-center mt-6 opacity-40 transition-all duration-300 ${
            isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist'
          }`}
        >
          Use arrow keys to navigate • Press F for fullscreen
        </p>
      </div>
    </div>
  )
}

export default CaseStudyViewer
