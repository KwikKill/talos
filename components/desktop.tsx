"use client"

import { useState } from "react"
import TaskBar from "@/components/taskbar"
import DesktopIcon from "@/components/desktop-icon"
import WindowManager from "@/components/window-manager"
import StartMenu from "@/components/start-menu"
import { FileSystemProvider } from "@/components/file-system"
import { SystemSettingsProvider, useSystemSettings } from "@/components/system-settings-context"
import type { AppWindow } from "@/types/app-window"

interface DesktopScreenProps {
  onLogout: () => void
}

function DesktopContent(
  { onLogout }: DesktopScreenProps,
) {
  const { settings } = useSystemSettings()
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  const openApp = (appId: string, title: string, icon: string) => {
    const existingWindow = openWindows.find((window) => window.appId === appId)

    if (existingWindow) {
      // If the app is already open, just activate its window
      activateWindow(existingWindow.id)

      // If it was minimized, restore it
      if (existingWindow.isMinimized) {
        setOpenWindows(
          openWindows.map((window) => (window.id === existingWindow.id ? { ...window, isMinimized: false } : window)),
        )
      }
      return
    }

    const newWindow: AppWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      title,
      icon,
      position: { x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 },
      size: { width: 600, height: 400 },
      isMinimized: false,
      isMaximized: false,
      zIndex: openWindows.length + 1,
    }

    setOpenWindows([...openWindows, newWindow])
    setActiveWindowId(newWindow.id)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((window) => window.id !== windowId))
    if (activeWindowId === windowId) {
      const remainingWindows = openWindows.filter((window) => window.id !== windowId)
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null)
    }
  }

  const minimizeWindow = (windowId: string) => {
    setOpenWindows(openWindows.map((window) => (window.id === windowId ? { ...window, isMinimized: true } : window)))
  }

  const maximizeWindow = (windowId: string) => {
    setOpenWindows(
      openWindows.map((window) => (window.id === windowId ? { ...window, isMaximized: !window.isMaximized } : window)),
    )
  }

  const activateWindow = (windowId: string) => {
    setActiveWindowId(windowId)
    setOpenWindows(
      openWindows.map((window) =>
        window.id === windowId
          ? { ...window, zIndex: Math.max(...openWindows.map((w) => w.zIndex)) + 1, isMinimized: false }
          : window,
      ),
    )
  }

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setOpenWindows(openWindows.map((window) => (window.id === windowId ? { ...window, position } : window)))
  }

  const updateWindowSize = (windowId: string, size: { width: number; height: number }, position: { x: number; y: number }) => {
    setOpenWindows(openWindows.map((window) => (window.id === windowId ? { ...window, size, position } : window)))
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col ${settings.darkMode ? "dark" : ""}`}
      style={{
        backgroundImage: `url('${settings.wallpaper}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: `brightness(${settings.brightness}%)`,
      }}
    >
      <div className="flex-1 p-4">
        <div className="grid grid-cols-6 gap-4">
          <DesktopIcon
            id="notepad"
            title="Notepad"
            icon="FileText"
            onClick={() => openApp("notepad", "Notepad", "FileText")}
          />
          <DesktopIcon
            id="calculator"
            title="Calculator"
            icon="Calculator"
            onClick={() => openApp("calculator", "Calculator", "Calculator")}
          />
          <DesktopIcon
            id="browser"
            title="Internet Browser"
            icon="Globe"
            onClick={() => openApp("browser", "Internet Browser", "Globe")}
          />
          <DesktopIcon
            id="settings"
            title="Settings"
            icon="Settings"
            onClick={() => openApp("settings", "Settings", "Settings")}
          />
          <DesktopIcon
            id="file-explorer"
            title="File Explorer"
            icon="Folder"
            onClick={() => openApp("file-explorer", "File Explorer", "Folder")}
          />
        </div>
      </div>

      <WindowManager
        windows={openWindows}
        activeWindowId={activeWindowId}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onActivate={activateWindow}
        onUpdatePosition={updateWindowPosition}
        onUpdateSize={updateWindowSize}
        darkMode={settings.darkMode}
      />

      <TaskBar
        windows={openWindows}
        activeWindowId={activeWindowId}
        onWindowClick={activateWindow}
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        startMenuOpen={startMenuOpen}
      />

      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onAppClick={openApp}
        onLogout={onLogout}
      />
    </div>
  )
}

export default function Desktop({ onLogout }: DesktopScreenProps) {
  return (
    <SystemSettingsProvider>
      <FileSystemProvider>
        <DesktopContent onLogout={onLogout} />
      </FileSystemProvider>
    </SystemSettingsProvider>
  )
}
