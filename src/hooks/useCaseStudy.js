import { useState, useCallback, useEffect } from 'react'
import { trackCaseStudyView } from '../services/analyticsService'

/**
 * Sample case studies data
 * In production, this would come from an API or content file
 */
const SAMPLE_CASE_STUDIES = [
  {
    id: 1,
    title: 'Neon Dreams',
    client: 'Cyberpunk Collective',
    category: 'Web Design',
    year: '2024',
    description: 'A brutalist e-commerce experience that pushes the boundaries of conventional shopping interfaces.',
    services: ['Web Design', 'Development', 'Brand Identity'],
    images: [],
    featured: true,
  },
  {
    id: 2,
    title: 'Golden Era',
    client: 'Heritage Hotels',
    category: 'Brand Identity',
    year: '2024',
    description: 'Reimagining luxury hospitality through Art Deco inspired visual language and digital experiences.',
    services: ['Brand Strategy', 'Visual Identity', 'Website'],
    images: [],
    featured: true,
  },
  {
    id: 3,
    title: 'Digital Renaissance',
    client: 'Modern Art Museum',
    category: 'Interactive',
    year: '2023',
    description: 'An interactive exhibition guide that transforms the museum visit into a seamless digital journey.',
    services: ['UX Design', 'App Development', 'Installation'],
    images: [],
    featured: false,
  },
]

/**
 * useCaseStudy - Hook for managing case study state and navigation
 * @param {number} initialId - Optional initial case study ID
 */
export function useCaseStudy(initialId = null) {
  const [caseStudies] = useState(SAMPLE_CASE_STUDIES)
  const [currentIndex, setCurrentIndex] = useState(
    initialId ? caseStudies.findIndex(c => c.id === initialId) : 0
  )
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentCaseStudy = caseStudies[currentIndex]
  const hasNext = currentIndex < caseStudies.length - 1
  const hasPrev = currentIndex > 0

  // Navigation functions
  const nextCaseStudy = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [hasNext])

  const prevCaseStudy = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [hasPrev])

  const goToCaseStudy = useCallback((id) => {
    const index = caseStudies.findIndex(c => c.id === id)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [caseStudies])

  // Track case study view when it changes
  useEffect(() => {
    if (currentCaseStudy) {
      trackCaseStudyView(currentCaseStudy.id)
    }
  }, [currentCaseStudy?.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        nextCaseStudy()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevCaseStudy()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextCaseStudy, prevCaseStudy, isFullscreen])

  return {
    // Data
    caseStudies,
    currentCaseStudy,
    currentIndex,

    // State
    isFullscreen,

    // Actions
    nextCaseStudy,
    prevCaseStudy,
    goToCaseStudy,
    setIsFullscreen,

    // Helpers
    hasNext,
    hasPrev,
    total: caseStudies.length,
  }
}

export default useCaseStudy
