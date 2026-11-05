import { computed, ref } from 'vue'
import { useScConfig } from './useScConfig'

/**
 * 头像获取。
 *
 * 坑点（详见 README）：「uid → 头像」的第三方代理以 307 重定向跳转到真实图片，
 * 而它的 307 响应不带 Access-Control-Allow-Origin。浏览器在 CORS 模式下要求
 * 重定向链上每一跳都通过 CORS 检查，导致预览可显示（<img> 不检查 CORS）、
 * 导出时图片重新以 crossorigin 加载而失败，最终导出图缺头像。
 *
 * 因此 uid 获取的头像仅用于预览；需要导出也带头像，请粘贴头像直链
 * （B 站图床直链带 ACAO: *，可转 base64）或手动上传文件。
 */

export type AvatarStatus = 'idle' | 'loading' | 'ok' | 'error'
export type AvatarSource = 'default' | 'uid' | 'url' | 'file'

export const useAvatar = () => {
  const config = useScConfig()
  const status = ref<AvatarStatus>('idle')
  const message = ref('')

  // 恢复持久化状态时还原头像来源标记，保证「导出可用/仅预览」徽章跨刷新正确
  const initialSource = (): AvatarSource => {
    const a = config.avatar
    if (a.startsWith('data:')) return 'url'
    if (a.includes('workers.vrp.moe')) return 'uid'
    if (a.includes('noface')) return 'default'
    return 'url'
  }
  const source = ref<AvatarSource>(initialSource())

  /** 是否可以完整导出到图片里：base64 头像（上传/直链转换成功）才可以 */
  const exportable = computed(() => config.avatar.startsWith('data:'))

  const applyBlob = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

  /**
   * 通过 uid 获取头像 —— 仅预览。
   * 代理 307 重定向缺 CORS 头，导出管线加载不了这张图，导出图里不会有头像。
   */
  const fetchPreviewAvatar = (uid: string) => {
    const trimmed = uid.trim()
    if (!/^\d+$/.test(trimmed)) {
      status.value = 'error'
      message.value = '请先填写纯数字 uid'
      return
    }
    config.avatar = `https://workers.vrp.moe/api/bilibili/avatar/${trimmed}`
    source.value = 'uid'
    // 探测图片是否真的加载成功（代理/图床/网络都可能挂），失败给用户明确提示
    const img = new Image()
    img.onload = () => {
      status.value = 'ok'
      message.value = '已获取（仅预览）：导出的图片不含头像，需要带头像请改用「头像直链」或「上传头像」'
    }
    img.onerror = () => {
      status.value = 'error'
      message.value = '头像加载失败：请检查网络连接后重试'
    }
    img.src = config.avatar
  }

  /**
   * 手动粘贴头像直链。hdslb 直链带 ACAO: *，优先 fetch 转 base64 保证可导出；
   * 若 fetch 失败（非 B 站图床、代理出口在境外被 CDN 拒绝等），退化为直接
   * 引用该 URL 渲染，此时导出能否带头像取决于该图床的 CORS 策略。
   *
   * 用户从动态资料卡复制的直链通常带缩放后缀（如 @96w_96h_!web-dynamic.webp，
   * 仅 96px，导出放大后发糊）。识别到 B 站图床头像链接时自动改取无后缀原图，
   * 原图取不到再退回用户贴的原始 URL。
   */
  const applyAvatarUrl = async (url: string) => {
    const trimmed = url.trim()
    if (!trimmed) return
    status.value = 'loading'
    message.value = ''

    const candidates: string[] = []
    const hdslbFace = /^https?:\/\/i\d+\.hdslb\.com\/bfs\/face\//
    if (hdslbFace.test(trimmed) && trimmed.includes('@')) {
      candidates.push(trimmed.split('@')[0]!)
    }
    candidates.push(trimmed)

    let upgraded = false
    let lastError: unknown = null
    for (let i = 0; i < candidates.length; i++) {
      try {
        const res = await fetch(candidates[i]!, { mode: 'cors' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        config.avatar = await applyBlob(await res.blob())
        source.value = 'url'
        status.value = 'ok'
        if (i === 0 && candidates.length > 1) upgraded = true
        message.value = upgraded
          ? '已自动改取原图以保证导出清晰度'
          : ''
        return
      } catch (e) {
        lastError = e
      }
    }

    config.avatar = trimmed
    source.value = 'url'
    status.value = 'ok'
    message.value = `无法转为 base64（${lastError instanceof Error ? lastError.message : 'CORS 限制'}），已直接引用该链接，导出可能缺头像`
  }

  /** 手动上传头像文件（100% 可靠，转 base64 后一定可导出） */
  const applyAvatarFile = async (file: File) => {
    status.value = 'loading'
    message.value = ''
    config.avatar = await applyBlob(file)
    source.value = 'file'
    status.value = 'ok'
  }

  return { status, source, exportable, message, fetchPreviewAvatar, applyAvatarUrl, applyAvatarFile }
}
