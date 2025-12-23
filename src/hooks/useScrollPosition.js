import { useState, useEffect } from 'react'

/**
 * Custom hook to track scroll position with throttling for performance
 * @returns {Object} Scroll position data
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollDirection: 'down',
    isScrolling: false,
    scrollPercentage: 0,
  })

  useEffect(() => {
  let lastScrollY = window.scrollY
  let ticking = false
  let scrollTimeout

  const updateScrollPosition = () => {
    const currentScrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = Math.min((currentScrollY / documentHeight) * 100, 100)

    setScrollPosition({
      scrollY: currentScrollY,
      scrollDirection: currentScrollY > lastScrollY ? 'down' : 'up',
      isScrolling: true,
      scrollPercentage,
    })

    lastScrollY = currentScrollY
    ticking = false

    // Clear previous timeout and set new one
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      setScrollPosition(prev => ({ ...prev, isScrolling: false }))
    }, 150)
  }

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition)
      ticking = true
    }
  }

  // Add event listener
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Initial check
  updateScrollPosition()

  // Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll)
    clearTimeout(scrollTimeout)
  }
  }, [])

  return scrollPosition
}
