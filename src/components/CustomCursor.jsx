import { useEffect, useState, useRef } from 'react'
import { useAnimationState } from '../contexts/AnimationStateContext'

/**
 * CustomCursor - Interactive cursor that changes style based on theme
 * - Cyber theme: Glitchy, raw, monospace
 * - Deco theme: Elegant, smooth, decorative
 */
export function CustomCursor() {
  const { activeTheme, themeProgress, animations } = useAnimationState()
  const cursorRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible])

  // Track hoverable elements
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-hover]')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    document.addEventListener('mouseover', handleMouseOver)
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [])

  // Hide default cursor on desktop
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (!isTouchDevice) {
      document.body.style.cursor = 'none'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
  }, [])

  // Don't render on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouchDevice) return null

  const isDeco = activeTheme === 'deco'

  // Cursor styles based on theme
  const cursorStyle = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 9999,
    transition: isDeco
      ? 'transform 0.15s ease-out, width 0.3s ease, height 0.3s ease, opacity 0.3s ease'
      : 'transform 0.05s ease-out, width 0.2s ease, height 0.2s ease',
    opacity: isVisible ? 1 : 0,
  }

  const size = isHovering ? (isDeco ? 60 : 50) : isDeco ? 30 : 20

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        style={cursorStyle}
        className={`rounded-full ${isDeco ? 'mix-blend-difference' : ''}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={isDeco ? 'opacity-80' : 'opacity-100'}
        >
          {isDeco ? (
            // Art Deco elegant cursor
            <>
              <circle
                cx="50"
                cy="50"
                r={isHovering ? 45 : 35}
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
                className="animate-spin-slow"
                style={{ transformOrigin: 'center' }}
              />
              <circle
                cx="50"
                cy="50"
                r={isHovering ? 30 : 20}
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
              />
              {isHovering && (
                <>
                  <path
                    d="M50 5 L50 95 M5 50 L95 50"
                    stroke="#d4af37"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <circle cx="50" cy="50" r="5" fill="#d4af37" />
                </>
              )}
            </>
          ) : (
            // Cyber brutalist cursor - glitchy square
            <>
              <rect
                x={isHovering ? 20 : 30}
                y={isHovering ? 20 : 30}
                width={isHovering ? 60 : 40}
                height={isHovering ? 60 : 40}
                fill="none"
                stroke="#00ff41"
                strokeWidth="3"
              />
              <rect
                x={isHovering ? 25 : 35}
                y={isHovering ? 25 : 35}
                width={isHovering ? 50 : 30}
                height={isHovering ? 50 : 30}
                fill="#00ff41"
                opacity="0.2"
              />
              {isHovering && (
                <>
                  <rect x="20" y="45" width="60" height="3" fill="#00ff41" opacity="0.5" />
                  <rect x="45" y="20" width="3" height="60" fill="#00ff41" opacity="0.5" />
                </>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Trailing dot effect */}
      <div
        style={{
          ...cursorStyle,
          transition: 'transform 0.3s ease-out',
          opacity: isVisible ? 0.5 : 0,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: isDeco ? 8 : 6,
            height: isDeco ? 8 : 6,
            backgroundColor: isDeco ? '#d4af37' : '#00ff41',
          }}
        />
      </div>
    </>
  )
}

export default CustomCursor
