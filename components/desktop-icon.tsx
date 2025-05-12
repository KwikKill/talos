"use client"

import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface DesktopIconProps {
  id: string
  title: string
  icon: string
  onClick: () => void
}

export default function DesktopIcon({ id, title, icon, onClick }: DesktopIconProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Square

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center p-2 text-center hover:bg-white/10"
      onClick={onClick}
    >
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-md bg-gray-700/50 p-2">
        <IconComponent className="h-8 w-8 text-white" />
      </div>
      <span className="max-w-full truncate text-xs text-white">{title}</span>
    </div>
  )
}
