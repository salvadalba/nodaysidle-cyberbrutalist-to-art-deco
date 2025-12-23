import { useAnimationState } from '../contexts/AnimationStateContext'

function Header() {
  const { themeProgress, activeTheme, scrollPosition } = useAnimationState()

  const isDeco = activeTheme === 'deco'
  const opacity = Math.max(0.3, 1 - themeProgress * 0.7)

  const headerStyle = {
    opacity,
    transform: `translateY(${Math.min(scrollPosition.scrollY * 0.5, 100)}px)`,
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b-4 bg-cyber-black transition-all duration-300"
      style={{
        borderColor: isDeco ? 'var(--deco-gold, #d4af37)' : 'var(--cyber-neon, #00ff41)',
        backgroundColor: isDeco ? 'var(--deco-cream, #f5f0e1)' : 'var(--cyber-black, #0a0a0a)',
        ...headerStyle,
      }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1
            className={`text-2xl font-bold uppercase tracking-widest transition-all duration-500 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            {isDeco ? '✦ Gilded Glitch ✦' : 'Gilded Glitch'}
          </h1>
          <ul className={`flex gap-6 text-sm uppercase tracking-wide transition-all duration-500 ${
            isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
          }`}>
            <li><a href="#work" className="hover:text-deco-gold transition-colors">Work</a></li>
            <li><a href="#about" className="hover:text-deco-gold transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-deco-gold transition-colors">Contact</a></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header
