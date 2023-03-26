const scColorMap = [
  [
    (battery: number) => battery < 500,
    () => ({
      info: '#EDF5FF',
      content: '#2A60B2',
    }),
  ],
  [
    (battery: number) => battery >= 500 && battery < 1000,
    () => ({
      info: '#dbfffd',
      content: '#427d9e',
    }),
  ],
  [
    (battery: number) => battery >= 1000 && battery < 5000,
    () => ({
      info: '#fff1c5',
      content: '#e2b52b',
    }),
  ],
  [
    (battery: number) => battery >= 5000 && battery < 10000,
    () => ({
      info: '#ffead2',
      content: '#e09443',
    }),
  ],
  [
    (battery: number) => battery >= 10000 && battery < 20000,
    () => ({
      info: '#ffe7e4',
      content: '#e54d4d',
    }),
  ],
  [
    (battery: number) => battery >= 20000,
    () => ({
      info: '#ffd8d8',
      content: '#ab1a32',
    }),
  ],
]

export const getColorByPrice = (battery: number): { info: string; content: string } => {
  const result = scColorMap.find(n => n[0](battery)) as any

  return result[1]()
}

export const nameColorByRole = ['#666', '#FF7C28', '#E17AFF', '#00D1F1']

export const scBadgeByPrice = (battery: number) => {
  if (battery >= 5000 && battery < 20000) {
    return new URL(`../assets/images/sc-badge-1.png`, import.meta.url).href
  } else if (battery >= 20000 && battery < 30000) {
    return new URL(`../assets/images/sc-badge-2.png`, import.meta.url).href
  } else if (battery >= 30000) {
    return new URL(`../assets/images/sc-badge-3.png`, import.meta.url).href
  } else {
    return new URL(``, import.meta.url).href
  }
}
