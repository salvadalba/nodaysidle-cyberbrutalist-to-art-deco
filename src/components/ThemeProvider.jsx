import { useAnimationState } from '../contexts/AnimationStateContext'

/**
 * ThemeProvider - Applies dynamic theme styles based on scroll position
 * Transitions from cyber-brutalist (green/black, mono) to Art Deco (gold, serif)
 */
export function ThemeProvider() {
  const { themeProgress, activeTheme } = useAnimationState()

  // Interpolate colors based on theme progress
  const cyberBlack = { r: 10, g: 10, b: 10 }
  const decoCream = { r: 245, g: 240, b: 225 }

  const cyberNeon = { r: 0, g: 255, b: 65 }
  const decoGold = { r: 212, g: 175, b: 55 }

  const interpolate = (color1, color2, progress) => {
    const r = Math.round(color1.r + (color2.r - color1.r) * progress)
    const g = Math.round(color1.g + (color2.g - color1.g) * progress)
    const b = Math.round(color1.b + (color2.b - color1.b) * progress)
    return `rgb(${r}, ${g}, ${b})`
  }

  const backgroundColor = interpolate(cyberBlack, decoCream, themeProgress)
  const textColor = interpolate(cyberNeon, decoGold, themeProgress)
  const borderColor = interpolate(cyberNeon, decoGold, themeProgress)

  const isCyber = activeTheme === 'cyber'
  const fontFamily = isCyber ? 'Courier New, monospace' : 'Georgia, serif'

  return (
    <style>{`
      :root {
        --dynamic-bg: ${backgroundColor};
        --dynamic-text: ${textColor};
        --dynamic-border: ${borderColor};
        --dynamic-font: ${fontFamily};
      }
      body {
        background-color: ${backgroundColor} !important;
        color: ${textColor} !important;
        font-family: ${fontFamily} !important;
        transition: background-color 0.3s ease, color 0.3s ease, font-family 0.5s ease;
      }
      .theme-border {
        border-color: ${borderColor} !important;
        transition: border-color 0.3s ease;
      }
      .theme-text {
        color: ${textColor} !important;
        transition: color 0.3s ease;
      }
    `}</style>
  )
}

export default ThemeProvider
