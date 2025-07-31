import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import ErrorBoundary from './ErrorBoundary'

// Lazy load Spline with error handling
const Spline = lazy(() => 
  import('@splinetool/react-spline')
    .then(module => ({ default: module.default }))
    .catch(error => {
      console.warn('Spline failed to load:', error)
      // Return a proper React component for the fallback
      return { 
        default: React.forwardRef<HTMLDivElement, any>((props, ref) => {
          return <div ref={ref} {...props} style={{ display: 'none' }} />
        })
      }
    })
)

interface SplineWrapperProps {
  scene: string
  className?: string
  onLoad?: () => void
  onError?: (error: any) => void
  fallback?: React.ReactNode
  performanceThreshold?: number // FPS threshold for performance warning
  enablePerformanceMonitoring?: boolean
}

const SplineWrapper: React.FC<SplineWrapperProps> = ({
  scene,
  className = '',
  onLoad,
  onError,
  fallback = <div className="w-full h-full bg-black animate-pulse" />,
  performanceThreshold = 30,
  enablePerformanceMonitoring = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [performanceWarning, setPerformanceWarning] = useState(false)
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const monitoringRef = useRef<number | null>(null)

  // Performance monitoring
  const startPerformanceMonitoring = useCallback(() => {
    if (!enablePerformanceMonitoring) return

    const monitorPerformance = () => {
      frameCountRef.current++
      const currentTime = performance.now()
      
      if (currentTime - lastTimeRef.current >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        setFps(currentFps)
        
        if (currentFps < performanceThreshold) {
          setPerformanceWarning(true)
          console.warn(`Spline performance warning: ${currentFps} FPS`)
        } else {
          setPerformanceWarning(false)
        }
        
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }
      
      monitoringRef.current = requestAnimationFrame(monitorPerformance)
    }

    // Start monitoring after a delay to let Spline stabilize
    setTimeout(() => {
      if (isLoaded) {
        monitorPerformance()
      }
    }, 2000)
  }, [isLoaded, enablePerformanceMonitoring, performanceThreshold])

  // Cleanup performance monitoring
  useEffect(() => {
    return () => {
      if (monitoringRef.current) {
        cancelAnimationFrame(monitoringRef.current)
      }
    }
  }, [])

  // Handle Spline load
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
    onLoad?.()
    startPerformanceMonitoring()
  }, [onLoad, startPerformanceMonitoring])

  // Handle Spline error
  const handleError = useCallback((error: any) => {
    console.error('Spline error:', error)
    setHasError(true)
    setIsLoaded(false)
    onError?.(error)
  }, [onError])

  // Performance warning component
  const PerformanceWarning = () => (
    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded text-sm z-50">
      Performance: {fps} FPS
    </div>
  )

  // Error fallback component
  const ErrorFallback = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-2xl mb-2">⚠️</div>
        <div className="text-sm">3D content unavailable</div>
        <div className="text-xs text-gray-400 mt-1">Please try refreshing the page</div>
      </div>
    </div>
  )

  // Loading fallback with progress indicator
  const LoadingFallback = () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <div className="text-sm">Loading 3D content...</div>
      </div>
    </div>
  )

  if (hasError) {
    return <ErrorFallback />
  }

  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Spline
            scene={scene}
            onLoad={handleLoad}
            onError={handleError}
            className={className}
          />
        </ErrorBoundary>
      </Suspense>
      
      {performanceWarning && <PerformanceWarning />}
    </div>
  )
}

export default SplineWrapper 