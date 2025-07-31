import { motion } from 'framer-motion'
import Tile from '../components/Tile'

export const getTileRows = (isMobile: boolean, gpuStyles: React.CSSProperties) => {
  const mobileRows = [
    <motion.div className="flex justify-center items-center h-[calc(100vh-72px-250px)]" key="row0m" style={gpuStyles}>
      <div className="p-5" style={{ marginTop: '-10%', textAlign: 'center' }}>
        <span style={{ color: '#FFF', fontFamily: 'Figtree, sans-serif', fontSize: '32px', fontStyle: 'normal', fontWeight: 700, lineHeight: 'normal' }}>AI Sharing Community</span>
      </div>
    </motion.div>,
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
    </motion.div>
  ]

  const desktopRows = [
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
    </motion.div>
  ]

  return isMobile ? mobileRows : desktopRows
} 