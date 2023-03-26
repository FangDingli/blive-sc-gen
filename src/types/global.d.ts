export {}

declare global {
  type UserRole = '0' | '3' | '2' | '1'

  interface ConfigOption {
    width?: number
    battery?: number
    userName?: string
    userRole?: UserRole
    scContent?: string
    showTrans?: boolean
    transContent?: string
    showFansMedal?: boolean
    medalName?: string
    medalLevel?: number
    uid?: string
    isVip?: boolean
  }
}
