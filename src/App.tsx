import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import { LocationRequest } from './components/LocationRequest'
import './components/LocationRequest.css'
import { RestaurantCard } from './components/RestaurantCard'
import './components/RestaurantCard.css'
import { LotteryWheel } from './components/LotteryWheel'
import './components/LotteryWheel.css'
import { Coordinates, Restaurant } from './types/restaurant'
import { useRestaurants } from './hooks/useRestaurants'

function App() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [drawnRestaurant, setDrawnRestaurant] = useState<Restaurant | null>(null)
  const { restaurants, isLoading, error } = useRestaurants(userLocation, 1500, true)

  const handleLocationGranted = (coords: Coordinates) => {
    setUserLocation(coords)
  }

  const handleDraw = (restaurant: Restaurant) => {
    setDrawnRestaurant(restaurant)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎡 Hungry Wheel</h1>
        <p>今天吃什麼？讓我們來抽籤決定吧！</p>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {!userLocation ? (
            <LocationRequest onLocationGranted={handleLocationGranted} />
          ) : (
            <motion.div
              key="restaurants-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
            {isLoading && (
              <div className="loading-restaurants">
                <div className="spinner"></div>
                <p>正在搜尋附近餐廳...</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">無法載入餐廳資料</h3>
                <p className="error-text">{error.message}</p>
                {import.meta.env.DEV && (
                  <div className="error-dev-hint">
                    <p>開發提示：</p>
                    <ul>
                      <li>確認已建立 .env 文件</li>
                      <li>設定 VITE_GOOGLE_MAPS_API_KEY</li>
                      <li>重新啟動開發伺服器</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !error && restaurants.length > 0 && (
              <>
                {drawnRestaurant ? (
                  <div className="result-container">
                    <h2 className="result-title">🎉 今天就吃這家！</h2>
                    <div className="result-card">
                      <RestaurantCard restaurant={drawnRestaurant} />
                    </div>
                    <button
                      className="retry-draw-button"
                      onClick={() => setDrawnRestaurant(null)}
                    >
                      重新抽籤
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="status-container">
                      <p className="status">
                        找到 {restaurants.length} 家餐廳
                      </p>
                    </div>

                    {/* 3D 抽籤輪盤 */}
                    <LotteryWheel
                      restaurants={restaurants}
                      onDraw={handleDraw}
                    />

                    {/* 餐廳列表預覽 */}
                    <div className="restaurants-preview">
                      <h3>附近餐廳列表</h3>
                      <div className="restaurants-grid">
                        {restaurants.map((restaurant, idx) => (
                          <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            index={idx}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {!isLoading && !error && restaurants.length === 0 && (
              <div className="no-results">
                <p>😕 附近沒有找到餐廳</p>
                <p>請嘗試調整搜尋範圍</p>
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <p>v1.0.0 | Powered by React 19 + Three.js</p>
      </footer>
    </div>
  )
}

export default App
