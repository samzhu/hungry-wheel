import { useState, useEffect, useCallback } from 'react'
import { Coordinates, Restaurant } from '../types/restaurant'
import {
  searchNearbyRestaurants,
  PlacesAPIError,
  initGoogleMapsAPI,
} from '../services/places-api'

/**
 * 餐廳搜尋狀態
 */
export interface RestaurantsState {
  restaurants: Restaurant[]
  isLoading: boolean
  error: PlacesAPIError | Error | null
}

/**
 * useRestaurants Hook
 *
 * 搜尋附近餐廳
 *
 * @param location 使用者位置座標
 * @param radius 搜尋半徑（公尺，預設 1500）
 * @param autoFetch 是否自動搜尋（預設 true）
 *
 * @example
 * ```tsx
 * const { restaurants, isLoading, error, refetch } = useRestaurants(userLocation, 2000)
 *
 * if (isLoading) return <div>搜尋中...</div>
 * if (error) return <div>錯誤：{error.message}</div>
 * return <RestaurantList restaurants={restaurants} />
 * ```
 */
export const useRestaurants = (
  location: Coordinates | null,
  radius: number = 1500,
  autoFetch: boolean = true
) => {
  const [state, setState] = useState<RestaurantsState>({
    restaurants: [],
    isLoading: false,
    error: null,
  })

  /**
   * 搜尋餐廳
   */
  const fetchRestaurants = useCallback(async () => {
    if (!location) {
      setState({
        restaurants: [],
        isLoading: false,
        error: new Error('需要提供位置座標'),
      })
      return
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      // 初始化 Google Maps API
      await initGoogleMapsAPI()

      // 搜尋附近餐廳
      const results = await searchNearbyRestaurants(location, radius)

      setState({
        restaurants: results,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const error =
        err instanceof PlacesAPIError || err instanceof Error
          ? err
          : new Error('搜尋餐廳時發生錯誤')

      setState({
        restaurants: [],
        isLoading: false,
        error,
      })
    }
  }, [location, radius])

  /**
   * 當位置變化時自動搜尋
   */
  useEffect(() => {
    if (autoFetch && location) {
      fetchRestaurants()
    }
  }, [autoFetch, location, fetchRestaurants])

  return {
    restaurants: state.restaurants,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchRestaurants,
  }
}
