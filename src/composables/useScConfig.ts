import { reactive, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import type { ExportEngine } from '@/lib/exporter'
import type { GuardMilestone, UserRole } from '@/lib/roles'

export interface ScConfig {
  // 通用
  width: number
  battery: number
  userName: string
  scContent: string
  showTrans: boolean
  transContent: string
  userRole: UserRole
  milestone: GuardMilestone
  isVip: boolean
  // 样式1（弹幕历史卡片）
  showFansMedal: boolean
  medalName: string
  medalLevel: number
  medalGuardVariant: boolean
  medalExpired: boolean
  // 样式2（详情卡片）
  uid: string
  avatar: string
  // 导出
  exportEngine: ExportEngine
  exportScale: number
}

const defaultConfig: ScConfig = {
  width: 269,
  battery: 1000,
  userName: '归墟_丶',
  scContent: '在这里填写 SC  内容',
  showTrans: false,
  transContent: 'Translation here...',
  userRole: '3',
  milestone: 'base',
  isVip: true,
  showFansMedal: true,
  medalName: '苑大头',
  medalLevel: 27,
  medalGuardVariant: false,
  medalExpired: false,
  uid: '',
  avatar: new URL('../assets/noface.jpg', import.meta.url).href,
  exportEngine: 'modern-screenshot',
  exportScale: 2,
}

const STORAGE_KEY = 'blive-sc-gen:config:v1'

/** 启动时恢复上次填写的内容；只接受已知键，旧版本/脏数据不会污染新字段 */
function load(): ScConfig {
  const base: ScConfig = { ...defaultConfig }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<ScConfig>
    for (const key of Object.keys(defaultConfig) as (keyof ScConfig)[]) {
      if (saved[key] !== undefined) {
        ;(base as Record<keyof ScConfig, unknown>)[key] = saved[key]
      }
    }
  } catch {
    // 数据损坏则直接用默认值
  }
  return base
}

const config = reactive<ScConfig>(load())

/** 立即写入 localStorage。头像 base64 超出配额时降级为「不存头像」重试。 */
export function persistConfig() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    try {
      const { avatar: _avatar, ...rest } = config
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {
      // 仍失败则放弃持久化，不影响功能
    }
  }
}

/**
 * 写入时机：
 * - 输入停顿 500ms 后防抖写入（避免每敲一个键写一次）
 * - 导出成功后由导出流程强制写一次
 * 注意：刻意不用 pagehide 兜底——它会在「用户清空 localStorage 后刷新」时
 * 把内存里的旧值写回去，导致默认值永远无法生效；防抖写入已覆盖正常编辑。
 */
watchDebounced(config, persistConfig, { debounce: 500, deep: true })

export const useScConfig = () => config

/** 粉丝牌名称截断：按字节数（中文 2 字节）限制 6 字节，与 B 站行为一致 */
export const clampMedalName = (name: string, maxBytes = 6): string => {
  let bytes = 0
  let result = ''
  for (let i = 0; i < name.length; i++) {
    bytes += name.charCodeAt(i) > 255 ? 2 : 1
    if (bytes > maxBytes) break
    result += name[i]
  }
  return result
}
