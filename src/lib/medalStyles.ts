/**
 * 粉丝牌等级 → 配色。
 * 数据来源：2026-06 实测记录（粉丝牌.xlsx / SC.txt）。
 * borderColor: 0.5px 描边色（::after 伪元素），gradient: 底色（同色值带 99 透明度）。
 * 普通牌与「大航海」变体在 21 级起出现分化；41 级起普通牌无采样，沿用大航海色。
 */

export interface MedalStyle {
  borderColor: string
  gradient: string
}

interface MedalTier {
  min: number
  max: number
  normal: MedalStyle
  guard?: { borderColor: string; gradient: string }
}

const solid = (color: string): MedalStyle => ({ borderColor: color, gradient: color })

const medalTiers: MedalTier[] = [
  { min: 1, max: 10, normal: solid('#5762A799') },
  { min: 11, max: 20, normal: solid('#C770A499') },
  {
    min: 21,
    max: 30,
    normal: solid('#3FB4F699'),
    guard: { borderColor: '#5FC7F4', gradient: '#3FB4F699' },
  },
  {
    min: 31,
    max: 40,
    normal: solid('#4C7DFF99'),
    guard: { borderColor: '#58A1F8', gradient: '#4C7DFF99' },
  },
  {
    min: 41,
    max: 51,
    normal: solid('#A773F199'),
    guard: { borderColor: '#D47AFF', gradient: '#A773F199' },
  },
  {
    min: 52,
    max: 60,
    normal: solid('#EC4F6E99'),
    guard: { borderColor: '#F18087', gradient: '#EC4F6E99' },
  },
]

/** 粉丝牌失效样式 */
export const EXPIRED_MEDAL_STYLE: MedalStyle = {
  borderColor: '#919298CC',
  gradient: 'rgba(145, 146, 152, 0.8)',
}

export const getMedalStyle = (level: number, isGuard: boolean): MedalStyle => {
  const tier = medalTiers.find(t => level >= t.min && level <= t.max) ?? medalTiers[0]!
  if (isGuard && tier.guard) return tier.guard
  return tier.normal
}
