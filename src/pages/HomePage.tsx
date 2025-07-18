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
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    // New row entering
    enter: (direction: number) => ({
      y: direction > 0 ? '100vh' : '-100vh',
      opacity: 1,
      scale: 1.02
    }),
    // Row in view
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250, // Increased stiffness for less bounce
        damping: 20,    // Increased damping for less oscillation
        mass: 0.8,      // Reduced mass for lighter feel
        bounce: 0.25,   // Reduced bounce
        restDelta: 0.01,
        duration: 0.8   // Shorter duration
      }
    }
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
    <div className="flex gap-8 justify-center" key="row1">
      <Tile
        title="AI SHARING"
        iconPath="/images/logo1.png"
        imagePath="/images/tile1.png"
        top="0px"
        right='0px'
      />
      <Tile
        title="AIVAR STORE"
        iconPath="/images/logo2.png"
        imagePath="/images/tile2.png"
        top="0px"
        right='0px'
      />
    </div>,
    // Second row
    <div className="flex gap-8 justify-center" key="row2">
      <Tile
        title="AIVAR METALAND"
        iconPath="/images/logo3.png"
        imagePath="/images/tile3.png"
        top="0px"
        right='0px'
      />
      <Tile
        title="CFX QUANTUM"
        iconPath="/images/logo4.png"
        imagePath="/images/tile4.png"
        top="0px"
        right='0px'
      />
    </div>,
    // Last row
    <div className="flex justify-center w-full max-w-[600px] mx-auto" key="row3">
      <Tile
        title="VAFFA GAME"
        iconPath="/images/logo5.png"
        imagePath="/images/tile5.png"
        top="0px"
        right='0px'
      />
    </div>
  ]

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="content-container">
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
            top: '60px',
            width: '100%',
            height: 'calc(100vh - 328px)',
            perspective: '1000px'
          }}
        >
          {/* Animation container */}
          <div className="relative w-full h-full">
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
                className="absolute w-full"
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