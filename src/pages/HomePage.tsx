import ChatInput from '../components/ChatInput'
import Spline from '@splinetool/react-spline'
import Tile from '../components/Tile'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { CgProfile } from 'react-icons/cg'
import { useRef, useState, useEffect } from 'react'
import './HomePage.css'
import Footer from '../components/Footer'
import { useMediaQuery } from 'react-responsive';

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLDivElement>(null)
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0)
  const lastScrollTime = useRef(Date.now())
  const scrollThreshold = 50
  const scrollCooldown = 800
  const [containerHeight, setContainerHeight] = useState<string | undefined>(undefined)
  const isMobile = useMediaQuery({ maxWidth: 639 });

  // Animation variants for rows
  const rowVariants: Variants = {
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      transition: { type: 'tween', ease: [0.1, 0.69, 0.88, 0.77], duration: 0.2 }
    }),
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 18,
        mass: 0.7,
      }
    }
  }

  // GPU optimization styles
  const gpuStyles = {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased',
    WebkitBackfaceVisibility: 'hidden' as const,
    WebkitTransform: 'translateZ(0)',
    transform: 'translateZ(0)',
    WebkitPerspective: 1000,
    isolation: 'isolate' as const,
    transformStyle: 'preserve-3d' as const
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    
    const scrollDelta = event.deltaY
    if (Math.abs(scrollDelta) < scrollThreshold) return

    const isScrollingDown = scrollDelta > 0

    // Handle scroll logic for 5 rows
    if (isScrollingDown) {
      if (currentRowIndex < 4) {
        setDirection(1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(currentRowIndex + 1)
      }
    } else {
      if (currentRowIndex > 0) {
        setDirection(-1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(currentRowIndex - 1)
      }
    }
  }

  // Touch event handlers for mobile
  const touchStartY = useRef<number | null>(null)
  const touchEndY = useRef<number | null>(null)

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY
  }

  const handleTouchMove = (event: TouchEvent) => {
    // Only prevent default if we have a valid touch start position
    // This means the user started touching within the tiles container
    if (touchStartY.current !== null) {
      event.preventDefault()
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (!touchStartY.current) return
    
    touchEndY.current = event.changedTouches[0].clientY
    const touchDiff = touchStartY.current - touchEndY.current
    
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    
    if (Math.abs(touchDiff) < scrollThreshold) return

    const isScrollingDown = touchDiff > 0

    // Handle scroll logic for 5 rows
    if (isScrollingDown) {
      if (currentRowIndex < 4) {
        setDirection(1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(currentRowIndex + 1)
      }
    } else {
      if (currentRowIndex > 0) {
        setDirection(-1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(currentRowIndex - 1)
      }
    }
    
    // Reset touch state
    touchStartY.current = null
    touchEndY.current = null
  }

  const handleTouchCancel = () => {
    // Reset touch state if touch is cancelled
    touchStartY.current = null
    touchEndY.current = null
  }

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
  }, [currentRowIndex, isAnimating, isMobile])

  useEffect(() => {
    if (!isMobile) return
    function updateHeight() {
      const header = headerRef.current
      const chat = chatInputRef.current
      const windowHeight = window.innerHeight
      const headerHeight = header ? header.offsetHeight : 56
      const chatHeight = chat ? chat.offsetHeight : 80
      const available = windowHeight - headerHeight - chatHeight
      setContainerHeight(available > 0 ? `${available}px` : undefined)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isMobile])

  const handleSignUp = () => {
    // Placeholder for sign-up logic
    console.log('Sign Up button clicked')
  }
  // Row content data
  const rows = isMobile
    ? [
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row1m" style={gpuStyles}>
          <div className="p-5">
            <Tile title="AI SHARING" iconPath="/images/logo1.png" imagePath="/images/tile1.png" />
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row2m" style={gpuStyles}>
          <div className="p-5">
            <Tile title="AIVAR STORE" iconPath="/images/logo2.png" imagePath="/images/tile2.png" />
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row3m" style={gpuStyles}>
          <div className="p-5">
            <Tile title="AIVAR METALAND" iconPath="/images/logo3.png" imagePath="/images/tile3.png" />
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row4m" style={gpuStyles}>
          <div className="p-5">
            <Tile title="CFX QUANTUM" iconPath="/images/logo4.png" imagePath="/images/tile4.png" />
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row5m" style={gpuStyles}>
          <div className="p-5">
            <Tile title="VAFFA GAME" iconPath="/images/logo5.png" imagePath="/images/tile5.png" />
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row6m" style={gpuStyles}>
          <div className="p-5" style={{ marginTop: '-10%', textAlign: 'center' }}>
            <span style={{ color: '#FFF', fontFamily: 'Figtree', fontSize: '40px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal' }}>
              <b>Entra nella community</b> che sta ridefinendo <br /> il <b>futuro dell'AI</b>: condividi conoscenze, <br />
              costruisci connessioni, <b>trasforma le tue</b> <br /> <b>idee in realtà.</b>
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '32px' }}>
              <button
                onClick={handleSignUp}
                style={{ background: '#fff', color: '#2563eb', fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: '1.25rem', borderRadius: '9999px', padding: '12px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none', transition: 'box-shadow 0.2s' }}
              >
                Registrati
                <CgProfile color="#004FF8" size={22} className="login-button-icon" />
              </button>
            </div>
          </div>
        </motion.div>
      ]
    : [
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row4" style={gpuStyles}>
          <div className="p-5" style={{ marginTop: '-10%' }}>
            <span style={{ color: '#FFF', fontFamily: 'Figtree, sans-serif', fontSize: '64px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal' }}>AI Sharing Community</span>
          </div>
        </motion.div>,
        <motion.div className="flex gap-8 justify-center items-center h-[calc(100vh-72px-250px)]" key="row1" style={gpuStyles}>
          <div className="flex gap-8">
            <div className="p-5 translate-y-[calc((((100vh_-_72px_-_250px)_-_300px)_*_-0.25))]">
              <Tile title="AI SHARING" iconPath="/images/logo1.png" imagePath="/images/tile1.png" />
            </div>
            <div className="p-5 pb-8 translate-y-[calc((((100vh_-_72px_-_250px)_-_300px)_*_0.01))]">
              <Tile title="AIVAR STORE" iconPath="/images/logo2.png" imagePath="/images/tile2.png" />
            </div>
          </div>
        </motion.div>,
        <motion.div className="flex gap-8 justify-center items-center h-[calc(100vh-72px-250px)]" key="row2" style={gpuStyles}>
          <div className="flex gap-8">
            <div className="p-5 translate-y-[calc((((100vh_-_72px_-_250px)_-_300px)_*_-0.25))]">
              <Tile title="AIVAR METALAND" iconPath="/images/logo3.png" imagePath="/images/tile3.png" />
            </div>
            <div className="p-5 pb-8 translate-y-[calc((((100vh_-_72px_-_250px)_-_300px)_*_0.01))]">
              <Tile title="CFX QUANTUM" iconPath="/images/logo4.png" imagePath="/images/tile4.png" />
            </div>
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row3" style={gpuStyles}>
          <div>
            <div className="p-5 translate-y-[calc((((100vh_-_72px_-_250px)_-_300px)_*_-0.2))]">
              <Tile title="VAFFA GAME" iconPath="/images/logo5.png" imagePath="/images/tile5.png" />
            </div>
          </div>
        </motion.div>,
        <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row5" style={gpuStyles}>
          <div className="p-5" style={{ marginTop: '-10%', textAlign: 'center' }}>
            <span style={{ color: '#FFF', fontFamily: 'Figtree', fontSize: '40px', fontStyle: 'normal', fontWeight: 400, lineHeight: 'normal' }}>
              <b>Entra nella community</b> che sta ridefinendo <br /> il <b>futuro dell'AI</b>: condividi conoscenze, <br />
              costruisci connessioni, <b>trasforma le tue</b> <br /> <b>idee in realtà.</b>
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '32px' }}>
              <button
                onClick={handleSignUp}
                style={{ background: '#fff', color: '#2563eb', fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: '1.25rem', borderRadius: '9999px', padding: '12px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none', transition: 'box-shadow 0.2s' }}
              >
                Registrati
                <CgProfile color="#004FF8" size={22} className="login-button-icon" />
              </button>
            </div>
          </div>
        </motion.div>
      ];

  return (
    isMobile ? (
      <div className="w-full min-h-screen flex flex-col bg-black">
        {/* Header */}
        <div ref={headerRef} className="content-container" style={gpuStyles}>
          <Spline 
            className='pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px] z-30' 
            scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"
          />
        </div>
        {/* Main content (tile) */}
        <div 
          ref={containerRef}
          className="flex-1 flex flex-col items-center justify-center px-4" 
          id="tiles-container"
        >
          <div className="relative w-full h-full flex items-center justify-center" style={gpuStyles}>
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={direction}
              onExitComplete={() => {
                setIsAnimating(false)
              }}
            >
              <motion.div
                key={currentRowIndex}
                custom={direction}
                variants={rowVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full flex items-center justify-center"
                style={gpuStyles}
              >
                {rows[currentRowIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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
        <div ref={headerRef} className="content-container" style={gpuStyles}>
          <Spline 
            className='pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px] z-30' 
            scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"
          />
        </div>
        <div 
          ref={containerRef}
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
          <div className="relative w-full h-full flex items-center justify-center" style={gpuStyles}>
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={direction}
              onExitComplete={() => {
                setIsAnimating(false)
              }}
            >
              <motion.div
                key={currentRowIndex}
                custom={direction}
                variants={rowVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full flex items-center justify-center"
                style={gpuStyles}
              >
                {rows[currentRowIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div ref={chatInputRef} className="fixed-chat flex justify-center">
          <ChatInput />
        </div>
        <div className="fixed-footer">
          <Footer />
        </div>
      </div>
    )
  )
}

export default HomePage