import type { SelectOption } from 'naive-ui'

export const userRoleDict: SelectOption[] = [
  {
    label: '普通',
    value: '0',
  },
  {
    label: '舰长',
    value: '3',
  },
  {
    label: '提督',
    value: '2',
  },
  {
    label: '总督',
    value: '1',
  },
]

const fansMedalColorMap = [
  [
    (level: number) => level >= 1 && level < 5,
    () => ({
      start: '#5c968e',
      end: '#5c968e',
    }),
  ],
  [
    (level: number) => level >= 5 && level < 9,
    () => ({
      start: '#5d7b9e',
      end: '#5d7b9e',
    }),
  ],
  [
    (level: number) => level >= 9 && level < 13,
    () => ({
      start: '#8d7ca6',
      end: '#8d7ca6',
    }),
  ],
  [
    (level: number) => level >= 13 && level < 17,
    () => ({
      start: '#be6686',
      end: '#be6686',
    }),
  ],
  [
    (level: number) => level >= 17 && level < 21,
    () => ({
      start: '#c79d24',
      end: '#c79d24',
    }),
  ],
  [
    (level: number) => level >= 21 && level < 25,
    () => ({
      start: '#1a544b',
      end: '#529d92',
    }),
  ],
  [
    (level: number) => level >= 25 && level < 29,
    () => ({
      start: '#06154c',
      end: '#6888f1',
    }),
  ],
  [
    (level: number) => level >= 29 && level < 33,
    () => ({
      start: '#2d0855',
      end: '#9d9bff',
    }),
  ],
  [
    (level: number) => level >= 33 && level < 37,
    () => ({
      start: '#7a0423',
      end: '#e986bb',
    }),
  ],
  [
    (level: number) => level >= 37,
    () => ({
      start: '#ff610b',
      end: '#ffd084',
    }),
  ],
]

export const getMedalColorByLevel = (level: number): { start: string; end: string } => {
  const result = fansMedalColorMap.find(n => n[0](level)) as any

  return result[1]()
}

export const medalBorderColor = ['', '#ffe854', '#ffe854', '#67e8ff']
