import { createContext, useContext, useState, useEffect } from 'react'
import { useScrollPosition } from '../hooks/useScrollPosition'

const AnimationStateContext = createContext()

/**
 * AnimationStateManager - Manages global animation state
 * Handles scroll-based theme transitions from cyber-brutalist to Art Deco
 */
export function AnimationStateManager({ children }) {
  const scrollPosition = useScrollPosition()

  // Theme state: 0 = fully cyber-brutalist, 1 = fully Art Deco
  const [themeProgress, setThemeProgress] = useState(0)

  // Current active theme based on scroll position
  const [activeTheme, setActiveTheme] = useState('cyber')

  // Animation states
  const [animations, setAnimations] = useState({
    headerVisible: true,
    cursorEffect: 'default',
    backgroundStyle: 'cyber',
  })

  // Update theme progress based on scroll percentage
  useEffect(() => {
    // Transition starts at 25% scroll and completes at 75%
    const transitionStart = 25
    const transitionEnd = 75

    let progress = 0

    if (scrollPosition.scrollPercentage <= transitionStart) {
      progress = 0
    } else if (scrollPosition.scrollPercentage >= transitionEnd) {
      progress = 1
    } else {
      progress =
        (scrollPosition.scrollPercentage - transitionStart) /
        (transitionEnd - transitionStart)
    }

    setThemeProgress(progress)

    // Determine active theme (with threshold for switching)
    setActiveTheme(progress > 0.5 ? 'deco' : 'cyber')

  }, [scrollPosition.scrollPercentage])

  // Update animation states based on scroll
  useEffect(() => {
    setAnimations({
      headerVisible: scrollPosition.scrollY < 100,
      cursorEffect: themeProgress > 0.3 ? 'elegant' : 'brutalist',
      backgroundStyle: themeProgress > 0.5 ? 'deco' : 'cyber',
    })
  }, [scrollPosition.scrollY, themeProgress])

  const value = {
    // Scroll data
    scrollPosition,
    themeProgress,
    activeTheme,

    // Animation states
    animations,

    // Helper functions
    isCyberTheme: activeTheme === 'cyber',
    isDecoTheme: activeTheme === 'deco',
    getTransitionValue: (property) => {
      // Returns a value interpolated between cyber and deco styles
      return themeProgress
    },
  }

  return (
    <AnimationStateContext.Provider value={value}>
      {children}
    </AnimationStateContext.Provider>
  )
}

/**
 * Hook to access animation state
 * @returns {Object} Animation state values and helpers
 */
export function useAnimationState() {
  const context = useContext(AnimationStateContext)

  if (!context) {
    throw new Error('useAnimationState must be used within AnimationStateManager')
  }

  return context
}
