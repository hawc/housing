import type { JulianDate } from 'cesium';

import type { CesiumType } from '@/types/cesium';

export function dateToJulianDate(CesiumJs: CesiumType, date: Date): JulianDate {
  return CesiumJs.JulianDate.fromDate(date);
}