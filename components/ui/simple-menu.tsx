"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MenuProps {
  children: React.ReactNode
}

export function Menu({ children }: MenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function MenuButton({ children, className, ...props }: MenuButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface MenuListProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  right?: boolean
}

export function MenuList({ children, isOpen, onClose, right }: MenuListProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
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

  return (
    <div
      ref={menuRef}
      className={`absolute ${right ? "left-[12rem] top-0" : "left-0"}  z-50 mt-1 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg`}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function MenuItem({ children, className, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function MenuDivider() {
  return <div className="-mx-1 my-1 h-px bg-muted" />
}

export function useMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return { isOpen, open, close, toggle }
}
