"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"
import type { AppWindow } from "@/types/app-window"

interface TaskBarProps {
  windows: AppWindow[]
  activeWindowId: string | null
  onWindowClick: (windowId: string) => void
  onStartClick: () => void
  startMenuOpen: boolean
}

export default function TaskBar({ windows, activeWindowId, onWindowClick, onStartClick, startMenuOpen }: TaskBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
  }

  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] || Icons.Square) as LucideIcon
  }

  return (
    <div className="flex h-12 w-full items-center justify-between bg-gray-800 px-4 shadow-md">
      <div className="flex items-center">
        <Button
          id="start-button"
          variant={startMenuOpen ? "default" : "secondary"}
          className="h-10 w-10 rounded-full p-0"
          onClick={onStartClick}
        >
          <Icons.Menu
            className={`h-5 w-5 ${startMenuOpen ? "text-black" : "text-white"}`}
          />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-start space-x-1 px-2">
        {windows.map((window) => {
          const IconComponent = getIconComponent(window.icon as keyof typeof Icons)
          return (
            <Button
              key={window.id}
              variant={activeWindowId === window.id ? "default" : "secondary"}
              className="h-8 justify-start px-2 text-xs"
              onClick={() => onWindowClick(window.id)}
            >
              <IconComponent className="mr-1 h-4 w-4" />
              <span className="max-w-24 truncate">{window.title}</span>
            </Button>
          )
        })}
      </div>

      <div className="flex items-center space-x-4 text-white">
        <div className="text-xs text-right">
          <div>{formatTime(currentTime)}</div>
          <div>{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  )
}
