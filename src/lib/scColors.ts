/**
 * SC 价格 → 卡片配色。
 * info: 头部背景色（浅），content: 内容区背景色（深，同时用作边框色）。
 * 色值抓取自 B 站直播间弹幕历史里的 SC 卡片内联样式。
 */
export interface ScColor {
  info: string
  content: string
}

const scColorTiers: Array<{ min: number; max: number; color: ScColor }> = [
  { min: 0, max: 499, color: { info: '#EDF5FF', content: '#2A60B2' } },
  { min: 500, max: 999, color: { info: '#DBFFFD', content: '#427D9E' } },
  { min: 1000, max: 4999, color: { info: '#FFF1C5', content: '#E2B52B' } },
  { min: 5000, max: 9999, color: { info: '#FFEAD2', content: '#E09443' } },
  { min: 10000, max: 19999, color: { info: '#FFE7E4', content: '#E54D4D' } },
  { min: 20000, max: Number.POSITIVE_INFINITY, color: { info: '#FFD8D8', content: '#AB1A32' } },
]

export const getScColorByBattery = (battery: number): ScColor => {
  const tier = scColorTiers.find(t => battery >= t.min && battery <= t.max)
  return tier?.color ?? scColorTiers[0]!.color
}

/**
 * SC 卡片右下角角标（特定价格有专属小图，大额区间沿用旧版徽章图）。
 * 500 / 1314 / 3000 / 10000 为 2026 年新版 CDN 图，已本地化。
 */
const scBadgeMap = new Map<number, string>([
  [500, new URL('../assets/sc-badge/500.avif', import.meta.url).href],
  [1314, new URL('../assets/sc-badge/1314.avif', import.meta.url).href],
  [3000, new URL('../assets/sc-badge/3000.avif', import.meta.url).href],
  [10000, new URL('../assets/sc-badge/10000.avif', import.meta.url).href],
])

const legacyBadge = (battery: number): string => {
  const badge = battery >= 30000 ? '30000' : battery >= 20000 ? '20000' : '5000'
  return new URL(`../assets/sc-badge/${badge}.png`, import.meta.url).href
}

export const getScBadgeByBattery = (battery: number): string | null => {
  if (battery < 500) return null
  return scBadgeMap.get(battery) ?? legacyBadge(battery)
}
