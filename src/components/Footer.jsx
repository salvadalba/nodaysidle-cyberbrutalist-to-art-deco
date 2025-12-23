import { useAnimationState } from '../contexts/AnimationStateContext'

function Footer() {
  const { activeTheme, themeProgress } = useAnimationState()
  const isDeco = activeTheme === 'deco'

  return (
    <footer
      className="border-t-4 py-8 transition-all duration-500"
      style={{
        borderColor: isDeco ? '#d4af37' : '#00ff41',
        backgroundColor: isDeco ? '#f5f0e1' : '#0a0a0a',
      }}
    >
      <div
        className={`container mx-auto px-4 text-center text-sm opacity-60 transition-all duration-500 ${
          isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
        }`}
      >
        <p>
          {isDeco && '✦ '}
          &copy; 2025 Gilded Glitch Portfolio. All rights reserved.
          {isDeco && ' ✦'}
        </p>
      </div>
    </footer>
  )
}

export default Footer
