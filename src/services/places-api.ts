import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Coordinates, Restaurant } from '../types/restaurant'
import { isPlaceOpenNow, formatOpeningHours } from '../utils/opening-hours'

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
 * 轉換並過濾 Places 資料
 *
 * 注意：minRating 和 isOpenNow 已由 API 端過濾，這裡只做基本檢查和資料轉換
 *
 * @param places - 待過濾的餐廳列表
 * @param minRating - 最低評分（已由 API 過濾，這裡僅用於日誌）
 * @param verbose - 是否輸出詳細日誌
 */
function convertAndFilterPlaces(places: any[], minRating: number, verbose: boolean = true): Restaurant[] {
  if (verbose && places.length > 0) {
    console.log(`   過濾條件：評分 ≥ ${minRating} ⭐，營業中`)
  }

  return places
    .filter((place) => {
      const placeName = (place.displayName as any)?.text || place.displayName || '未知店家'

      // 必須有 ID、名稱和位置
      if (!place.id || !place.displayName || !place.location) {
        if (verbose) console.log(`⏭️ 跳過缺少基本資料的店家：${placeName}`)
        return false
      }

      // 過濾掉已歇業的店家（臨時或永久關閉）
      if (place.businessStatus === 'CLOSED_TEMPORARILY' ||
          place.businessStatus === 'CLOSED_PERMANENTLY') {
        if (verbose) console.log(`⏭️ 跳過已歇業的店家：${placeName}`)
        return false
      }

      // API 已經過濾了評分和營業狀態，這裡只做日誌輸出
      if (verbose) {
        const rating = place.rating ? `${place.rating} ⭐` : '無評分'
        console.log(`✅ ${placeName} - ${rating}`)
      }

      return true
    })
    .map((place) => ({
      id: place.id!,
      name: (place.displayName as any)?.text || place.displayName || '未命名餐廳',
      address: place.formattedAddress || '地址未提供',
      rating: place.rating ?? undefined,
      userRatingsTotal: place.userRatingCount ?? undefined,
      photos: place.photos?.map((photo: any) =>
        photo.getURI({ maxWidth: 400 })
      ),
      location: {
        lat: place.location!.lat(),
        lng: place.location!.lng(),
      },
      types: place.types,
      openingHours: place.regularOpeningHours
        ? {
            openNow: isPlaceOpenNow(place.regularOpeningHours),
            weekdayText: formatOpeningHours(place.regularOpeningHours),
          }
        : undefined,
      priceLevel: place.priceLevel !== null && place.priceLevel !== undefined
        ? Number(place.priceLevel)
        : undefined,
    }))
}

/**
 * 漸進式多策略搜索餐廳
 * 策略順序：
 * 1. 4 星以上 1 公里內
 * 2. 3 星以上 1 公里內
 * 3. 4 星以上 1.5 公里內
 * 4. 3 星以上 1.5 公里內
 */
