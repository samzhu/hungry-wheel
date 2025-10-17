import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Coordinates, Restaurant } from '../types/restaurant'

/**
 * API 初始化狀態
 */
let isInitialized = false

/**
 * Places Library 實例
 */
let placesLibrary: typeof google.maps.places | null = null

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

    // 載入 Places Library（新版 API）
    placesLibrary = await importLibrary('places') as typeof google.maps.places

    isInitialized = true
    console.log('✅ Google Maps Places API (New) 初始化成功')
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
 * 搜尋附近餐廳（使用新版 Places API）
 */
export const searchNearbyRestaurants = async (
  location: Coordinates,
  radius: number = 1500 // 預設 1.5 公里
): Promise<Restaurant[]> => {
  // 確保 API 已初始化
  if (!placesLibrary) {
    await initGoogleMapsAPI()
  }

  if (!placesLibrary) {
    throw new PlacesAPIError('INIT_FAILED', 'Places API 初始化失敗')
  }

  try {
    console.log(`🔍 搜尋餐廳：位置 (${location.latitude}, ${location.longitude})，半徑 ${radius}m`)

    const center = new google.maps.LatLng(location.latitude, location.longitude)

    // 使用新版 Places API 的 searchNearby 方法
    const request = {
      // 必填參數：指定要返回的欄位
      fields: [
        'displayName',
        'location',
        'id',
        'formattedAddress',
        'rating',
        'userRatingCount',
        'photos',
        'types',
        'businessStatus',
        'priceLevel',
        'currentOpeningHours',
      ],
      // 位置限制
      locationRestriction: {
        center: center,
        radius: radius,
      },
      // 只搜尋餐廳
      includedPrimaryTypes: ['restaurant'],
      // 最多返回 20 個結果
      maxResultCount: 20,
      // 按照熱門度排序
      rankPreference: google.maps.places.SearchNearbyRankPreference.POPULARITY,
      // 語言設定
      language: 'zh-TW',
      region: 'TW',
    }

    const { places } = await google.maps.places.Place.searchNearby(request)

    console.log(`✅ 找到 ${places.length} 家餐廳`)

    if (!places || places.length === 0) {
      return []
    }

    // 轉換為自定義的 Restaurant 類型
    const restaurants: Restaurant[] = places
      .filter((place) => place.id && place.displayName)
      .map((place) => ({
        id: place.id!,
        name: place.displayName || '未命名餐廳',
        address: place.formattedAddress || '地址未提供',
        rating: place.rating,
        userRatingsTotal: place.userRatingCount,
        photos: place.photos?.map((photo) =>
          photo.getURI({ maxWidth: 400 })
        ),
        location: place.location ? {
          lat: place.location.lat(),
          lng: place.location.lng(),
        } : undefined,
        types: place.types,
        openingHours: place.currentOpeningHours
          ? {
              openNow: place.currentOpeningHours.isOpen?.() || undefined,
            }
          : undefined,
        priceLevel: place.priceLevel,
      }))

    return restaurants
  } catch (error) {
    console.error('❌ 搜尋餐廳失敗：', error)
    throw new PlacesAPIError(
      'SEARCH_FAILED',
      `搜尋餐廳失敗：${error instanceof Error ? error.message : '未知錯誤'}`
    )
  }
}

/**
 * 取得餐廳詳細資訊（使用新版 Places API）
 * 注意：在新版 API 中，searchNearby 已經返回了大部分資料，
 * 此函數主要用於需要額外詳細資訊時使用
 */
export const getPlaceDetails = async (
  placeId: string
): Promise<any> => {
  if (!placesLibrary) {
    await initGoogleMapsAPI()
  }

  if (!placesLibrary) {
    throw new PlacesAPIError('INIT_FAILED', 'Places API 初始化失敗')
  }

  try {
    const place = new google.maps.places.Place({
      id: placeId,
    })

    // 請求額外的詳細資訊
    await place.fetchFields({
      fields: [
        'displayName',
        'formattedAddress',
        'nationalPhoneNumber',
        'rating',
        'userRatingCount',
        'currentOpeningHours',
        'photos',
        'priceLevel',
        'websiteURI',
        'reviews',
      ],
    })

    return place
  } catch (error) {
    console.error('❌ 取得餐廳詳細資訊失敗：', error)
    throw new PlacesAPIError(
      'DETAILS_FAILED',
      `取得餐廳詳細資訊失敗：${error instanceof Error ? error.message : '未知錯誤'}`
    )
  }
}
