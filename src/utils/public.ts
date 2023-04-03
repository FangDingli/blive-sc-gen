// @ts-ignore
// import domtoimage from 'dom-to-image-more'
import html2canvas from 'html2canvas'

export const currentTheme = ref<any>(null)

/* export const dom2image = (domid: string) => {
  const dom = document.getElementById(domid)
  // 自动获取的dom宽高有问题，此处手动获取宽高并放入配置
  const width = dom?.offsetWidth
  const height = dom?.offsetHeight
  domtoimage
    .toPng(dom, { width, height })
    .then(function (dataUrl: string) {
      const link = document.createElement('a')
      link.download = 'sc-image-' + new Date().toLocaleString() + '.png'
      link.href = dataUrl
      link.click()
      link.remove()
    })
    .catch(function (error: any) {
      console.error('oops, something went wrong!', error)
    })
} */

export const exportPngFile = async (domid: string, scale: number) => {
  const canvas: HTMLCanvasElement = await html2canvas(document.getElementById(domid)!, {
    scale,
    backgroundColor: null,
    useCORS: true,
  })
  // 尝试修复最新版 Chrome 下载文件会提示安全问题并把文件拦截，发现转为 blob 依然会拦截，那就略过这步
  // const blob = await fetch(canvas.toDataURL('image/png')).then(res => res.blob())
  const link = document.createElement('a')
  link.download = 'sc-image-' + new Date().toLocaleString() + '.png'
  // link.href = URL.createObjectURL(blob)
  link.href = canvas.toDataURL('image/png')
  link.click()
  link.remove()
}
