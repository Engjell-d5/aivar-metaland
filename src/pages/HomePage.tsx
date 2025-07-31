import ChatInput from '../components/ChatInput'
import Footer from '../components/Footer'
import { useMediaQuery } from 'react-responsive'
import UserProfile from '../components/UserProfile'
import { useAuth } from '../hooks/useAuth'
import { useAnimationState } from '../hooks/useAnimationState'
import ScrollHandler from '../components/ScrollHandler'
import SplineBackground from '../components/SplineBackground'
import { getTileRows } from '../utils/tileUtils'
import { getSignUpSection } from '../utils/signUpUtils'
import AnimatedContent from '../components/AnimatedContent'
import { useMemo } from 'react'
import './HomePage.css'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const isMobile = useMediaQuery({ maxWidth: 639 })
  
  const {
    currentRowIndex,
    isAnimating,
    direction,
    rowVariants,
    gpuStyles,
    handleScroll,
    handleExitComplete
  } = useAnimationState()

  // Create rows array with tile grid and signup section
  const rows = useMemo(() => {
    const tileRows = getTileRows(isMobile, gpuStyles)
    const signUpRow = getSignUpSection(isMobile, gpuStyles)
    
    if (isMobile) {
      return [...tileRows, signUpRow]
    } else {
      return [...tileRows, signUpRow]
    }
  }, [isMobile, gpuStyles])

  return (
    isMobile ? (
      <div className="w-full min-h-screen flex flex-col bg-black">
        {/* User Profile Overlay */}
        {isAuthenticated && (
          <div className="fixed top-20 right-4 z-50">
            <UserProfile />
          </div>
        )}
        
        {/* Header with Spline Background */}
        <div className="content-container" style={gpuStyles}>
          <SplineBackground />
        </div>
        
        {/* Main content with scroll handling */}
        <ScrollHandler
          isAnimating={isAnimating}
          currentRowIndex={currentRowIndex}
          onScroll={handleScroll}
        >
          <div 
          className="flex-1 flex flex-col items-center justify-center px-4 relative" 
          id="tiles-container"
        >
          {/* Spline animation background for mobile */}
            <SplineBackground opacity={0.5} zIndex={0} />
            
            <AnimatedContent
              currentRowIndex={currentRowIndex}
              direction={direction}
              rowVariants={rowVariants}
              gpuStyles={gpuStyles}
              onExitComplete={handleExitComplete}
              >
                {rows[currentRowIndex]}
            </AnimatedContent>
          </div>
        </ScrollHandler>
        
        {/* Chat input */}
        <div className="flex-shrink-0 w-full">
          <ChatInput />
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 w-full footer-mobile">
          <Footer />
        </div>
      </div>
    ) : (
      <div className="w-full h-screen" style={gpuStyles}>
        {/* User Profile Overlay */}
        {isAuthenticated && (
          <div className="fixed top-20 right-4 z-50">
            <UserProfile />
          </div>
        )}
        
        {/* Header with Spline Background */}
        <div className="content-container" style={gpuStyles}>
          <SplineBackground />
        </div>
        
        {/* Main content with scroll handling */}
        <ScrollHandler
          isAnimating={isAnimating}
          currentRowIndex={currentRowIndex}
          onScroll={handleScroll}
        >
          <div 
          id='tiles-container' 
          className="absolute inset-x-0 z-40 flex flex-col items-center px-4"
          style={{
            top: '72px',
            width: '100%',
            height: 'calc(100vh - 72px - 250px)',
            perspective: '1000px',
            ...gpuStyles
          }}
        >
            <AnimatedContent
              currentRowIndex={currentRowIndex}
              direction={direction}
              rowVariants={rowVariants}
              gpuStyles={gpuStyles}
              onExitComplete={handleExitComplete}
              >
                {rows[currentRowIndex]}
            </AnimatedContent>
          </div>
        </ScrollHandler>
        
        {/* Chat input */}
        <div className="fixed-chat flex justify-center">
          <ChatInput />
        </div>
        
        {/* Footer */}
        <div className="fixed-footer">
          <Footer />
        </div>
      </div>
    )
  )
}

export default HomePage