import { lazy, Suspense, useMemo } from 'react'
import ErrorBoundary from './ErrorBoundary'

// Lazy load the heavy Spline component
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineBackgroundProps {
  className?: string
  opacity?: number
  zIndex?: number
}

const SplineBackground: React.FC<SplineBackgroundProps> = ({
  className = 'pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px]',
  opacity = 1,
  zIndex = 30
}) => {
  // Load Spline on both desktop and mobile
  const shouldLoadSpline = useMemo(() => {
    return true
  }, [])

  const splineStyles = useMemo(() => ({
    opacity,
    zIndex
  }), [opacity, zIndex])

  if (!shouldLoadSpline) {
    return null
  }

  return (
    <Suspense fallback={<div className="w-full h-full bg-black" />}>
      <ErrorBoundary fallback={<div className="w-full h-full bg-black" />}>
        <Spline 
          className={className}
          style={splineStyles}
          scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"
        />
      </ErrorBoundary>
    </Suspense>
  )
}

export default SplineBackground 