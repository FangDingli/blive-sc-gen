// @ts-ignore
import domtoimage from 'dom-to-image-more'

export const currentTheme = ref<any>(null)

export const dom2image = (domid: string) => {
  const dom = document.getElementById(domid)
  // 自动获取的dom宽高有问题，此处手动获取宽高并放入配置
  const width = dom?.offsetWidth
  const height = dom?.offsetHeight
  domtoimage
    .toPng(dom, { width, height })
    .then(function (dataUrl: string) {
      /* const img = new Image()
      img.src = dataUrl
      document.body.appendChild(img) */
      const link = document.createElement('a')
      link.download = 'sc-image-' + new Date().toLocaleString() + '.png'
      link.href = dataUrl
      link.click()
      link.remove()
    })
    .catch(function (error: any) {
      console.error('oops, something went wrong!', error)
    })
}