export const searchNearbyRestaurantsWithProgressiveStrategy = async (
  location: Coordinates,
  targetCount: number = 20 // 目標餐廳數量
): Promise<Restaurant[]> => {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎯 開始漸進式搜索`)
  console.log(`${'='.repeat(60)}`)
  console.log(`📍 位置：(${location.latitude}, ${location.longitude})`)
  console.log(`🎲 目標：${targetCount} 家餐廳`)
  console.log(`📋 策略：4⭐1km → 3⭐1km → 4⭐1.5km → 3⭐1.5km`)

  // 定義搜索策略
  const strategies = [
    { rating: 4.0, radius: 1000, name: '4⭐ 1km內' },
    { rating: 3.0, radius: 1000, name: '3⭐ 1km內' },
    { rating: 4.0, radius: 1500, name: '4⭐ 1.5km內' },
    { rating: 3.0, radius: 1500, name: '3⭐ 1.5km內' },
  ]

  const restaurantMap = new Map<string, Restaurant>() // 使用 Map 自動去重（key = 餐廳 ID）
  let strategyIndex = 0

  for (const strategy of strategies) {
    strategyIndex++
    console.log(`\n${'='.repeat(60)}`)
    console.log(`📋 策略 ${strategyIndex}/${strategies.length}: ${strategy.name}`)
    console.log(`   條件：評分 ≥ ${strategy.rating} ⭐、半徑 ${strategy.radius}m、營業中`)
    console.log(`   目前籤筒：${restaurantMap.size} 家`)

    try {
      // 執行搜索
      const results = await searchWithSingleStrategy(location, strategy.radius, strategy.rating)

      // 合併結果並去重
      let newCount = 0
      const newRestaurants: string[] = []
      for (const restaurant of results) {
        if (!restaurantMap.has(restaurant.id)) {
          restaurantMap.set(restaurant.id, restaurant)
          newCount++
          newRestaurants.push(restaurant.name)
        }
      }

      console.log(`   ✅ API 返回：${results.length} 家，新增：${newCount} 家（已去重：${results.length - newCount} 家）`)

      // 如果有新增餐廳，顯示前 3 家
      if (newCount > 0 && newRestaurants.length > 0) {
        const preview = newRestaurants.slice(0, 3).join('、')
        const more = newRestaurants.length > 3 ? ` 等 ${newRestaurants.length} 家` : ''
        console.log(`   📝 新增：${preview}${more}`)
      }

      console.log(`   📊 籤筒總計：${restaurantMap.size} 家`)

      // 如果已達到目標數量，停止搜索
      if (restaurantMap.size >= targetCount) {
        console.log(`\n🎉 已達到目標！籤筒內有 ${restaurantMap.size} 家餐廳`)
        break
      }
    } catch (error) {
      console.error(`   ❌ 策略 ${strategyIndex} 執行失敗：`, error)
      // 繼續執行下一個策略
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`🍽️  最終結果：${restaurantMap.size} 家符合條件的餐廳`)
  console.log(`${'='.repeat(60)}`)

  // 輸出餐廳清單
  const restaurants = Array.from(restaurantMap.values())
  console.log('\n📋 餐廳清單：')
  restaurants.forEach((restaurant, idx) => {
    const rating = restaurant.rating ? `${restaurant.rating} ⭐` : '無評分'
    const status = restaurant.openingHours?.openNow ? '✅ 營業中' : '❓ 未知'
    console.log(`${String(idx + 1).padStart(2, ' ')}. ${restaurant.name} - ${rating} ${status}`)
  })
  console.log(`${'='.repeat(60)}\n`)

  return restaurants
}

/**
 * 執行單一策略的搜索
 */
async function searchWithSingleStrategy(
  location: Coordinates,
  radius: number,
  minRating: number
): Promise<Restaurant[]> {
  if (!placesLibrary) {
    await initGoogleMapsAPI()
  }

  if (!placesLibrary) {
    throw new PlacesAPIError('INIT_FAILED', 'Places API 初始化失敗')
  }

  const request = {
    textQuery: '餐廳',
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
      'regularOpeningHours',
    ],
    includedType: 'restaurant',
    // 使用 locationBias 搭配 circle（優先返回指定半徑內的餐廳）
    // 注意：JavaScript API 不支援 locationRestriction with circle，只支援 locationBias
    locationBias: {
      center: {
        lat: location.latitude,
        lng: location.longitude
      },
      radius: radius  // 單位：公尺
    } as any,  // TypeScript 類型定義未完整，使用 any 繞過
    // API 原生過濾參數 - 減少傳輸數據量和 client-side 處理
    minRating: minRating,    // 最低評分（API 端過濾）
    isOpenNow: true,          // 只返回目前營業中的店家（API 端過濾）
    maxResultCount: 20,
    language: 'zh-TW',
    region: 'TW',
  }

  const { places } = await google.maps.places.Place.searchByText(request)

  if (!places || places.length === 0) {
    return []
  }

  // API 已經過濾了評分和營業狀態，這裡只需要簡單轉換
  return convertAndFilterPlaces(places, minRating, false)
}

