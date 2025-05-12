"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SystemSettings {
  darkMode: boolean
  volume: number
  brightness: number
  wallpaper: string
  wifi: boolean
}

interface SystemSettingsContextType {
  settings: SystemSettings
  updateSettings: (newSettings: Partial<SystemSettings>) => void
}

const defaultSettings: SystemSettings = {
  darkMode: false,
  volume: 75,
  brightness: 100,
  wallpaper: "/wallpaper-default.webp",
  wifi: true,
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined)

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)

  // Load settings from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings: Partial<SystemSettings> = {}

      const savedDarkMode = localStorage.getItem("os_darkMode")
      if (savedDarkMode !== null) savedSettings.darkMode = savedDarkMode === "true"

      const savedVolume = localStorage.getItem("os_volume")
      if (savedVolume !== null) savedSettings.volume = Number.parseInt(savedVolume)

      const savedBrightness = localStorage.getItem("os_brightness")
      if (savedBrightness !== null) savedSettings.brightness = Number.parseInt(savedBrightness)

      const savedWallpaper = localStorage.getItem("os_wallpaper")
      if (savedWallpaper) savedSettings.wallpaper = savedWallpaper

      setSettings((prev) => ({ ...prev, ...savedSettings }))
    }
  }, [])

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev, ...newSettings }

      // Save to localStorage
      if (typeof window !== "undefined") {
        if (newSettings.darkMode !== undefined) localStorage.setItem("os_darkMode", newSettings.darkMode.toString())

        if (newSettings.volume !== undefined) localStorage.setItem("os_volume", newSettings.volume.toString())

        if (newSettings.brightness !== undefined)
          localStorage.setItem("os_brightness", newSettings.brightness.toString())

        if (newSettings.wallpaper !== undefined) localStorage.setItem("os_wallpaper", newSettings.wallpaper)
      }

      return updatedSettings
    })
  }

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings }}>{children}</SystemSettingsContext.Provider>
  )
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext)
  if (context === undefined) {
    throw new Error("useSystemSettings must be used within a SystemSettingsProvider")
  }
  return context
}
