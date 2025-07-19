"use client"

import { useState, useEffect } from "react"
import LoginScreen from "@/components/login-screen"
import Desktop from "@/components/desktop"
import PostIt from "@/components/post-it"
import { Toaster } from "@/components/ui/toaster"
import BootScreen from "@/components/boot-screen"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Home() {
  const isMobile = useIsMobile()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate OS boot time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 8000) // Longer boot time to enjoy the animation
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (username: string, password: string) => {
    // Check credentials against the ones on the post-it
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid credentials. Check the post-it note for help!")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center inset-0 z-50 p-4 dark">
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-lime-900 to-black">
          <div className="absolute inset-0 opacity-20">
            <div className="bggrid absolute left-0 top-0 grid size-full grid-cols-4 grid-rows-16 gap-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="rounded-md bg-white" />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="text-center text-foreground relative bg-background/80 backdrop-blur-md rounded-lg px-8 pt-8 shadow-lg z-10 flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold mb-4">Mobile View Unavailable</h2>
          <p className="text-muted-foreground border-y py-4">
            This Virtual OS simulator not optimized for mobile devices.
            <br />
            Please use a desktop or tablet.
          </p>
          <p className="text-muted-foreground mb-2">Talos - KwikKill</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-800 p-6">
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-lime-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="bggrid absolute left-0 top-0 grid size-full grid-cols-12 grid-rows-12 gap-4">
            {Array.from({ length: 144 }).map((_, i) => {
              const delay = `${((i % 12) + (Math.floor(i / 12))) * 0.1}s`; // Diagonal wave
              return (
                <div
                  key={i}
                  className="rounded-md bg-white shadow-xl"
                  style={{ '--delay': delay } as React.CSSProperties}
                />
              );
            })}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>
      <div className="relative h-full w-full max-w-6xl rounded-xl bg-black p-8 shadow-2xl overflow-visible">
        {/* Computer screen bezel */}
        <div className="absolute inset-0 rounded-xl border-8 border-gray-800 shadow-inner"></div>

        {/* Post-it note */}
        <PostIt username="admin" password="password123" />

        {/* Screen content */}
        <div className="screen relative h-full w-full overflow-hidden rounded-md bg-blue-900">
          {isLoading ? <BootScreen /> : isLoggedIn ? <Desktop onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}
          <Toaster />
        </div>
      </div>
    </div>
  )
}
