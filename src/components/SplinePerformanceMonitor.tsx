import { useEffect, useRef, useState } from 'react'
import './SplinePerformanceMonitor.css'

interface SplinePerformanceMonitorProps {
  children: React.ReactNode
  onPerformanceIssue?: (issue: string) => void
}

const SplinePerformanceMonitor: React.FC<SplinePerformanceMonitorProps> = ({ 
  children, 
  onPerformanceIssue 
}) => {
  const [performanceScore, setPerformanceScore] = useState<number>(100)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isMonitoring) return

    const measurePerformance = () => {
      frameCountRef.current++
      const currentTime = performance.now()
      
      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current))
        const newScore = Math.min(100, Math.max(0, fps * 2)) // Convert FPS to 0-100 score
        
        setPerformanceScore(newScore)
        
        // Report performance issues
        if (fps < 30 && onPerformanceIssue) {
          onPerformanceIssue(`Low FPS detected: ${fps}`)
        }
        
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }
      
      requestAnimationFrame(measurePerformance)
    }

    requestAnimationFrame(measurePerformance)

    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current)
      }
    }
  }, [isMonitoring, onPerformanceIssue])

  useEffect(() => {
    // Start monitoring after a short delay
    const timer = setTimeout(() => setIsMonitoring(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Show performance warning if score is low
  if (performanceScore < 50 && isMonitoring) {
    return (
      <div className="performance-warning">
        <div className="performance-warning-title">Performance Warning</div>
        <div className="performance-warning-message">3D animation may be slow on this device</div>
      </div>
    )
  }

  return <>{children}</>
}

export default SplinePerformanceMonitor 