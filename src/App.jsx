import { AnimationStateManager } from './contexts/AnimationStateContext'
import { useAnimationState } from './contexts/AnimationStateContext'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { CustomCursor } from './components/CustomCursor'

function AppContent() {
  const { activeTheme } = useAnimationState()
  const isDeco = activeTheme === 'deco'

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{
        backgroundColor: isDeco ? '#f5f0e1' : '#0a0a0a',
      }}
    >
      <CustomCursor />
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AnimationStateManager>
      <AppContent />
    </AnimationStateManager>
  )
}

export default App
