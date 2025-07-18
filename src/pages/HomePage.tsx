import ChatInput from '../components/ChatInput'
import Spline from '@splinetool/react-spline'
import Tile from '../components/Tile'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import './HomePage.css'
import Footer from '../components/Footer'

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0)
  const lastScrollTime = useRef(Date.now())
  const scrollThreshold = 50
  const scrollCooldown = 800

  // Animation variants for rows
  const rowVariants: Variants = {
    // Current row fading out
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(0px)',
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    // New row entering
    enter: (direction: number) => ({
      y: direction > 0 ? '100vh' : '-100vh',
      opacity: 1,
      scale: 1.02,
      filter: 'blur(0px)'
    }),
    // Row in view
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        y: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.8,
          bounce: 0.2,
          duration: 0.8
        },
        opacity: {
          duration: 0.2
        },
        scale: {
          duration: 0.2
        }
      }
    }
  }

  // GPU optimization styles
  const gpuStyles = {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased',
    WebkitBackfaceVisibility: 'hidden' as const,
    WebkitTransform: 'translateZ(0) scale3d(1, 1, 1)',
    transform: 'translateZ(0) scale3d(1, 1, 1)',
    WebkitPerspective: 1000,
    isolation: 'isolate' as const
  }

  // GPU optimization styles with vertical centering
  const combinedGpuStyles = {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased',
    WebkitBackfaceVisibility: 'hidden' as const,
    WebkitTransform: 'translateZ(0) scale3d(1, 1, 1) translateY(-50%)',
    transform: 'translateZ(0) scale3d(1, 1, 1) translateY(-50%)',
    WebkitPerspective: 1000,
    isolation: 'isolate' as const
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    
    const scrollDelta = event.deltaY
    if (Math.abs(scrollDelta) < scrollThreshold) return

    const isScrollingDown = scrollDelta > 0

    // Handle scroll logic based on current row and direction
    if (currentRowIndex === 0) {
      // At first row, only allow scrolling down
      if (isScrollingDown) {
        setDirection(1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(1)
      }
    } 
    else if (currentRowIndex === 1) {
      // At second row, allow both directions
      if (isScrollingDown) {
        setDirection(1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(2)
      } else {
        setDirection(-1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(0)
      }
    }
    else if (currentRowIndex === 2) {
      // At last row, only allow scrolling up
      if (!isScrollingDown) {
        setDirection(-1)
        setIsAnimating(true)
        lastScrollTime.current = now
        setCurrentRowIndex(1)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [currentRowIndex, isAnimating])

  // Row content data
  const rows = [
    // First row
    <motion.div className="flex gap-8 justify-center items-center h-[calc(100vh-72px-250px)]" key="row1" style={gpuStyles}>
      <div className="flex gap-8">
        <div className="translate-y-[-150px]">
          <Tile
            title="AI SHARING"
            iconPath="/images/logo1.png"
            imagePath="/images/tile1.png"
            top="0px"
            right='0px'
          />
        </div>
        <div className="translate-y-[-70px]">
          <Tile
            title="AIVAR STORE"
            iconPath="/images/logo2.png"
            imagePath="/images/tile2.png"
            top="0px"
            right='0px'
          />
        </div>
      </div>
    </motion.div>,
    // Second row
    <motion.div className="flex gap-8 justify-center items-center h-[calc(100vh-72px-250px)]" key="row2" style={gpuStyles}>
      <div className="flex gap-8">
        <div className="translate-y-[-150px]">
          <Tile
            title="AIVAR METALAND"
            iconPath="/images/logo3.png"
            imagePath="/images/tile3.png"
            top="0px"
            right='0px'
          />
        </div>
        <div className="translate-y-[-70px]">
          <Tile
            title="CFX QUANTUM"
            iconPath="/images/logo4.png"
            imagePath="/images/tile4.png"
            top="0px"
            right='0px'
          />
        </div>
      </div>
    </motion.div>,
    // Last row - single tile centered
    <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row3" style={gpuStyles}>
      <div className="translate-y-[-80px]">
        <Tile
          title="VAFFA GAME"
          iconPath="/images/logo5.png"
          imagePath="/images/tile5.png"
          top="0px"
          right='0px'
        />
      </div>
    </motion.div>
  ]

  return (
    <div className="w-full h-screen overflow-hidden" style={gpuStyles}>
      <div className="content-container" style={gpuStyles}>
        {/* Spline positioned below tiles */}
        <Spline 
          className='pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px] z-30' 
          scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"
        />
        
        {/* Tiles container */}
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
          {/* Animation container */}
          <div className="relative w-full h-full flex items-center justify-center" style={gpuStyles}>
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={direction}
              onExitComplete={() => setIsAnimating(false)}
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
      </div>

      {/* Fixed ChatInput */}
      <div className="fixed-chat flex justify-center">
        <ChatInput />
      </div>

      {/* Fixed Footer */}
      <div className="fixed-footer">
        <Footer />
      </div>
    </div>
  )
}

export default HomePage