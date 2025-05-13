"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppClick: (appId: string, title: string, icon: string) => void
  onLogout: () => void
}

export default function StartMenu({ isOpen, onClose, onAppClick, onLogout }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // if target id is "start-button", do not close the menu
        const target = event.target as HTMLElement
        if (target.id !== "start-button") {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const apps = [
    { id: "notepad", title: "Notepad", icon: "FileText" },
    { id: "calculator", title: "Calculator", icon: "Calculator" },
    { id: "browser", title: "Internet Browser", icon: "Globe" },
    { id: "settings", title: "Settings", icon: "Settings" },
    { id: "file-explorer", title: "File Explorer", icon: "Folder" },
    { id: "cmd", title: "Command Prompt", icon: "Terminal" },
  ]

  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] || Icons.Square) as LucideIcon
  }

  return (
    <div
      ref={menuRef}
      className="absolute bottom-12 left-0 z-50 w-64 rounded-t-md bg-gray-800 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center space-x-3 border-b border-gray-700 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <Icons.User className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <div className="font-medium">Admin</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>

        <div className="mb-4 space-y-1">
          {apps.map((app) => {
            const IconComponent = getIconComponent(app.icon)
            return (
              <Button
                key={app.id}
                variant="ghost"
                className="w-full justify-start text-white"
                onClick={() => {
                  onAppClick(app.id, app.title, app.icon.toLowerCase())
                  onClose()
                }}
              >
                <IconComponent className="mr-2 h-5 w-5" />
                {app.title}
              </Button>
            )
          })}
        </div>

        <div className="border-t border-gray-700 pt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-red-800/50"
            onClick={() => {
              onLogout()
              onClose()
            }}
          >
            <Icons.LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
