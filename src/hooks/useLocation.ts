import { useState, useEffect, useCallback } from 'react'
import { Coordinates } from '../types/restaurant'
import {
  getCurrentPosition,
  GeolocationError,
  GeolocationErrorType,
} from '../services/geolocation'

/**
 * 位置狀態
 */
export interface LocationState {
  coordinates: Coordinates | null
  isLoading: boolean
  error: GeolocationError | null
}

/**
 * useLocation Hook
 *
 * 提供地理定位功能，自動取得使用者位置
 *
 * @param autoFetch 是否自動取得位置（預設：false）
 * @returns 位置狀態和刷新函數
 *
 * @example
 * ```tsx
 * const { coordinates, isLoading, error, refetch } = useLocation(true)
 *
 * if (isLoading) return <div>取得位置中...</div>
 * if (error) return <div>錯誤：{error.message}</div>
 * if (coordinates) return <div>緯度：{coordinates.latitude}, 經度：{coordinates.longitude}</div>
 * ```
 */
export const useLocation = (autoFetch: boolean = false) => {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
  })

  /**
   * 取得位置
   */
  const fetchLocation = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }))

    try {
      const coords = await getCurrentPosition()
      setState({
        coordinates: coords,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const error =
        err instanceof GeolocationError
          ? err
          : new GeolocationError(
              GeolocationErrorType.POSITION_UNAVAILABLE,
              '取得位置時發生錯誤'
            )

      setState({
        coordinates: null,
        isLoading: false,
        error,
      })
    }
  }, [])

  /**
   * 初始化時自動取得位置
   */
  useEffect(() => {
    if (autoFetch) {
      fetchLocation()
    }
  }, [autoFetch, fetchLocation])

  return {
    coordinates: state.coordinates,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchLocation,
  }
}
