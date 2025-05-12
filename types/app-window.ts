export interface AppWindow {
  id: string
  appId: string
  title: string
  icon: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  data?: {
    fileId?: string
    [key: string]: any
  }
}
