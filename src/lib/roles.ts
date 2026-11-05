/** 用户身份（舰长体系） */
export type UserRole = '0' | '1' | '2' | '3' // 0 普通 1 总督 2 提督 3 舰长
/** 舰队里程碑，影响徽章与头像框样式 */
export type GuardMilestone = 'base' | '100' | '1k' | '10k'

export const USER_ROLE_OPTIONS: Array<{ label: string; value: UserRole }> = [
  { label: '普通', value: '0' },
  { label: '舰长', value: '3' },
  { label: '提督', value: '2' },
  { label: '总督', value: '1' },
]

export const GUARD_MILESTONE_OPTIONS: Array<{ label: string; value: GuardMilestone }> = [
  { label: '普通', value: 'base' },
  { label: '百舰', value: '100' },
  { label: '千舰', value: '1k' },
  { label: '万舰', value: '10k' },
]

export const isGuard = (role: UserRole): boolean => role !== '0'

/** 样式1 里昵称的颜色（与原项目一致：普通 #666，总督橙、提督紫、舰长蓝） */
export const NAME_COLOR_BY_ROLE: Record<UserRole, string> = {
  '0': '#666',
  '1': '#FF7C28',
  '2': '#E17AFF',
  '3': '#00D1F1',
}

const medalDecoMap: Record<'3' | '2' | '1', Record<'base' | '1k' | '10k', string>> = {
  '3': {
    base: new URL('../assets/medal-deco/captain-base.webp', import.meta.url).href,
    '1k': new URL('../assets/medal-deco/captain-1k.webp', import.meta.url).href,
    '10k': new URL('../assets/medal-deco/captain-1k.webp', import.meta.url).href,
  },
  '2': {
    base: new URL('../assets/medal-deco/general-base.webp', import.meta.url).href,
    '1k': new URL('../assets/medal-deco/general-1k.webp', import.meta.url).href,
    '10k': new URL('../assets/medal-deco/general-1k.webp', import.meta.url).href,
  },
  '1': {
    base: new URL('../assets/medal-deco/governor-base.webp', import.meta.url).href,
    '1k': new URL('../assets/medal-deco/governor-1k.webp', import.meta.url).href,
    '10k': new URL('../assets/medal-deco/governor-1k.webp', import.meta.url).href,
  },
}

/** 粉丝牌前的舰队徽章（样式1） */
export const getMedalDecoUrl = (role: UserRole, milestone: GuardMilestone): string | null => {
  if (role === '0') return null
  return medalDecoMap[role][milestone === '100' ? 'base' : milestone]
}

const frameMap: Record<'3' | '2' | '1', Record<GuardMilestone, string>> = {
  '3': {
    base: new URL('../assets/frame/captain-base.png', import.meta.url).href,
    '100': new URL('../assets/frame/captain-100.png', import.meta.url).href,
    '1k': new URL('../assets/frame/captain-1k.png', import.meta.url).href,
    '10k': new URL('../assets/frame/captain-10k.png', import.meta.url).href,
  },
  '2': {
    base: new URL('../assets/frame/general-base.png', import.meta.url).href,
    '100': new URL('../assets/frame/general-100.png', import.meta.url).href,
    '1k': new URL('../assets/frame/general-1k.png', import.meta.url).href,
    '10k': new URL('../assets/frame/general-10k.png', import.meta.url).href,
  },
  '1': {
    base: new URL('../assets/frame/governor-base.png', import.meta.url).href,
    '100': new URL('../assets/frame/governor-100.png', import.meta.url).href,
    '1k': new URL('../assets/frame/governor-1k.png', import.meta.url).href,
    '10k': new URL('../assets/frame/governor-10k.png', import.meta.url).href,
  },
}

/** 样式2 的头像框 */
export const getAvatarFrameUrl = (role: UserRole, milestone: GuardMilestone): string | null => {
  if (role === '0') return null
  return frameMap[role][milestone]
}
