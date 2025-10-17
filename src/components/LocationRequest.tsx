import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coordinates } from '../types/restaurant'
import { useLocation } from '../hooks/useLocation'

interface LocationRequestProps {
  onLocationGranted: (coords: Coordinates) => void
}

/**
 * 位置請求組件
 *
 * 顯示位置請求介面，引導使用者允許位置存取
 */
export const LocationRequest = ({ onLocationGranted }: LocationRequestProps) => {
  const { coordinates, isLoading, error, refetch } = useLocation(false)
  const [hasRequested, setHasRequested] = useState(false)

  // 當成功取得位置時，通知父組件（使用 useEffect 避免在渲染期間調用 setState）
  useEffect(() => {
    if (coordinates && !error) {
      onLocationGranted(coordinates)
    }
  }, [coordinates, error, onLocationGranted])

  const handleRequest = () => {
    setHasRequested(true)
    refetch()
  }

  return (
    <motion.div
      className="location-request"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {!hasRequested && !coordinates && (
        <motion.div
          className="request-prompt"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="icon"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            📍
          </motion.div>
          <h2>需要您的位置</h2>
          <p>為了幫您找到附近的餐廳，我們需要取得您的位置資訊</p>
          <motion.button
            onClick={handleRequest}
            className="request-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            允許位置存取
          </motion.button>
          <p className="privacy-note">
            我們不會儲存您的位置資訊，僅用於搜尋附近餐廳
          </p>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          className="loading-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner"></div>
          <p>正在取得您的位置...</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="error-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="icon">⚠️</div>
          <h3>無法取得位置</h3>
          <p className="error-message">{error.message}</p>
          <motion.button
            onClick={handleRequest}
            className="retry-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            重試
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
