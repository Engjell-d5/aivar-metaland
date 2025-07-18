import ChatInput from '../components/ChatInput'
import Spline from '@splinetool/react-spline'
import Tile from '../components/Tile'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import './HomePage.css'
import Footer from '../components/Footer'

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Calculate container height and row spacing
  const containerHeight = 'calc(100vh - 328px)'
  const rowSpacing = 'calc((100vh - 328px) * 2)' // 2x container height

  // Adjust scroll ranges for better visibility - one range per row
  const firstRowOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const firstRowY = useTransform(scrollYProgress, [0, 0.15], [100, 0])
  
  const secondRowOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1])
  const secondRowY = useTransform(scrollYProgress, [0.3, 0.45], [100, 0])
  
  const lastRowOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1])
  const lastRowY = useTransform(scrollYProgress, [0.6, 0.75], [100, 0])

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="content-container">
        {/* Spline positioned below tiles */}
        <Spline 
          className='pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px] z-30' 
          scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"
        />
        
        {/* Tiles positioned as in Figma - highest z-index */}
        <div 
          ref={containerRef}
          id='tiles-container' 
          className="absolute inset-x-0 z-40 flex flex-col items-center hide-scrollbar px-4" 
          style={{
            top: '60px',
            width: '100%',
            height: containerHeight,
            perspective: '1000px',
            overflow: 'auto',
            gap: rowSpacing
          }}
        >
          <div 
            className="relative w-full flex flex-col items-center"
            style={{ 
              height: 'calc(100vh * 6)', // Increased to accommodate larger spacing
              gap: rowSpacing
            }}
          >
            {/* First Row - Two Tiles */}
            <motion.div 
              className="flex gap-8 justify-center w-full"
              style={{ 
                opacity: firstRowOpacity,
                y: firstRowY,
                position: 'fixed',
                top: '60px',
                left: '0',
                right: '0'
              }}
              initial={{ opacity: 0, y: 100 }}
            >
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
            </motion.div>

            {/* Second Row - Two Tiles */}
            <motion.div 
              className="flex gap-8 justify-center w-full"
              style={{ 
                opacity: secondRowOpacity,
                y: secondRowY,
                position: 'fixed',
                top: `calc(60px + ${rowSpacing})`,
                left: '0',
                right: '0'
              }}
              initial={{ opacity: 0, y: 100 }}
            >
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
            </motion.div>

            {/* Last Row - Single Centered Tile */}
            <motion.div 
              className="flex justify-center w-full"
              style={{ 
                opacity: lastRowOpacity,
                y: lastRowY,
                position: 'fixed',
                top: `calc(60px + (${rowSpacing} * 2))`,
                left: '0',
                right: '0'
              }}
              initial={{ opacity: 0, y: 100 }}
            >
              <div className="flex justify-center w-full max-w-[600px] mx-auto">
                <Tile
                  title="VAFFA GAME"
                  iconPath="/images/logo5.png"
                  imagePath="/images/tile5.png"
                  top="0px"
                  right='0px'
                />
              </div>
            </motion.div>
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