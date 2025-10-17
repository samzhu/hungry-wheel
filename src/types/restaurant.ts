/**
 * 餐廳資料類型定義
 */
export interface Restaurant {
  id: string
  name: string
  address: string
  rating?: number
  userRatingsTotal?: number
  photos?: string[]
  location: {
    lat: number
    lng: number
  }
  types?: string[]
  openingHours?: {
    openNow?: boolean
    weekdayText?: string[]
  }
  priceLevel?: number
  distance?: number
}

/**
 * 地理位置座標
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Google Places API 搜尋參數
 */
export interface PlacesSearchParams {
  location: Coordinates
  radius: number
  type: string
}

/**
 * 抽籤結果
 */
export interface DrawResult {
  restaurant: Restaurant
  timestamp: number
}
