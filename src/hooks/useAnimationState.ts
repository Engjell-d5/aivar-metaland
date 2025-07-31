import { useState, useCallback, useMemo } from 'react'
import type { Variants } from 'framer-motion'

export const useAnimationState = () => {
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0)

  // Memoize animation variants to prevent recreation on every render
  const rowVariants: Variants = useMemo(() => ({
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
  }), [])

  // Memoize GPU optimization styles
  const gpuStyles = useMemo(() => ({
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitFontSmoothing: 'antialiased',
    WebkitBackfaceVisibility: 'hidden' as const,
    WebkitTransform: 'translateZ(0)',
    transform: 'translateZ(0)',
    WebkitPerspective: 1000,
    isolation: 'isolate' as const,
    transformStyle: 'preserve-3d' as const
  }), [])

  const handleScroll = useCallback((newDirection: number, newIndex: number) => {
    setDirection(newDirection)
    setIsAnimating(true)
    setCurrentRowIndex(newIndex)
  }, [])

  const handleExitComplete = useCallback(() => {
    setIsAnimating(false)
  }, [])

  return {
    currentRowIndex,
    isAnimating,
    direction,
    rowVariants,
    gpuStyles,
    handleScroll,
    handleExitComplete
  }
} 