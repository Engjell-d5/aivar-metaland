import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface AnimatedContentProps {
  currentRowIndex: number
  direction: number
  rowVariants: Variants
  gpuStyles: React.CSSProperties
  onExitComplete: () => void
  children: React.ReactNode
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  currentRowIndex,
  direction,
  rowVariants,
  gpuStyles,
  onExitComplete,
  children
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center z-10" style={gpuStyles}>
      <AnimatePresence
        initial={true}
        mode="wait"
        custom={direction}
        onExitComplete={onExitComplete}
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
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AnimatedContent 