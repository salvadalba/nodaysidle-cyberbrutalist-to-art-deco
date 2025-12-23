import { apiClient } from '../utils/apiClient'

/**
 * Analytics Service - Tracks user events and page views
 */

// Event types
export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  SCROLL: 'scroll',
  CLICK: 'click',
  CONTACT_FORM_VIEW: 'contact_form_view',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  CASE_STUDY_VIEW: 'case_study_view',
  THEME_CHANGE: 'theme_change',
}

// Queue for batching events (to be implemented)
let eventQueue = []
let isSending = false

/**
 * Track a single analytics event
 * @param {string} eventType - Type of event
 * @param {string} page - Current page path
 * @param {Object} metadata - Additional event metadata
 */
export async function trackEvent(eventType, page = window.location.pathname, metadata = {}) {
  const eventData = {
    event: eventType,
    page,
    timestamp: Date.now(),
    ...metadata,
  }

  // Add to queue
  eventQueue.push(eventData)

  // Process queue
  await processQueue()

  return eventData
}

/**
 * Process the event queue
 */
async function processQueue() {
  if (isSending || eventQueue.length === 0) {
    return
  }

  isSending = true

  while (eventQueue.length > 0) {
    const event = eventQueue.shift()

    try {
      await apiClient.post('/api/analytics', {
        event: event.event,
        page: event.page,
        timestamp: event.timestamp,
      })
    } catch (error) {
      // On failure, put event back in queue
      eventQueue.unshift(event)

      // If it's a rate limit error, wait longer
      if (error.message.includes('HTTP 429')) {
        await delay(5000)
      } else {
        await delay(1000)
      }

      break
    }
  }

  isSending = false
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Track page view (called on route changes)
 */
export function trackPageView(path = window.location.pathname) {
  return trackEvent(AnalyticsEvents.PAGE_VIEW, path)
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(percentage) {
  return trackEvent(AnalyticsEvents.SCROLL, window.location.pathname, {
    depth: `${percentage}%`,
  })
}

/**
 * Track contact form interactions
 */
export function trackContactFormView() {
  return trackEvent(AnalyticsEvents.CONTACT_FORM_VIEW, window.location.pathname)
}

export function trackContactFormSubmit(success = true) {
  return trackEvent(
    AnalyticsEvents.CONTACT_FORM_SUBMIT,
    window.location.pathname,
    { success }
  )
}

/**
 * Track case study views
 */
export function trackCaseStudyView(caseStudyId) {
  return trackEvent(AnalyticsEvents.CASE_STUDY_VIEW, window.location.pathname, {
    caseStudyId,
  })
}

/**
 * Track theme changes (cyber <-> deco)
 */
export function trackThemeChange(theme) {
  return trackEvent(AnalyticsEvents.THEME_CHANGE, window.location.pathname, {
    theme,
  })
}

/**
 * Initialize analytics (call on app mount)
 */
export function initAnalytics() {
  // Track initial page view
  trackPageView()

  // Track scroll milestones
  let trackedDepths = new Set()
  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )

    const milestones = [25, 50, 75, 100]

    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !trackedDepths.has(milestone)) {
        trackedDepths.add(milestone)
        trackScrollDepth(milestone)
      }
    })
  }

  // Throttled scroll handler
  let scrollTimeout
  const throttledScroll = () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(handleScroll, 500)
  }

  window.addEventListener('scroll', throttledScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', throttledScroll)
  }
}

export default {
  trackEvent,
  trackPageView,
  trackScrollDepth,
  trackContactFormView,
  trackContactFormSubmit,
  trackCaseStudyView,
  trackThemeChange,
  initAnalytics,
  AnalyticsEvents,
}
