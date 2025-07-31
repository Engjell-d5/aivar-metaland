import { useRef, useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

interface ScrollHandlerProps {
  isAnimating: boolean
  currentRowIndex: number
  onScroll: (direction: number, newIndex: number) => void
  children: React.ReactNode
}

const ScrollHandler: React.FC<ScrollHandlerProps> = ({
  isAnimating,
  currentRowIndex,
  onScroll,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastScrollTime = useRef(Date.now())
  const scrollThreshold = 50
  const scrollCooldown = 800
  const isMobile = useMediaQuery({ maxWidth: 639 })

  // Touch event handlers for mobile
  const touchStartY = useRef<number | null>(null)
  const touchEndY = useRef<number | null>(null)

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault()
    
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    
    const scrollDelta = event.deltaY
    if (Math.abs(scrollDelta) < scrollThreshold) return

    const isScrollingDown = scrollDelta > 0

    // Handle scroll logic - 7 rows for mobile, 5 rows for desktop
    const maxRowIndex = isMobile ? 6 : 4
    
    if (isScrollingDown) {
      if (currentRowIndex < maxRowIndex) {
        onScroll(1, currentRowIndex + 1)
        lastScrollTime.current = now
      }
    } else {
      if (currentRowIndex > 0) {
        onScroll(-1, currentRowIndex - 1)
        lastScrollTime.current = now
      }
    }
  }, [isAnimating, currentRowIndex, scrollCooldown, scrollThreshold, isMobile, onScroll])

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Only prevent default if we have a valid touch start position
    // This means the user started touching within the tiles container
    if (touchStartY.current !== null) {
      event.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStartY.current) return
    
    touchEndY.current = event.changedTouches[0].clientY
    const touchDiff = touchStartY.current - touchEndY.current
    
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    
    if (Math.abs(touchDiff) < scrollThreshold) return

    const isScrollingDown = touchDiff > 0

    // Handle scroll logic - 7 rows for mobile, 5 rows for desktop
    const maxRowIndex = isMobile ? 6 : 4
    
    if (isScrollingDown) {
      if (currentRowIndex < maxRowIndex) {
        onScroll(1, currentRowIndex + 1)
        lastScrollTime.current = now
      }
    } else {
      if (currentRowIndex > 0) {
        onScroll(-1, currentRowIndex - 1)
        lastScrollTime.current = now
      }
    }
    
    // Reset touch state
    touchStartY.current = null
    touchEndY.current = null
  }, [isAnimating, currentRowIndex, scrollCooldown, scrollThreshold, isMobile, onScroll])

  const handleTouchCancel = useCallback(() => {
    // Reset touch state if touch is cancelled
    touchStartY.current = null
    touchEndY.current = null
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    
    // Add touch event listeners for mobile
    if (isMobile) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false })
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd, { passive: false })
      container.addEventListener('touchcancel', handleTouchCancel, { passive: false })
    }
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (isMobile) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
        container.removeEventListener('touchcancel', handleTouchCancel)
      }
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, isMobile])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

export default ScrollHandler 