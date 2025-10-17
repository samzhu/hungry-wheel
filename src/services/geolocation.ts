import { Coordinates } from '../types/restaurant'

/**
 * 地理定位錯誤類型
 */
export enum GeolocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

/**
 * 地理定位錯誤
 */
export class GeolocationError extends Error {
  constructor(
    public type: GeolocationErrorType,
    message: string
  ) {
    super(message)
    this.name = 'GeolocationError'
  }
}

/**
 * 地理定位選項
 */
export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

/**
 * 預設地理定位選項
 */
const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 秒
  maximumAge: 0, // 不使用快取
}

/**
 * 取得使用者當前位置
 */
export const getCurrentPosition = (
  options: GeolocationOptions = DEFAULT_OPTIONS
): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    // 檢查瀏覽器是否支援 Geolocation API
    if (!navigator.geolocation) {
      reject(
        new GeolocationError(
          GeolocationErrorType.NOT_SUPPORTED,
          '您的瀏覽器不支援地理定位功能'
        )
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        let errorType: GeolocationErrorType
        let errorMessage: string

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorType = GeolocationErrorType.PERMISSION_DENIED
            errorMessage = '您拒絕了位置存取權限，請在瀏覽器設定中允許存取位置'
            break
          case error.POSITION_UNAVAILABLE:
            errorType = GeolocationErrorType.POSITION_UNAVAILABLE
            errorMessage = '無法取得位置資訊，請檢查您的網路連線或 GPS 設定'
            break
          case error.TIMEOUT:
            errorType = GeolocationErrorType.TIMEOUT
            errorMessage = '取得位置資訊逾時，請稍後再試'
            break
          default:
            errorType = GeolocationErrorType.POSITION_UNAVAILABLE
            errorMessage = '取得位置資訊時發生未知錯誤'
        }

        reject(new GeolocationError(errorType, errorMessage))
      },
      options
    )
  })
}

/**
 * 監聽位置變化（持續追蹤）
 */
export const watchPosition = (
  onSuccess: (coords: Coordinates) => void,
  onError: (error: GeolocationError) => void,
  options: GeolocationOptions = DEFAULT_OPTIONS
): number => {
  if (!navigator.geolocation) {
    onError(
      new GeolocationError(
        GeolocationErrorType.NOT_SUPPORTED,
        '您的瀏覽器不支援地理定位功能'
      )
    )
    return -1
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    (error) => {
      let errorType: GeolocationErrorType
      let errorMessage: string

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorType = GeolocationErrorType.PERMISSION_DENIED
          errorMessage = '位置存取權限被拒絕'
          break
        case error.POSITION_UNAVAILABLE:
          errorType = GeolocationErrorType.POSITION_UNAVAILABLE
          errorMessage = '無法取得位置資訊'
          break
        case error.TIMEOUT:
          errorType = GeolocationErrorType.TIMEOUT
          errorMessage = '取得位置資訊逾時'
          break
        default:
          errorType = GeolocationErrorType.POSITION_UNAVAILABLE
          errorMessage = '發生未知錯誤'
      }

      onError(new GeolocationError(errorType, errorMessage))
    },
    options
  )
}

/**
 * 停止監聽位置變化
 */
export const clearWatch = (watchId: number): void => {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

/**
 * 計算兩個座標之間的距離（使用 Haversine 公式）
 * @returns 距離（公尺）
 */
export const calculateDistance = (
  coords1: Coordinates,
  coords2: Coordinates
): number => {
  const R = 6371e3 // 地球半徑（公尺）
  const φ1 = (coords1.latitude * Math.PI) / 180
  const φ2 = (coords2.latitude * Math.PI) / 180
  const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180
  const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
