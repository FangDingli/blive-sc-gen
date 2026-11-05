import { domToPng } from 'modern-screenshot'
import html2canvas from 'html2canvas-pro'

export type ExportEngine = 'modern-screenshot' | 'html2canvas-pro'

/**
 * 将 DOM 节点导出为 PNG 并触发下载。
 * 两个引擎：modern-screenshot（SVG 包裹路线，对伪元素/字体的还原更好）；
 * html2canvas-pro（html2canvas 的社区 fork，支持 oklch 等 Tailwind v4 颜色函数）。
 */
export const exportPng = async (
  el: HTMLElement,
  scale: number,
  engine: ExportEngine,
  filename?: string,
): Promise<void> => {
  const name = filename ?? `sc-image-${new Date().toLocaleString()}`

  let dataUrl: string
  if (engine === 'modern-screenshot') {
    dataUrl = await domToPng(el, { scale })
  } else {
    const canvas = await html2canvas(el, {
      scale,
      backgroundColor: null,
      useCORS: true,
    })
    dataUrl = canvas.toDataURL('image/png')
  }

  const link = document.createElement('a')
  link.download = `${name}.png`
  link.href = dataUrl
  link.click()
  link.remove()
}
