import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Coordinates, Restaurant } from '../types/restaurant'

/**
 * API 初始化狀態
 */
let isInitialized = false

/**
 * Places Service 實例
 */
let placesService: google.maps.places.PlacesService | null = null

/**
 * 初始化 Google Maps API
 */
export const initGoogleMapsAPI = async (): Promise<void> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    const isDevelopment = import.meta.env.DEV
    const errorMessage = isDevelopment
      ? 'Google Maps API 金鑰未設定。請在 .env 文件中設定 VITE_GOOGLE_MAPS_API_KEY'
      : 'Google Maps API 金鑰未設定。請聯繫網站管理員。'

    throw new Error(errorMessage)
  }

  if (isInitialized) {
    return // 已經初始化
  }

  try {
    // 設定 API 選項
    setOptions({
      key: apiKey,
      v: 'weekly',
      libraries: ['places'],
    })

    // 載入 Places Library
    await importLibrary('places')

    isInitialized = true

    // 創建一個隱藏的 div 來初始化 PlacesService
    const div = document.createElement('div')
    placesService = new google.maps.places.PlacesService(div)
  } catch (error) {
    isInitialized = false
    throw new PlacesAPIError(
      'INIT_FAILED',
      `Google Maps API 載入失敗：${error instanceof Error ? error.message : '未知錯誤'}`
    )
  }
}

/**
 * Places API 錯誤
 */
export class PlacesAPIError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'PlacesAPIError'
  }
}

/**
 * 搜尋附近餐廳（使用 Places API）
 */
export const searchNearbyRestaurants = async (
  location: Coordinates,
  radius: number = 1500 // 預設 1.5 公里
): Promise<Restaurant[]> => {
  // 確保 API 已初始化
  if (!placesService) {
    await initGoogleMapsAPI()
  }

  if (!placesService) {
    throw new PlacesAPIError('INIT_FAILED', 'Places API 初始化失敗')
  }

  return new Promise((resolve, reject) => {
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(location.latitude, location.longitude),
      radius,
      type: 'restaurant',
    }

    placesService!.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const restaurants: Restaurant[] = results
          .filter((place) => place.place_id && place.name && place.geometry?.location)
          .map((place) => ({
            id: place.place_id!,
            name: place.name!,
            address: place.vicinity || '地址未提供',
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            photos: place.photos?.map((photo) =>
              photo.getUrl({ maxWidth: 400 })
            ),
            location: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
            },
            types: place.types,
            openingHours: place.opening_hours
              ? {
                  openNow: place.opening_hours.open_now,
                }
              : undefined,
            priceLevel: place.price_level,
          }))

        resolve(restaurants)
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]) // 沒有結果
      } else {
        reject(
          new PlacesAPIError(
            status,
            `搜尋餐廳失敗：${getStatusMessage(status)}`
          )
        )
      }
    })
  })
}

/**
 * 取得 Places API 狀態訊息
 */
const getStatusMessage = (status: google.maps.places.PlacesServiceStatus): string => {
  switch (status) {
    case google.maps.places.PlacesServiceStatus.INVALID_REQUEST:
      return '無效的請求'
    case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
      return '超過查詢限制'
    case google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
      return '請求被拒絕，請檢查 API 金鑰'
    case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR:
      return '未知錯誤，請稍後再試'
    default:
      return '發生錯誤'
  }
}

/**
 * 取得餐廳詳細資訊
 */
export const getPlaceDetails = async (
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  if (!placesService) {
    await initGoogleMapsAPI()
  }

  if (!placesService) {
    throw new PlacesAPIError('INIT_FAILED', 'Places API 初始化失敗')
  }

  return new Promise((resolve, reject) => {
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        'name',
        'formatted_address',
        'formatted_phone_number',
        'rating',
        'user_ratings_total',
        'opening_hours',
        'photos',
        'price_level',
        'website',
        'reviews',
      ],
    }

    placesService!.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        resolve(place)
      } else {
        reject(
          new PlacesAPIError(
            status,
            `取得餐廳詳細資訊失敗：${getStatusMessage(status)}`
          )
        )
      }
    })
  })
}
