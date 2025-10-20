/**
 * 營業時間判斷工具
 */

/**
 * 判斷店家當前是否營業
 * @param openingHoursObj - Place.regularOpeningHours 物件
 * @param debug - 是否顯示詳細 debug 訊息
 * @returns boolean | undefined - true: 營業中, false: 休息中, undefined: 無法判斷
 */
export function isPlaceOpenNow(openingHoursObj: any, debug: boolean = false): boolean | undefined {
  if (!openingHoursObj) {
    return undefined
  }

  // 方法 1: 嘗試使用 isOpen() 方法 (新版 API 可能有)
  if (typeof openingHoursObj.isOpen === 'function') {
    try {
      const result = openingHoursObj.isOpen()
      if (debug) console.log('  使用 isOpen() 方法:', result)
      return result
    } catch (error) {
      if (debug) console.warn('  isOpen() 方法調用失敗:', error)
    }
  }

  // 方法 2: 嘗試訪問 openNow 屬性 (舊版 API)
  if ('openNow' in openingHoursObj) {
    if (debug) console.log('  使用 openNow 屬性:', openingHoursObj.openNow)
    return openingHoursObj.openNow
  }

  // 方法 3: 嘗試通過 periods 自己計算
  const periods = openingHoursObj.periods
  if (periods && Array.isArray(periods)) {
    if (debug) console.log('  使用 periods 計算（共', periods.length, '個時段）')
    return isOpenBasedOnPeriods(periods, debug)
  }

  // 無法判斷
  if (debug) console.warn('  ⚠️ 無法判斷營業狀態')
  return undefined
}

/**
 * 根據 periods 數據判斷當前是否營業
 * @param periods - 營業時段數組
 * @param debug - 是否顯示詳細 debug 訊息
 */
function isOpenBasedOnPeriods(periods: any[], debug: boolean = false): boolean | undefined {
  if (!periods || periods.length === 0) {
    return undefined
  }

  const now = new Date()
  const currentDay = now.getDay() // 0 (Sunday) - 6 (Saturday)
  const currentTime = now.getHours() * 100 + now.getMinutes() // e.g., 1430 for 14:30

  if (debug) {
    console.log(`  ⏰ 當前時間: 星期${currentDay}, ${Math.floor(currentTime / 100)}:${String(currentTime % 100).padStart(2, '0')}`)
  }

  // 查找當天的營業時段
  for (const period of periods) {
    // periods 可能有不同的結構，嘗試訪問
    const open = period.open
    const close = period.close

    if (!open) continue

    // Google Places API 的 day: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const openDay = open.day ?? open.dayOfWeek ?? open.weekday
    const closeDay = close?.day ?? close?.dayOfWeek ?? close?.weekday

    // 檢查是否是當天的營業時段
    if (openDay !== currentDay && !(closeDay === currentDay && openDay === (currentDay + 6) % 7)) {
      continue
    }

    // 獲取開始和結束時間
    const openTime = getTimeValue(open)
    const closeTime = close ? getTimeValue(close) : 2359

    if (debug) {
      console.log(`  檢查時段: ${openTime} - ${closeTime}`)
    }

    // 判斷當前時間是否在營業時段內
    if (closeDay !== undefined && closeDay !== openDay) {
      // 跨日營業 (例如: 週五 18:00 - 週六 02:00)
      if (openDay === currentDay) {
        // 今天是開始日
        if (currentTime >= openTime) {
          return true
        }
      } else if (closeDay === currentDay) {
        // 今天是結束日
        if (currentTime < closeTime) {
          return true
        }
      }
    } else {
      // 同一天內營業
      if (currentTime >= openTime && currentTime < closeTime) {
        return true
      }
    }
  }

  return false
}

/**
 * 從時間物件中獲取時間值 (HHMM 格式)
 */
function getTimeValue(timeObj: any): number {
  if (!timeObj) return 0

  // 嘗試不同的屬性名稱
  const hour = timeObj.hour ?? timeObj.hours ?? 0
  const minute = timeObj.minute ?? timeObj.minutes ?? 0

  return hour * 100 + minute
}

/**
 * 格式化營業時間描述
 */
export function formatOpeningHours(openingHoursObj: any): string[] | undefined {
  if (!openingHoursObj) return undefined

  // 嘗試訪問 weekdayDescriptions (新版 API)
  if (openingHoursObj.weekdayDescriptions && Array.isArray(openingHoursObj.weekdayDescriptions)) {
    return openingHoursObj.weekdayDescriptions
  }

  // 嘗試訪問 weekday_text (舊版 API)
  if (openingHoursObj.weekday_text && Array.isArray(openingHoursObj.weekday_text)) {
    return openingHoursObj.weekday_text
  }

  return undefined
}
