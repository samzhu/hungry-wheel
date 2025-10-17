import { motion } from 'framer-motion'
import { Restaurant } from '../types/restaurant'

interface RestaurantCardProps {
  restaurant: Restaurant
  index?: number
}

/**
 * 餐廳卡片組件
 */
export const RestaurantCard = ({ restaurant, index = 0 }: RestaurantCardProps) => {
  return (
    <motion.div
      className="restaurant-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {restaurant.photos && restaurant.photos.length > 0 && (
        <div className="restaurant-photo">
          <img src={restaurant.photos[0]} alt={restaurant.name} />
        </div>
      )}

      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-address">{restaurant.address}</p>

        <div className="restaurant-meta">
          {restaurant.rating && (
            <div className="rating">
              ⭐ {restaurant.rating.toFixed(1)}
              {restaurant.userRatingsTotal && (
                <span className="rating-count">
                  ({restaurant.userRatingsTotal})
                </span>
              )}
            </div>
          )}

          {restaurant.openingHours?.openNow !== undefined && (
            <div
              className={`opening-status ${restaurant.openingHours.openNow ? 'open' : 'closed'}`}
            >
              {restaurant.openingHours.openNow ? '營業中' : '已打烊'}
            </div>
          )}

          {restaurant.priceLevel && (
            <div className="price-level">
              {'$'.repeat(restaurant.priceLevel)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
