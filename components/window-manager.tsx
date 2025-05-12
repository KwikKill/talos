"use client"

import { Rnd } from "react-rnd"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { AppWindow } from "@/types/app-window"
import NotepadApp from "@/components/apps/notepad-app"
import CalculatorApp from "@/components/apps/calculator-app"
import BrowserApp from "@/components/apps/browser-app"
import SettingsApp from "@/components/apps/settings-app"
import FileExplorerApp from "@/components/apps/file-explorer-app"

interface WindowManagerProps {
  windows: AppWindow[]
  activeWindowId: string | null
  onClose: (windowId: string) => void
  onMinimize: (windowId: string) => void
  onMaximize: (windowId: string) => void
  onActivate: (windowId: string) => void
  onUpdatePosition: (windowId: string, position: { x: number; y: number }) => void
  onUpdateSize: (windowId: string, size: { width: number; height: number }, position: { x: number; y: number }) => void
  darkMode?: boolean
}

export default function WindowManager({
  windows,
  activeWindowId,
  onClose,
  onMinimize,
  onMaximize,
  onActivate,
  onUpdatePosition,
  onUpdateSize,
  darkMode,
}: WindowManagerProps) {
  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] || Icons.Square) as LucideIcon
  }

  const renderAppContent = (appId: string, windowId: string) => {
    switch (appId) {
      case "notepad":
        return <NotepadApp />
      case "calculator":
        return <CalculatorApp />
      case "browser":
        return <BrowserApp />
      case "settings":
        return <SettingsApp />
      case "file-explorer":
        return <FileExplorerApp />
      default:
        return <div className="flex h-full items-center justify-center">App not found</div>
    }
  }

  return (
    <>
      {windows.map((window) => {
        if (window.isMinimized) return null

        const IconComponent = getIconComponent(window.icon as keyof typeof Icons)

        // Calculate window dimensions based on maximized state
        const position = window.isMaximized ? { x: 0, y: 0 } : window.position
        const size = window.isMaximized
          ? { width: "100%", height: "91%" }
          : { width: window.size.width, height: window.size.height }

        return (
          <Rnd
            key={window.id}
            position={position}
            size={size}
            style={{
              zIndex: window.zIndex,
            }}
            onDragStop={(e, d) => {
              if (!window.isMaximized) {
                onUpdatePosition(window.id, { x: d.x, y: d.y })
              }
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              if (!window.isMaximized) {
                // Get the new size from the ref element
                const newWidth = Number.parseInt(ref.style.width)
                const newHeight = Number.parseInt(ref.style.height)

                // Update both size and position
                onUpdateSize(window.id, {
                  width: newWidth,
                  height: newHeight,
                }, position)
              }
            }}
            dragHandleClassName="window-drag-handle"
            bounds="parent"
            minWidth={300}
            minHeight={200}
            disableDragging={window.isMaximized}
            enableResizing={!window.isMaximized}
            className={`overflow-hidden rounded-md border border-gray-700 bg-background shadow-lg ${
              activeWindowId === window.id ? "ring-2 ring-blue-500" : ""
            } ${darkMode ? "dark" : ""}`}
            onMouseDown={() => onActivate(window.id)}
          >
            <div className="flex h-full flex-col">
              <div className="window-drag-handle flex h-8 items-center justify-between bg-gray-900 px-2">
                <div className="flex items-center">
                  <IconComponent className="mr-2 h-4 w-4 text-white" />
                  <span className="text-sm text-white">{window.title}</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-gray-700"
                    onClick={() => onMinimize(window.id)}
                  >
                    <Icons.Minus className="h-3 w-3 text-white" />
                  </button>
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-gray-700"
                    onClick={() => onMaximize(window.id)}
                  >
                    {window.isMaximized ? (
                      <Icons.Minimize2 className="h-3 w-3 text-white" />
                    ) : (
                      <Icons.Maximize2 className="h-3 w-3 text-white" />
                    )}
                  </button>
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-red-500"
                    onClick={() => onClose(window.id)}
                  >
                    <Icons.X className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-background text-foreground dark:bg-background dark:text-foreground">
                {renderAppContent(window.appId, window.id)}
              </div>
            </div>
          </Rnd>
        )
      })}
    </>
  )
}
